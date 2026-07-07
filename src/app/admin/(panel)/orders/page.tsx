import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate, formatOrderStatus, formatPrice, orderStatusColor } from "@/lib/format";

type OrdersPageProps = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 10;
  const q = params.q?.trim();
  const status = params.status?.trim();

  const where = {
    ...(q
      ? {
          OR: [
            { customerName: { contains: q } },
            { customerPhone: { contains: q } },
            { id: { contains: q } },
            { trackingCode: { contains: q } }
          ]
        }
      : {}),
    ...(status ? { status: status as "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" } : {})
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        shippingMethod: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.order.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-sky-950">سفارش‌ها</h2>
        <p className="mt-1 text-sm text-muted-foreground">{total} سفارش</p>
      </div>

      <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <Input name="q" defaultValue={q} placeholder="جستجو نام، تلفن، کد سفارش..." />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">همه وضعیت‌ها</option>
          {["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((value) => (
            <option key={value} value={value}>
              {formatOrderStatus(value as "PENDING")}
            </option>
          ))}
        </select>
        <Button type="submit">فیلتر</Button>
      </form>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href={`/admin/orders/${order.id}`} className="font-bold text-sky-950">
                  {order.customerName}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.customerPhone} | {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-left">
                <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                <span className={`mt-1 inline-block rounded-md px-2 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
                  {formatOrderStatus(order.status)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button key={pageNumber} asChild variant={pageNumber === page ? "default" : "outline"} size="sm">
              <Link href={`/admin/orders?page=${pageNumber}${q ? `&q=${q}` : ""}${status ? `&status=${status}` : ""}`}>
                {pageNumber}
              </Link>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
