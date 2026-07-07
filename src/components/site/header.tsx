import Link from "next/link";
import { Suspense } from "react";
import { Droplets, ShoppingBag, User, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

function HeaderAuthLinks({ role }: { role: "ADMIN" | "CUSTOMER" | null }) {
  if (role === "CUSTOMER") {
    return (
      <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/account">
        حساب من
      </Link>
    );
  }

  if (role === "ADMIN") {
    return (
      <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/admin">
        پنل مدیریت
      </Link>
    );
  }

  return (
    <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/account/login">
      ورود
    </Link>
  );
}

async function HeaderAuthNav() {
  const session = await getSession();
  return <HeaderAuthLinks role={session?.role ?? null} />;
}

async function HeaderAuthIcon() {
  const session = await getSession();
  const href = session?.role === "ADMIN" ? "/admin" : session?.role === "CUSTOMER" ? "/account" : "/account/login";

  return (
    <Button asChild variant="ghost" size="icon" aria-label="حساب کاربری">
      <Link href={href}>
        <User className="h-5 w-5" />
      </Link>
    </Button>
  );
}

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
          <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/cart">
            سبد خرید
          </Link>
          <Link className="rounded-md px-4 py-2 transition hover:bg-white hover:text-primary" href="/track">
            پیگیری سفارش
          </Link>
          <Suspense fallback={<span className="rounded-md px-4 py-2 text-slate-400">ورود</span>}>
            <HeaderAuthNav />
          </Suspense>
        </nav>
        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <Button variant="ghost" size="icon" aria-label="حساب کاربری" disabled>
                <User className="h-5 w-5" />
              </Button>
            }
          >
            <HeaderAuthIcon />
          </Suspense>
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
