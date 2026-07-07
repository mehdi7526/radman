import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gauge, ShoppingBag } from "lucide-react";
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
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Card className="group overflow-hidden border-sky-100 bg-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-water">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-50 to-teal-50">
          {image ? (
            <Image src={image.url} alt={image.alt} fill className="object-cover transition-transform duration-500 hover:scale-105" />
          ) : null}
          <span className="absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-sky-900 shadow-sm">
            آماده ارسال
          </span>
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div>
          <Link href={`/products/${product.slug}`} className="text-lg font-bold text-sky-950">
            {product.name}
          </Link>
          <p className="mt-2 min-h-14 text-sm leading-7 text-muted-foreground">{product.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md bg-sky-50 px-3 py-3">
          <span className="font-black text-primary">{formatPrice(product.price)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Gauge className="h-4 w-4 text-teal-600" />
            موجودی: {product.inventory}
          </span>
        </div>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/products/${product.slug}`}>
            <ShoppingBag className="h-4 w-4" />
            مشاهده و خرید
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
