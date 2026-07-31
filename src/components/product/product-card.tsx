import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
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
    <Card className="group flex h-full flex-col overflow-hidden" sx={{ transition: "transform 180ms ease, box-shadow 180ms ease", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 36px rgba(17, 32, 51, 0.12)" } }}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        {image ? (
          <ProductImage src={image.url} alt={image.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <CardMedia className="flex h-full items-center justify-center">بدون تصویر</CardMedia>
        )}
        <Chip label={product.inventory > 0 ? "موجود" : "ناموجود"} color={product.inventory > 0 ? "success" : "default"} size="small" sx={{ position: "absolute", top: 12, right: 12, fontWeight: 700 }} />
      </Link>

      <CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 1.5, p: 2.5 }}>
        {product.category ? <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 700 }}>{product.category.name}</Typography> : null}
        <Typography component={Link} href={`/products/${product.slug}`} variant="h6" color="text.primary" sx={{ fontWeight: 800, lineHeight: 1.7, textDecoration: "none", "&:hover": { color: "primary.main" } }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.shortDescription}
        </Typography>
        <Stack direction="row" sx={{ mt: "auto", pt: 2, borderTop: "1px solid", borderColor: "divider", justifyContent: "space-between", alignItems: "end" }}>
          <div>
            <Typography variant="caption" color="text.secondary">قیمت</Typography>
            <Typography color="primary.main" sx={{ fontWeight: 800 }}>{formatPrice(product.price)}</Typography>
          </div>
          <Typography variant="caption" color="text.secondary">موجودی: {product.inventory}</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/products/${product.slug}`}>
            <ShoppingBag className="size-4" aria-hidden="true" />
            مشاهده و خرید
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardActions>
    </Card>
  );
}
