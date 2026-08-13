"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notifications";

export async function requestOrderService(formData: FormData) {
  const user = await requireCustomer();
  const orderId = String(formData.get("orderId") ?? "");
  const type = String(formData.get("type") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const order = await prisma.order.findFirst({ where: { id: orderId, userId: user.id } });
  if (!order || !["CANCEL", "RETURN"].includes(type) || reason.length < 3) redirect(`/account/orders/${orderId}?serviceError=1`);
  if (type === "CANCEL" && !["PENDING", "PAID", "PROCESSING"].includes(order.status)) redirect(`/account/orders/${orderId}?serviceError=1`);
  const existing = await prisma.returnRequest.findFirst({ where: { orderId, type, status: { in: ["REQUESTED", "APPROVED", "RECEIVED"] } } });
  if (existing) redirect(`/account/orders/${orderId}?serviceError=1`);
  await prisma.$transaction(async tx => {
    await tx.returnRequest.create({ data: { orderId, userId: user.id, type, reason } });
    await tx.orderEvent.create({ data: { orderId, type: type === "CANCEL" ? "cancel_requested" : "return_requested", message: reason } });
  });
  await notify({ type: type === "CANCEL" ? "cancel_requested" : "return_requested", title: type === "CANCEL" ? "درخواست لغو سفارش" : "درخواست مرجوعی", body: `سفارش ${orderId} — ${user.name}` });
  revalidatePath(`/account/orders/${orderId}`); redirect(`/account/orders/${orderId}`);
}
