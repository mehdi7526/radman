import type { Metadata } from "next";
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
    <div className="container py-12">
      <div className="mb-10 rounded-lg border border-sky-100 bg-white/80 p-8 shadow-water">
        <p className="text-sm font-bold text-primary">فروشگاه رادمان</p>
        <h1 className="mt-3 text-4xl font-black text-sky-950">محصولات تصفیه آب و هوا</h1>
        <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
          جستجو، فیلتر و انتخاب دستگاه مناسب برای خانه یا محل کار.
        </p>
      </div>

      <form className="mb-8 grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-[1fr_180px_140px_140px_140px_auto]">
        <Input name="q" defaultValue={q} placeholder="جستجو..." />
        <select name="category" defaultValue={categorySlug ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">همه دسته‌ها</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <Input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="حداقل قیمت" />
        <Input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="حداکثر قیمت" />
        <select name="sort" defaultValue={params.sort ?? "newest"} className="h-10 rounded-md border px-3 text-sm">
          <option value="newest">جدیدترین</option>
          <option value="price-asc">ارزان‌ترین</option>
          <option value="price-desc">گران‌ترین</option>
          <option value="name">نام</option>
        </select>
        <Button type="submit">اعمال</Button>
      </form>

      {products.length === 0 ? (
        <p className="rounded-lg border bg-white p-8 text-center text-muted-foreground">محصولی با این فیلترها پیدا نشد.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
