import { deleteCoupon, saveCoupon } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { discountTypeLabel } from "@/lib/coupon";
import { formatPrice } from "@/lib/format";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">کدهای تخفیف</h2>
      </div>

      <Card className="p-5">
        <h3 className="font-bold">کد جدید</h3>
        <form action={saveCoupon} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="code" placeholder="RADMAN10" dir="ltr" required />
          <Input name="description" placeholder="توضیح" />
          <select name="discountType" className="h-10 rounded-md border px-3 text-sm" defaultValue="PERCENT">
            <option value="PERCENT">درصدی</option>
            <option value="FIXED">مبلغ ثابت</option>
          </select>
          <Input name="discountValue" type="number" placeholder="مقدار تخفیف" required />
          <Input name="minOrderAmount" type="number" placeholder="حداقل سفارش" defaultValue={0} />
          <Input name="maxUses" type="number" placeholder="حداکثر استفاده (اختیاری)" />
          <Input name="expiresAt" type="date" />
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked />
            فعال
          </label>
          <Button type="submit" className="md:col-span-2">افزودن کد</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold" dir="ltr">{coupon.code}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {discountTypeLabel(coupon.discountType)} — {coupon.discountType === "PERCENT" ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                  {" | "}
                  استفاده: {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""}
                </p>
              </div>
              <form action={deleteCoupon}>
                <input type="hidden" name="id" value={coupon.id} />
                <Button variant="destructive" size="sm">حذف</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
