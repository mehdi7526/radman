import { prisma } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payment/provider";

export async function finalizeCheckout(authority: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { authority, order: { userId } },
      include: { order: { include: { items: true } } }
    });
    if (!payment) return null;
    const details = { orderId: payment.orderId, referenceId: payment.referenceId, amount: payment.amount, pending: false, alreadyVerified: false };
    if (payment.order.status === "CANCELLED" || payment.status === "FAILED") return { ...details, ok: false };
    if (payment.status === "SUCCEEDED") return { ...details, ok: true, alreadyVerified: true };

    const result = await getPaymentProvider().verifyPayment(authority);
    if (result.pending) return { ...details, ok: false, pending: true };
    if (!result.ok) {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      await tx.order.update({ where: { id: payment.orderId }, data: { status: "CANCELLED" } });
      return { ...details, ok: false };
    }

    // Check all lines together before decrementing, including duplicate product IDs.
    const quantities = new Map<string, number>();
    for (const item of payment.order.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    const products = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
    if ([...quantities].some(([id, quantity]) => (products.find(product => product.id === id)?.inventory ?? 0) < quantity)) {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      await tx.order.update({ where: { id: payment.orderId }, data: { status: "CANCELLED" } });
      return { ...details, ok: false, error: "موجودی محصولات کافی نبود و سفارش لغو شد." };
    }
    for (const [id, quantity] of quantities) {
      await tx.product.update({ where: { id }, data: { inventory: { decrement: quantity } } });
    }
    await tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCEEDED", referenceId: result.referenceId } });
    await tx.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
    if (payment.order.couponId) {
      await tx.coupon.update({ where: { id: payment.order.couponId }, data: { usedCount: { increment: 1 } } });
    }
    return { ...details, ok: true, referenceId: result.referenceId, customerName: payment.order.customerName,
      customerEmail: payment.order.customerEmail, customerPhone: payment.order.customerPhone };
  });
}
