"use client";

import { ProductImage } from "@/components/product/product-image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

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
          <Card key={item.productId} className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? <ProductImage src={item.imageUrl} alt={item.name} fill className="object-cover" /> : null}
            </div>
            <div className="space-y-2">
              <Link href={`/products/${item.slug}`} className="font-bold">
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
              <input
                className="h-10 w-24 rounded-md border px-3"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
              />
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
      <aside className="h-fit rounded-lg border bg-white p-6 shadow-water">
        <p className="text-sm text-muted-foreground">جمع کل</p>
        <p className="mt-2 text-2xl font-bold text-primary">{formatPrice(total)}</p>
        <Button asChild className="mt-6 w-full">
          <Link href="/checkout">ادامه و تسویه حساب</Link>
        </Button>
      </aside>
    </div>
  );
}
