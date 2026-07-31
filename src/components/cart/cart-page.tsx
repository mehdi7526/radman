"use client";

import { ProductImage } from "@/components/product/product-image";
import Link from "next/link";
import { Minus, PackageCheck, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export function CartPage() {
  const { items, total, updateQuantity, removeItem, isReady } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isReady) {
    return <div className="container py-16"><Card className="mx-auto max-w-xl p-8 text-center text-muted-foreground">در حال بارگذاری سبد خرید…</Card></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold">سبد خرید خالی است</h1>
          <p className="mt-3 text-muted-foreground">برای شروع، محصولات رادمان را ببینید.</p>
          <Button asChild className="mt-6">
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-sky-950">سبد خرید</h1>
        {items.map((item) => (
          <Card key={item.productId} className="grid gap-5 rounded-2xl p-5 sm:grid-cols-[120px_1fr_auto] md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? <ProductImage src={item.imageUrl} alt={item.name} fill className="object-cover" /> : null}
            </div>
            <div className="space-y-2">
              <Link href={`/products/${item.slug}`} className="font-bold">
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
              <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-subtle">
                <Button variant="ghost" size="sm" aria-label="کاهش تعداد" sx={{ minWidth: 32, width: 32, minHeight: 32, height: 32, p: 0 }} onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}><Minus className="size-4" /></Button>
                <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                <Button variant="ghost" size="sm" aria-label="افزایش تعداد" sx={{ minWidth: 32, width: 32, minHeight: 32, height: 32, p: 0 }} onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus className="size-4" /></Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)} aria-label="حذف محصول">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-lift lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-50 text-primary"><PackageCheck className="size-5" /></div>
          <div><p className="font-bold text-foreground">خلاصه سفارش</p><p className="mt-0.5 text-xs text-muted-foreground">{itemCount} کالا در سبد شما</p></div>
        </div>
        <div className="my-6 h-px bg-border" />
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">مبلغ کالاها</span><span className="font-semibold text-foreground">{formatPrice(total)}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">هزینه ارسال</span><span className="text-xs font-semibold text-oxygen">در تسویه حساب</span></div>
        </div>
        <div className="mt-6 rounded-xl bg-cyan-50/70 p-4"><p className="text-xs text-muted-foreground">جمع موقت</p><p className="mt-1 text-xl font-black text-primary">{formatPrice(total)}</p></div>
        <Button asChild className="w-full" sx={{ mt: 3 }}>
          <Link href="/checkout">ادامه و تسویه حساب</Link>
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-emerald-600" /> پرداخت امن</p>
      </aside>
    </div>
  );
}
