import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { adminOrderStatuses, formatDate, formatOrderStatus, formatPrice, orderStatusColor } from "@/lib/format";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      payment: true,
      shippingMethod: true,
      coupon: true
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">جزئیات سفارش</h2>
        <p className="mt-1 text-sm text-muted-foreground">{order.id}</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-bold">{order.customerName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{order.customerPhone}</p>
            {order.customerEmail ? <p className="text-sm text-muted-foreground">{order.customerEmail}</p> : null}
          </div>
          <span className={`rounded-md px-3 py-1 text-sm font-semibold ${orderStatusColor(order.status)}`}>
            {formatOrderStatus(order.status)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{order.address}</p>
        {order.note ? <p className="mt-2 text-sm text-muted-foreground">یادداشت: {order.note}</p> : null}
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          <p>تاریخ: {formatDate(order.createdAt)}</p>
          <p>ارسال: {order.shippingMethod?.name ?? "—"}</p>
          <p>کد تخفیف: {order.couponCode ?? "—"}</p>
          <p>کد رهگیری: {order.trackingCode ?? "—"}</p>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold">اقلام سفارش</h3>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>{item.product.name} × {item.quantity}</span>
              <span className="font-bold">{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>جمع کالاها</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discountAmount > 0 ? (
            <div className="flex justify-between text-emerald-700"><span>تخفیف</span><span>- {formatPrice(order.discountAmount)}</span></div>
          ) : null}
          <div className="flex justify-between"><span>هزینه ارسال</span><span>{formatPrice(order.shippingCost)}</span></div>
          <div className="flex justify-between text-lg font-black"><span>مجموع</span><span className="text-primary">{formatPrice(order.total)}</span></div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold">مدیریت وضعیت</h3>
        <form action={updateOrderStatus} className="mt-4 grid gap-4 md:grid-cols-[220px_1fr_auto]">
          <input type="hidden" name="id" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {adminOrderStatuses.map((status) => (
              <option key={status} value={status}>
                {formatOrderStatus(status)}
              </option>
            ))}
          </select>
          <Input name="trackingCode" defaultValue={order.trackingCode ?? ""} placeholder="کد رهگیری پستی" />
          <Button type="submit">ذخیره</Button>
        </form>
      </Card>
    </div>
  );
}
