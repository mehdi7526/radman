import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCachedCategories, getCachedProducts } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "محصولات",
  description: "لیست دستگاه‌های تصفیه آب و تصفیه هوای فروشگاه رادمان."
};

export const revalidate = 60;

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const categorySlug = params.category;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [products, categories] = await Promise.all([
    getCachedProducts({
      q,
      categorySlug,
      sort: params.sort,
      minPrice,
      maxPrice
    }),
    getCachedCategories()
  ]);

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-10 max-w-3xl border-b border-border pb-8">
        <p className="eyebrow">فروشگاه رادمان</p>
        <h1 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl">محصولات تصفیه آب و هوا</h1>
        <p className="mt-4 text-pretty leading-8 text-muted-foreground">
          جستجو، فیلتر و انتخاب دستگاه مناسب برای خانه یا محل کار.
        </p>
      </header>

      <form className="mb-8 grid gap-3 border border-border bg-porcelain p-4 md:grid-cols-2 lg:grid-cols-[1fr_180px_140px_140px_140px_auto]">
        <div>
          <label htmlFor="product-search" className="sr-only">
            جستجو
          </label>
          <Input id="product-search" name="q" defaultValue={q} placeholder="جستجو..." />
        </div>
        <div>
          <label htmlFor="product-category" className="sr-only">
            دسته‌بندی
          </label>
          <select
            id="product-category"
            name="category"
            defaultValue={categorySlug ?? ""}
            className="h-11 w-full rounded-sm border border-input px-3 text-sm"
          >
            <option value="">همه دسته‌ها</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="min-price" className="sr-only">
            حداقل قیمت
          </label>
          <Input id="min-price" name="minPrice" type="number" defaultValue={params.minPrice} placeholder="حداقل قیمت" />
        </div>
        <div>
          <label htmlFor="max-price" className="sr-only">
            حداکثر قیمت
          </label>
          <Input id="max-price" name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="حداکثر قیمت" />
        </div>
        <div>
          <label htmlFor="product-sort" className="sr-only">
            مرتب‌سازی
          </label>
          <select
            id="product-sort"
            name="sort"
            defaultValue={params.sort ?? "newest"}
            className="h-11 w-full rounded-sm border border-input px-3 text-sm"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="name">نام</option>
          </select>
        </div>
        <Button type="submit">اعمال</Button>
      </form>

      {products.length === 0 ? (
        <div className="border border-border bg-porcelain p-8 text-center">
          <p className="text-muted-foreground">محصولی با این فیلترها پیدا نشد.</p>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/products">پاک کردن فیلترها</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
