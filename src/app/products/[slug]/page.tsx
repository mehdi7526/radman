import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true
    }
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isPublished) {
    return {};
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0]?.url ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const image = product.images[0];

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.shortDescription}
        slug={product.slug}
        price={product.price}
        inventory={product.inventory}
        image={image?.url}
      />
      <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_440px]">
        <div className="space-y-4">
          <ProductGallery images={product.images} />
          <Card className="p-6">
            <h2 className="font-bold text-sky-950">توضیحات محصول</h2>
            <p className="mt-3 whitespace-pre-line leading-9 text-muted-foreground">{product.description}</p>
          </Card>
        </div>
        <aside className="h-fit rounded-lg border bg-white p-6 shadow-water">
          {product.category ? (
            <p className="text-sm font-bold text-primary">{product.category.name}</p>
          ) : (
            <p className="text-sm font-bold text-primary">رادمان</p>
          )}
          <h1 className="mt-3 text-3xl font-black leading-[1.5] text-sky-950">{product.name}</h1>
          <p className="mt-4 leading-8 text-muted-foreground">{product.shortDescription}</p>
          <div className="my-6 h-px waterline" />
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">قیمت</span>
            <span className="text-2xl font-black text-primary">{formatPrice(product.price)}</span>
          </div>
          <AddToCart
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              inventory: product.inventory,
              imageUrl: image?.url
            }}
          />
        </aside>
      </div>
    </>
  );
}
