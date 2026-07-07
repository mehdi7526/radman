import Link from "next/link";
import { Droplets, ShoppingBag, ShieldCheck, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/80 bg-white/88 shadow-sm backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-sky-950">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-950 text-white shadow-water">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg">رادمان</span>
            <span className="block text-xs font-medium text-slate-500">تصفیه آب و هوا</span>
          </span>
        </Link>
        <nav className="hidden items-center rounded-lg border border-sky-100 bg-sky-50/70 px-2 py-1 text-sm font-semibold text-slate-700 md:flex">
          <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/products">
            محصولات
          </Link>
          <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/checkout">
            تسویه حساب
          </Link>
          <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/admin">
            ادمین
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="سبد خرید">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/products">
              <Wind className="h-4 w-4" />
              شروع انتخاب
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
