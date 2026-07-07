import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "محصولات",
  description: "لیست دستگاه‌های تصفیه آب و تصفیه هوای فروشگاه رادمان."
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container py-12">
      <div className="mb-10 rounded-lg border border-sky-100 bg-white/80 p-8 shadow-water">
        <p className="text-sm font-bold text-primary">فروشگاه رادمان</p>
        <h1 className="mt-3 text-4xl font-black text-sky-950">محصولات تصفیه آب و هوا</h1>
        <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
          دستگاه‌های منتخب برای خانه، دفتر کار و فضاهای کوچک؛ همراه با توضیحات روشن، قیمت شفاف و مسیر خرید ساده.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
