"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { validateCoupon } from "@/lib/coupon";

export async function validateCouponCode(code: string, subtotal: number) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { ok: false as const, error: "کد تخفیف را وارد کنید." };
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  const result = validateCoupon(coupon, subtotal);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    code: coupon!.code,
    discount: result.discount
  };
}

export async function getActiveShippingMethods() {
  return prisma.shippingMethod.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getPublishedCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function markNotificationsRead() {
  await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
  revalidatePath("/admin");
}
