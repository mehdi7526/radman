import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { formatDate, formatOrderStatus, formatPrice, orderStatusColor } from "@/lib/format";

type TrackPageProps = {
  searchParams: Promise<{ id?: string; phone?: string }>;
};

export default async function TrackOrderPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const orderId = params.id?.trim();
  const phone = params.phone?.trim();

  const order =
    orderId && phone
      ? await prisma.order.findFirst({
          where: { id: orderId, customerPhone: phone },
          include: { items: { include: { product: true } }, shippingMethod: true }
        })
      : null;

  return (
    <div className="container max-w-2xl space-y-6 py-12">
      <div>
        <h1 className="text-3xl font-black text-sky-950">پیگیری سفارش</h1>
        <p className="mt-2 text-sm text-muted-foreground">شماره سفارش و تلفن ثبت‌شده را وارد کنید.</p>
      </div>

      <Card className="p-5">
        <form className="grid gap-4">
          <Input name="id" defaultValue={orderId} placeholder="شماره سفارش" dir="ltr" required />
          <Input name="phone" defaultValue={phone} placeholder="شماره تماس" inputMode="tel" required />
          <Button type="submit">بررسی وضعیت</Button>
        </form>
      </Card>

      {orderId && phone && !order ? (
        <Card className="p-5 text-center text-destructive">سفارشی با این مشخصات پیدا نشد.</Card>
      ) : null}

      {order ? (
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className={`rounded-md px-3 py-1 text-sm font-semibold ${orderStatusColor(order.status)}`}>
              {formatOrderStatus(order.status)}
            </span>
            <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
          </div>
          {order.trackingCode ? (
            <p className="text-sm">کد رهگیری: <span className="font-bold" dir="ltr">{order.trackingCode}</span></p>
          ) : null}
          <p className="text-sm text-muted-foreground">ارسال: {order.shippingMethod?.name ?? "—"}</p>
          <div className="space-y-2 border-t pt-4 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <p className="text-lg font-black">مجموع: {formatPrice(order.total)}</p>
          <Button asChild variant="outline">
            <Link href="/products">ادامه خرید</Link>
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
