"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notifications";

export async function createTicket(formData: FormData) {
  const user = await requireCustomer();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const orderId = String(formData.get("orderId") ?? "").trim() || null;
  if (subject.length < 3 || body.length < 3) redirect("/account/support?error=1");
  if (orderId && !(await prisma.order.findFirst({ where: { id: orderId, userId: user.id } }))) redirect("/account/support?error=1");
  const ticket = await prisma.supportTicket.create({ data: { userId: user.id, orderId, subject, messages: { create: { body } } } });
  await notify({ type: "ticket_created", title: "تیکت پشتیبانی جدید", body: `${user.name} — ${ticket.subject}` });
  redirect(`/account/support/${ticket.id}`);
}

export async function replyToTicket(formData: FormData) {
  const user = await requireCustomer();
  const ticketId = String(formData.get("ticketId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return;
  const ticket = await prisma.supportTicket.findFirst({ where: { id: ticketId, userId: user.id } });
  if (!ticket) redirect("/account/support");
  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "OPEN", messages: { create: { body } } } });
  await notify({ type: "ticket_reply", title: "پاسخ جدید مشتری", body: `${user.name} در تیکت ${ticket.subject}` });
  revalidatePath(`/account/support/${ticketId}`);
}
