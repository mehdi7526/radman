import type { OrderStatus, Prisma } from "@prisma/client";

export async function changeOrderStatus(tx: Prisma.TransactionClient, id: string, status: OrderStatus, trackingCode?: string | null) {
  const order = await tx.order.findUniqueOrThrow({ where: { id }, include: { items: true, payment: true } });
  if (order.status === "CANCELLED" && status !== "CANCELLED") {
    return { ok: false as const, error: "سفارش لغوشده قابل فعال‌سازی مجدد نیست." };
  }
  if (status !== "CANCELLED" && order.payment?.status !== "SUCCEEDED") {
    return { ok: false as const, error: "ابتدا باید پرداخت سفارش تأیید شود." };
  }
  if (status === "CANCELLED" && order.status !== "CANCELLED") {
    if (order.payment?.status === "SUCCEEDED") {
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { inventory: { increment: item.quantity } } });
      }
    }
    await tx.payment.updateMany({ where: { orderId: id, status: "PENDING" }, data: { status: "FAILED" } });
  }
  await tx.order.update({ where: { id }, data: { status, ...(trackingCode !== undefined ? { trackingCode } : {}) } });
  return { ok: true as const };
}
