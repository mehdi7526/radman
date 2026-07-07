import Link from "next/link";
import { deleteProduct, logoutAdmin } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminPage() {
  await requireAdmin();
  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.findMany({
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  return (
    <div className="container space-y-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">پنل مدیریت</p>
          <h1 className="mt-2 text-3xl font-black text-sky-950">مدیریت رادمان</h1>
        </div>
        <form action={logoutAdmin}>
          <Button variant="outline">خروج</Button>
        </form>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="mb-4 text-xl font-bold">محصول جدید</h2>
          <ProductForm />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">محصولات</h2>
          {products.map((product) => (
            <Card key={product.id} className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/products/${product.slug}`} className="font-bold text-sky-950">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPrice(product.price)} | موجودی {product.inventory}
                  </p>
                </div>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <Button variant="destructive" size="sm">حذف</Button>
                </form>
              </div>
              <ProductForm product={product} />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">سفارش‌ها</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.customerPhone} | {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{order.address}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {order.items.map((item) => (
                  <span key={item.id} className="rounded-md bg-muted px-3 py-1">
                    {item.product.name} x {item.quantity}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
