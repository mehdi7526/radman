import Link from "next/link";
import { LayoutDashboard, LogOut, Package, Percent, ShoppingBag, Tags, Truck } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
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
      <aside className="h-fit space-y-4 rounded-lg border bg-white p-4 shadow-water">
        <div>
          <p className="text-sm font-bold text-primary">پنل مدیریت</p>
          <h1 className="mt-1 text-xl font-black text-sky-950">رادمان</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin}>
          <Button variant="outline" className="w-full">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
