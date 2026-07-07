import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireCustomer } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatDate, formatOrderStatus, formatPrice, orderStatusColor } from "@/lib/format";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const user = await requireCustomer();

  const order = await prisma.order.findFirst({
    where: {
      id,
      OR: [{ userId: user.id }, { customerPhone: user.phone ?? "" }]
    },
    include: {
      items: { include: { product: true } },
      shippingMethod: true
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-sky-950">پیگیری سفارش</h1>
          <p className="mt-1 text-sm text-muted-foreground">{order.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/account">بازگشت</Link>
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`rounded-md px-3 py-1 text-sm font-semibold ${orderStatusColor(order.status)}`}>
            {formatOrderStatus(order.status)}
          </span>
          <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
        </div>
        {order.trackingCode ? (
          <p className="mt-4 text-sm">
            کد رهگیری: <span className="font-bold" dir="ltr">{order.trackingCode}</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">ارسال: {order.shippingMethod?.name ?? "—"}</p>
        <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
      </Card>

      <Card className="p-5">
        <h2 className="font-bold">اقلام</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product.name} × {item.quantity}</span>
              <span className="font-bold">{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 text-lg font-black">
          مجموع: <span className="text-primary">{formatPrice(order.total)}</span>
        </div>
      </Card>
    </div>
  );
}
