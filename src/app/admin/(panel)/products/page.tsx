import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

type ProductsPageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 10;
  const q = params.q?.trim();
  const categoryId = params.category;

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
            { shortDescription: { contains: q } }
          ]
        }
      : {}),
    ...(categoryId ? { categoryId } : {})
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-sky-950">محصولات</h2>
          <p className="mt-1 text-sm text-muted-foreground">{total} محصول</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            محصول جدید
          </Link>
        </Button>
      </div>

      <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <Input name="q" defaultValue={q} placeholder="جستجو در نام یا اسلاگ..." />
        <select
          name="category"
          defaultValue={categoryId ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit">فیلتر</Button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <Link href={`/admin/products/${product.id}/edit`} className="font-bold text-sky-950">
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.category?.name ?? "بدون دسته"} | {formatPrice(product.price)} | موجودی {product.inventory}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/products/${product.id}/edit`}>ویرایش</Link>
              </Button>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={product.id} />
                <Button variant="destructive" size="sm">حذف</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button key={pageNumber} asChild variant={pageNumber === page ? "default" : "outline"} size="sm">
              <Link href={`/admin/products?page=${pageNumber}${q ? `&q=${q}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}>
                {pageNumber}
              </Link>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
