import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const productListSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  price: true,
  inventory: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
    select: { url: true, alt: true }
  },
  category: {
    select: { name: true }
  }
} satisfies Prisma.ProductSelect;

export const getCachedCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, slug: true, name: true } }),
  ["shop-categories"],
  { revalidate: 300, tags: ["categories"] }
);

export const getCachedFeaturedProducts = unstable_cache(
  () =>
    prisma.product.findMany({
      where: { isPublished: true },
      select: productListSelect,
      orderBy: { createdAt: "desc" },
      take: 3
    }),
  ["featured-products"],
  { revalidate: 60, tags: ["products"] }
);

export async function getCachedProducts(filters: {
  q?: string;
  categorySlug?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q } },
            { shortDescription: { contains: filters.q } }
          ]
        }
      : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          price: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {})
          }
        }
      : {})
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : filters.sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const hasFilters = Boolean(filters.q || filters.categorySlug || filters.minPrice || filters.maxPrice || filters.sort);

  if (hasFilters) {
    return prisma.product.findMany({
      where,
      select: productListSelect,
      orderBy
    });
  }

  return unstable_cache(
    () =>
      prisma.product.findMany({
        where,
        select: productListSelect,
        orderBy
      }),
    ["all-published-products"],
    { revalidate: 60, tags: ["products"] }
  )();
}

export { productListSelect };
