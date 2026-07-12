import Link from "next/link";
import { LayoutDashboard, LogOut, Package, Percent, ShoppingBag, Tags, Truck } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: Percent },
  { href: "/admin/shipping", label: "روش‌های ارسال", icon: Truck }
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit space-y-4 border bg-porcelain p-4 shadow-subtle">
        <Logo href="/admin" size="sm" />
        <p className="text-xs font-bold text-signal">پنل مدیریت</p>
        <nav className="space-y-1" aria-label="منوی مدیریت">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted hover:text-primary"
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin}>
          <Button variant="outline" className="w-full">
            <LogOut className="size-4" aria-hidden="true" />
            خروج
          </Button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
