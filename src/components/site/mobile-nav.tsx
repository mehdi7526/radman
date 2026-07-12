"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";

type MobileNavProps = {
  authLink: { href: string; label: string };
};

const links = [
  { href: "/products", label: "محصولات" },
  { href: "/cart", label: "سبد خرید" },
  { href: "/track", label: "پیگیری سفارش" }
];

export function MobileNav({ authLink }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-overlay bg-foreground/20"
            aria-label="بستن منو"
            onClick={() => setOpen(false)}
          />
          <nav
            id={panelId}
            aria-label="منوی اصلی"
            className="fixed inset-x-0 top-[72px] z-modal border-b border-border bg-porcelain px-4 py-4 shadow-lift"
          >
            <ul className="space-y-1">
              {[...links, authLink].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center px-3 text-sm font-semibold text-foreground hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}

export function MobileNavFallback() {
  return (
    <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" disabled>
      <Menu className="size-5" aria-hidden="true" />
    </Button>
  );
}
