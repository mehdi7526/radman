import Link from "next/link";
import { Card } from "@/components/ui/card";
import { markNotificationsRead } from "@/app/shop/actions";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalProducts,
    publishedProducts,
    totalOrders,
    paidOrders,
    revenueAgg,
    lowStockProducts,
    recentOrders,
    notifications,
    unreadNotifications
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } } }),
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: monthStart }
      },
      _sum: { total: true }
    }),
    prisma.product.findMany({
      where: { inventory: { lte: 3 }, isPublished: true },
      orderBy: { inventory: "asc" },
      take: 5
    }),
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.notification.count({ where: { isRead: false } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold text-primary">داشبورد</p>
        <h2 className="mt-2 text-3xl font-black text-sky-950">نمای کلی فروشگاه</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["محصولات", totalProducts, `${publishedProducts} منتشرشده`],
          ["سفارش‌های موفق", paidOrders, `${totalOrders} کل سفارش‌ها`],
          ["درآمد این ماه", formatPrice(revenueAgg._sum.total ?? 0), "سفارش‌های پرداخت‌شده"],
          ["اعلان‌های جدید", unreadNotifications, "نیاز به بررسی"]
        ].map(([title, value, hint]) => (
          <Card key={title} className="p-5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-black text-sky-950">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-sky-950">موجودی کم</h3>
            <Link href="/admin/products" className="text-sm font-semibold text-primary">
              همه محصولات
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">محصولی با موجودی کم وجود ندارد.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span className="font-semibold">{product.name}</span>
                  <span className="text-amber-700">{product.inventory} عدد</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-sky-950">اعلان‌ها</h3>
            {unreadNotifications > 0 ? (
              <form action={markNotificationsRead}>
                <button type="submit" className="text-sm font-semibold text-primary">
                  علامت‌گذاری همه
                </button>
              </form>
            ) : null}
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-md border p-3 text-sm">
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-muted-foreground">{notification.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-sky-950">آخرین سفارش‌ها</h3>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary">
            مشاهده همه
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 transition hover:bg-sky-50"
            >
              <div>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <span className="font-bold text-primary">{formatPrice(order.total)}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
