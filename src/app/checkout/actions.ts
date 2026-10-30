"use server";

import { redirect } from "next/navigation";
import { finalizeCheckout } from "@/lib/payment/checkout";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { validateCoupon } from "@/lib/coupon";
import { prisma } from "@/lib/db";
import { notifyCustomerOrderConfirmation, notifyOrderCreated } from "@/lib/notifications";
import { getPaymentProvider } from "@/lib/payment/provider";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "نام و نام خانوادگی را وارد کنید."),
  customerPhone: z.string().trim().min(8, "شماره تماس را وارد کنید."),
  customerEmail: z.string().email().optional().or(z.literal("")),
  postalCode: z.string().trim().regex(/^\d{10}$/, "کدپستی باید ۱۰ رقم باشد."),
  address: z.string().trim().min(8, "آدرس را کامل وارد کنید."),
  note: z.string().optional(),
  couponCode: z.string().optional(),
  shippingMethodId: z.string().min(1, "روش ارسال را انتخاب کنید."),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1)
      })
    )
    .min(1)
});

export async function createCheckout(input: unknown) {
  const parsedPayload = checkoutSchema.safeParse(input);

  if (!parsedPayload.success) {
    return {
      ok: false,
      error: parsedPayload.error.issues[0]?.message ?? "اطلاعات سفارش معتبر نیست."
    };
  }

  const payload = parsedPayload.data;
  const user = await getCurrentUser();
  if (user?.role !== "CUSTOMER") return { ok: false, error: "برای ثبت سفارش وارد حساب کاربری شوید." };

  const shippingMethod = await prisma.shippingMethod.findFirst({
    where: { id: payload.shippingMethodId, isActive: true }
  });

  if (!shippingMethod) {
    return { ok: false, error: "روش ارسال انتخاب‌شده معتبر نیست." };
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: payload.items.map((item) => item.productId) },
      isPublished: true
    }
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const missingProductIds = payload.items
    .filter((item) => !productMap.has(item.productId))
    .map((item) => item.productId);

  if (missingProductIds.length > 0) {
    return {
      ok: false,
      error: "یک یا چند محصول سبد خرید دیگر در فروشگاه موجود نیست. سبد خرید به‌روزرسانی شد.",
      missingProductIds
    };
  }

  const items = payload.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("محصول انتخاب‌شده پیدا نشد.");
    }
    if (product.inventory < item.quantity) {
      return null;
    }
    return { product, quantity: item.quantity };
  });

  if (items.some((item) => item === null)) {
    return { ok: false, error: "موجودی یکی از محصولات سبد خرید کافی نیست." };
  }

  const availableItems = items.filter((item) => item !== null);
  const subtotal = availableItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (payload.couponCode?.trim()) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: payload.couponCode.trim().toUpperCase() }
    });
    const couponResult = validateCoupon(coupon, subtotal);
    if (!couponResult.ok) {
      return { ok: false, error: couponResult.error };
    }
    discountAmount = couponResult.discount;
    couponId = coupon!.id;
    couponCode = coupon!.code;
  }

  const shippingCost = shippingMethod.price;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const order = await prisma.order.create({
    data: {
      userId: user?.role === "CUSTOMER" ? user.id : null,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || null,
      postalCode: payload.postalCode,
      address: payload.address,
      note: payload.note,
      subtotal,
      discountAmount,
      shippingCost,
      total,
      couponId,
      couponCode,
      shippingMethodId: shippingMethod.id,
      items: {
        create: availableItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price
        }))
      }
    }
  });

  await notifyOrderCreated({
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    total: order.total
  });

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/checkout/result`;
  const payment = await getPaymentProvider().createPayment({
    orderId: order.id,
    amount: total,
    callbackUrl
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: payment.provider,
      authority: payment.authority,
      amount: total,
      redirectUrl: payment.redirectUrl
    }
  });

  redirect(payment.redirectUrl);
}

export async function verifyCheckout(authority: string | null) {
  if (!authority) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const result = await finalizeCheckout(authority, user.id);
  if (result?.ok && "customerName" in result && result.customerName) {
    const { notifyOrderPaid } = await import("@/lib/notifications");
    await notifyOrderPaid({ id: result.orderId, customerName: result.customerName, total: result.amount, referenceId: result.referenceId });
    await notifyCustomerOrderConfirmation({ id: result.orderId, customerEmail: result.customerEmail, customerPhone: result.customerPhone });
  }
  return result;
}
