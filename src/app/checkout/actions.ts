"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payment/provider";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "نام و نام خانوادگی را وارد کنید."),
  customerPhone: z.string().trim().min(8, "شماره تماس را وارد کنید."),
  customerEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().trim().min(8, "آدرس را کامل وارد کنید."),
  note: z.string().optional(),
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

  const unavailableItem = items.find((item) => item === null);

  if (unavailableItem === null) {
    return {
      ok: false,
      error: "موجودی یکی از محصولات سبد خرید کافی نیست."
    };
  }

  const availableItems = items.filter((item) => item !== null);

  const total = availableItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || null,
      address: payload.address,
      note: payload.note,
      total,
      items: {
        create: availableItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price
        }))
      }
    }
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
  if (!authority) {
    return null;
  }

  const payment = await prisma.payment.findFirst({
    where: { authority },
    include: { order: true }
  });

  if (!payment) {
    return null;
  }

  const result = await getPaymentProvider().verifyPayment(authority);

  if (result.ok) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED", referenceId: result.referenceId }
    });
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" }
    });
  }

  return {
    ok: result.ok,
    orderId: payment.orderId,
    referenceId: result.referenceId,
    amount: payment.amount
  };
}
