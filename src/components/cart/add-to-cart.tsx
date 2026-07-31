"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

type AddToCartProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    inventory: number;
    imageUrl?: string;
  };
};

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  return (
    <div className="space-y-4">
      <div className="flex w-36 items-center justify-between rounded-xl border border-border bg-white p-1 shadow-subtle">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          aria-label="کاهش تعداد"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-bold">{quantity}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((value) => Math.min(product.inventory, value + 1))}
          aria-label="افزایش تعداد"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={product.inventory < 1}
        onClick={() =>
          {
            addItem({ productId: product.id, slug: product.slug, name: product.name, price: product.price, imageUrl: product.imageUrl }, quantity);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
          }
        }
      >
        {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        {added ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
      </Button>
    </div>
  );
}
