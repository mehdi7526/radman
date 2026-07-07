"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function ClearCartOnSuccess({ shouldClear }: { shouldClear: boolean }) {
  const { clear } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (shouldClear && !clearedRef.current) {
      clearedRef.current = true;
      clear();
    }
  }, [shouldClear, clear]);

  return null;
}
