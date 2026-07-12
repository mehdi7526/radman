import Link from "next/link";

import { Suspense } from "react";

import { ShoppingBag, User } from "lucide-react";

import { Logo } from "@/components/brand/logo";

import { Button } from "@/components/ui/button";

import { MobileNav, MobileNavFallback } from "@/components/site/mobile-nav";

import { getSession } from "@/lib/auth/session";



function authLinkForRole(role: "ADMIN" | "CUSTOMER" | null) {

  if (role === "CUSTOMER") return { href: "/account", label: "حساب من" };

  if (role === "ADMIN") return { href: "/admin", label: "پنل مدیریت" };

  return { href: "/account/login", label: "ورود" };

}



async function HeaderMobileNav() {

  const session = await getSession();

  return <MobileNav authLink={authLinkForRole(session?.role ?? null)} />;

}



async function HeaderAuthIcon() {

  const session = await getSession();

  const href = authLinkForRole(session?.role ?? null).href;



  return (

    <Button asChild variant="ghost" size="icon" aria-label="حساب کاربری">

      <Link href={href}>

        <User className="size-5" aria-hidden="true" />

      </Link>

    </Button>

  );

}



export function Header() {

  return (

    <header className="sticky top-0 z-sticky border-b border-border bg-porcelain/95 backdrop-blur-sm">

      <div className="container flex h-[72px] items-center justify-between gap-4">

        <Logo href="/" size="md" priority />



        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 md:flex">

          {[

            { href: "/products", label: "محصولات" },

            { href: "/cart", label: "سبد خرید" },

            { href: "/track", label: "پیگیری سفارش" }

          ].map((item) => (

            <Link

              key={item.href}

              href={item.href}

              className="min-h-11 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:text-oxygen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

            >

              {item.label}

            </Link>

          ))}

          <Suspense fallback={<span className="px-4 py-2 text-sm text-muted-foreground">ورود</span>}>

            <HeaderAuthLink />

          </Suspense>

        </nav>



        <div className="flex items-center gap-1">

          <Suspense fallback={<MobileNavFallback />}>

            <HeaderMobileNav />

          </Suspense>

          <Suspense

            fallback={

              <Button variant="ghost" size="icon" aria-label="حساب کاربری" disabled>

                <User className="size-5" aria-hidden="true" />

              </Button>

            }

          >

            <HeaderAuthIcon />

          </Suspense>

          <Button asChild variant="ghost" size="icon" aria-label="سبد خرید">

            <Link href="/cart">

              <ShoppingBag className="size-5" aria-hidden="true" />

            </Link>

          </Button>

          <Button asChild className="hidden sm:inline-flex" variant="accent">

            <Link href="/products">شروع انتخاب</Link>

          </Button>

        </div>

      </div>

    </header>

  );

}



async function HeaderAuthLink() {

  const session = await getSession();

  const link = authLinkForRole(session?.role ?? null);



  return (

    <Link

      href={link.href}

      className="min-h-11 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:text-oxygen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

    >

      {link.label}

    </Link>

  );

}


