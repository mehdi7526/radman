import { ProductImage } from "@/components/product/product-image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: {
    slug: string;
    name: string;
    shortDescription: string;
    price: number;
    inventory: number;
    images: { url: string; alt: string }[];
    category?: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border bg-porcelain transition-shadow duration-150 hover:shadow-lift">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-muted">
          {image ? (
            <ProductImage
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">بدون تصویر</div>
          )}
          {product.inventory > 0 ? (
            <span className="absolute start-3 top-3 border border-border bg-porcelain px-2 py-1 text-xs font-bold text-foreground">
              موجود
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-5">
        <div className="flex-1">
          {product.category ? <p className="eyebrow">{product.category.name}</p> : null}
          <Link href={`/products/${product.slug}`} className="mt-1 block text-balance text-lg font-bold text-foreground hover:text-oxygen">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-pretty text-sm leading-7 text-muted-foreground">{product.shortDescription}</p>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="spec-label">قیمت</p>
            <p className="spec-value text-base text-primary">{formatPrice(product.price)}</p>
          </div>
          <p className="spec-label tabular-nums">موجودی: {product.inventory}</p>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/products/${product.slug}`}>
            <ShoppingBag className="size-4" aria-hidden="true" />
            مشاهده و خرید
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
