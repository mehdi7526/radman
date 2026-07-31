"use client";

import Link from "next/link";
import { Badge } from "@mui/material";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function CartLink() {
  const { items, isReady } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <Button asChild variant="ghost" size="icon" aria-label="سبد خرید"><Link href="/cart"><Badge badgeContent={isReady ? count : 0} color="primary" overlap="circular" invisible={!isReady || count === 0} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ "& .MuiBadge-badge": { transform: "translate(85%, -85%)", minWidth: 18, height: 18, fontSize: 10, fontWeight: 800 } }}><ShoppingBag className="size-5" aria-hidden="true" /></Badge></Link></Button>;
}
