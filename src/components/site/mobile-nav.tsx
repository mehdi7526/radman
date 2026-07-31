"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Collapse, Divider, List, ListItemButton, ListItemText, Paper } from "@mui/material";
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

      {open ? <button type="button" className="fixed inset-0 z-overlay bg-slate-950/20 backdrop-blur-[1px]" aria-label="بستن منو" onClick={() => setOpen(false)} /> : null}
      <Collapse
        in={open}
        timeout={260}
        unmountOnExit
        className="fixed inset-x-3 top-[76px] z-modal origin-top"
      >
        <Paper component="nav" id={panelId} aria-label="منوی اصلی" elevation={0} className="overflow-hidden rounded-2xl border border-[#dbe7e8] bg-white/95 p-2 shadow-[0_18px_42px_rgba(18,53,72,0.2)] backdrop-blur-xl">
          <List disablePadding>
            {[...links, authLink].map((link, index) => (
              <div key={link.href}>
                {index === links.length ? <Divider sx={{ my: 0.75 }} /> : null}
                <ListItemButton component={Link} href={link.href} onClick={() => setOpen(false)} sx={{ minHeight: 48, borderRadius: 2, px: 2, "&:hover": { backgroundColor: "#eaf5f5" } }}>
                  <ListItemText primary={link.label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 700, color: "#183247" } } }} />
                </ListItemButton>
              </div>
            ))}
          </List>
        </Paper>
      </Collapse>
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
