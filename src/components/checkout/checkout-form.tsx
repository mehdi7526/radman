"use client";

import { useState, useTransition } from "react";
import { ProductImage } from "@/components/product/product-image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createCheckout } from "@/app/checkout/actions";
import { validateCouponCode } from "@/app/shop/actions";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";

type ShippingMethod = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

type CheckoutFormProps = {
  shippingMethods: ShippingMethod[];
  defaultValues?: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
  };
};

export function CheckoutForm({ shippingMethods, defaultValues }: CheckoutFormProps) {
  const { items, total, removeItem } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState(shippingMethods[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [isCheckingCoupon, startCouponTransition] = useTransition();

  const shippingCost = shippingMethods.find((method) => method.id === shippingMethodId)?.price ?? 0;
  const payable = Math.max(0, total - discount + shippingCost);

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold">برای تسویه حساب، سبد خرید خالی نباشد.</h1>
          <Button asChild className="mt-6">
            <Link href="/products">انتخاب محصول</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (shippingMethods.length === 0) {
    return (
      <div className="container py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold">در حال حاضر روش ارسالی فعال نیست.</h1>
          <p className="mt-3 text-muted-foreground">لطفاً بعداً دوباره تلاش کنید.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
      <form
        className="space-y-5 rounded-lg border bg-white p-6 shadow-water"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          const formData = new FormData(event.currentTarget);
          startTransition(async () => {
            const result = await createCheckout({
              customerName: String(formData.get("customerName")),
              customerPhone: String(formData.get("customerPhone")),
              customerEmail: String(formData.get("customerEmail")),
              address: String(formData.get("address")),
              note: String(formData.get("note")),
              couponCode: couponCode || undefined,
              shippingMethodId,
              items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
            });
            if (result?.ok === false) {
              result.missingProductIds?.forEach((productId) => removeItem(productId));
              setError(result.error);
            }
          });
        }}
      >
        <div>
          <p className="text-sm font-bold text-primary">تسویه حساب</p>
          <h1 className="mt-2 text-3xl font-black text-sky-950">اطلاعات ارسال</h1>
        </div>
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-destructive">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            نام و نام خانوادگی
            <Input name="customerName" defaultValue={defaultValues?.customerName} required />
          </label>
          <label className="space-y-2 text-sm font-medium">
            شماره تماس
            <Input name="customerPhone" defaultValue={defaultValues?.customerPhone} required inputMode="tel" />
          </label>
        </div>
        <label className="space-y-2 text-sm font-medium">
          ایمیل
          <Input name="customerEmail" type="email" defaultValue={defaultValues?.customerEmail} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          آدرس
          <Textarea name="address" required />
        </label>
        <label className="space-y-2 text-sm font-medium">
          توضیحات سفارش
          <Textarea name="note" />
        </label>

        <div className="space-y-3 rounded-md border p-4">
          <p className="text-sm font-bold">روش ارسال</p>
          {shippingMethods.map((method) => (
            <label key={method.id} className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={shippingMethodId === method.id}
                onChange={() => setShippingMethodId(method.id)}
                className="mt-1"
              />
              <span className="flex-1">
                <span className="font-bold">{method.name}</span>
                {method.description ? (
                  <span className="mt-1 block text-sm text-muted-foreground">{method.description}</span>
                ) : null}
              </span>
              <span className="text-sm font-bold">{formatPrice(method.price)}</span>
            </label>
          ))}
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <p className="text-sm font-bold">کد تخفیف</p>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="مثلاً RADMAN10"
              dir="ltr"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isCheckingCoupon || !couponCode.trim()}
              onClick={() => {
                startCouponTransition(async () => {
                  const result = await validateCouponCode(couponCode, total);
                  if (result.ok) {
                    setDiscount(result.discount);
                    setCouponMessage(`تخفیف ${formatPrice(result.discount)} اعمال شد.`);
                  } else {
                    setDiscount(0);
                    setCouponMessage(result.error);
                  }
                });
              }}
            >
              {isCheckingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "اعمال"}
            </Button>
          </div>
          {couponMessage ? <p className="text-sm text-muted-foreground">{couponMessage}</p> : null}
        </div>

        <Button disabled={isPending} size="lg" className="w-full">
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          پرداخت آزمایشی — {formatPrice(payable)}
        </Button>
      </form>
      <aside className="h-fit space-y-4 rounded-lg border bg-white p-6 shadow-water">
        <h2 className="font-bold text-sky-950">خلاصه سفارش</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 border-b pb-4 last:border-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? <ProductImage src={item.imageUrl} alt={item.name} fill className="object-cover" /> : null}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold">{item.name}</p>
              <p className="mt-1 text-muted-foreground">تعداد: {item.quantity}</p>
            </div>
            <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="space-y-2 border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span>جمع کالاها</span>
            <span>{formatPrice(total)}</span>
          </div>
          {discount > 0 ? (
            <div className="flex items-center justify-between text-emerald-700">
              <span>تخفیف</span>
              <span>- {formatPrice(discount)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span>هزینه ارسال</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 text-lg font-black">
          <span>مبلغ قابل پرداخت</span>
          <span className="text-primary">{formatPrice(payable)}</span>
        </div>
      </aside>
    </div>
  );
}
