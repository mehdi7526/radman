import Link from "next/link";
import { logoutCustomer, updateCustomerProfile } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatDate, formatOrderStatus, formatPrice, orderStatusColor } from "@/lib/format";

export default async function AccountPage() {
  const user = await requireCustomer();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="container space-y-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-sky-950">حساب کاربری</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={logoutCustomer}>
          <Button variant="outline">خروج</Button>
        </form>
      </div>

      <Card className="p-5">
        <h2 className="font-bold">پروفایل</h2>
        <form action={updateCustomerProfile} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="name" defaultValue={user.name} required />
          <Input name="phone" defaultValue={user.phone ?? ""} required />
          <Button type="submit" className="md:col-span-2">ذخیره پروفایل</Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-bold">سفارش‌های من</h2>
        <div className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز سفارشی ثبت نکرده‌اید.</p>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4 transition hover:bg-sky-50"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                  <span className={`mt-1 inline-block rounded-md px-2 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
