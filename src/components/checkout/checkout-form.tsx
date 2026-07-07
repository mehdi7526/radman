"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createCheckout } from "@/app/checkout/actions";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";

export function CheckoutForm() {
  const { items, total, removeItem } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
            <Input name="customerName" required />
          </label>
          <label className="space-y-2 text-sm font-medium">
            شماره تماس
            <Input name="customerPhone" required inputMode="tel" />
          </label>
        </div>
        <label className="space-y-2 text-sm font-medium">
          ایمیل
          <Input name="customerEmail" type="email" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          آدرس
          <Textarea name="address" required />
        </label>
        <label className="space-y-2 text-sm font-medium">
          توضیحات سفارش
          <Textarea name="note" />
        </label>
        <Button disabled={isPending} size="lg" className="w-full">
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          پرداخت آزمایشی
        </Button>
      </form>
      <aside className="h-fit space-y-4 rounded-lg border bg-white p-6 shadow-water">
        <h2 className="font-bold text-sky-950">خلاصه سفارش</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 border-b pb-4 last:border-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" /> : null}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold">{item.name}</p>
              <p className="mt-1 text-muted-foreground">تعداد: {item.quantity}</p>
            </div>
            <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 text-lg font-black">
          <span>مجموع</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
