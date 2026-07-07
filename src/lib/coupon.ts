import type { Coupon, DiscountType } from "@prisma/client";

export function calculateDiscount(subtotal: number, coupon: Pick<Coupon, "discountType" | "discountValue" | "minOrderAmount">) {
  if (subtotal < coupon.minOrderAmount) {
    return { ok: false as const, error: "حداقل مبلغ سفارش برای این کد تخفیف رعایت نشده است." };
  }

  let amount = 0;
  if (coupon.discountType === "PERCENT") {
    amount = Math.floor((subtotal * coupon.discountValue) / 100);
  } else {
    amount = coupon.discountValue;
  }

  return { ok: true as const, amount: Math.min(amount, subtotal) };
}

export function validateCoupon(
  coupon: Coupon | null,
  subtotal: number
): { ok: true; discount: number } | { ok: false; error: string } {
  if (!coupon) {
    return { ok: false, error: "کد تخفیف معتبر نیست." };
  }

  if (!coupon.isActive) {
    return { ok: false, error: "این کد تخفیف غیرفعال است." };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false, error: "مهلت استفاده از این کد تخفیف تمام شده است." };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, error: "ظرفیت استفاده از این کد تخفیف تکمیل شده است." };
  }

  const result = calculateDiscount(subtotal, coupon);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, discount: result.amount };
}

export function discountTypeLabel(type: DiscountType) {
  return type === "PERCENT" ? "درصدی" : "مبلغ ثابت";
}
