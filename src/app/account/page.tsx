import Link from "next/link";
import { deleteAddress, logoutCustomer, saveAddress, updateCustomerProfile } from "@/app/account/actions";
import { Textarea } from "@/components/ui/textarea";
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
  const addresses = await prisma.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] });

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

      <Link href="/account/support" className="inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">پشتیبانی و تیکت‌ها</Link>

      <Card className="p-5">
        <h2 className="font-bold">آدرس‌های من</h2>
        <form action={saveAddress} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="title" placeholder="عنوان آدرس (خانه، محل کار)" required />
          <Input name="recipient" placeholder="نام گیرنده" required />
          <Input name="phone" placeholder="شماره تماس گیرنده" required inputMode="tel" dir="ltr" />
          <Input name="postalCode" placeholder="کدپستی ۱۰ رقمی" required inputMode="numeric" dir="ltr" />
          <Input name="province" placeholder="استان" required />
          <Input name="city" placeholder="شهر" required />
          <Input name="plaque" placeholder="پلاک" />
          <Input name="unit" placeholder="واحد" />
          <div className="md:col-span-2"><Textarea name="address" placeholder="نشانی کامل" required /></div>
          <label className="flex items-center gap-2 text-sm font-medium"><input name="isDefault" type="checkbox" /> انتخاب به‌عنوان آدرس پیش‌فرض</label>
          <Button type="submit" className="md:col-span-2">افزودن آدرس</Button>
        </form>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {addresses.map((address) => <div key={address.id} className="rounded-xl border p-4 text-sm">
            <div className="flex justify-between gap-3"><p className="font-bold">{address.title}{address.isDefault ? " · پیش‌فرض" : ""}</p><form action={deleteAddress}><input type="hidden" name="id" value={address.id} /><button className="text-destructive">حذف</button></form></div>
            <p className="mt-2">{address.recipient} · {address.phone}</p><p className="mt-1 text-muted-foreground">{address.province}، {address.city} — {address.address}</p>
          </div>)}
        </div>
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
