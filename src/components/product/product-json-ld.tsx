type ProductJsonLdProps = {
  name: string;
  description: string;
  slug: string;
  price: number;
  inventory: number;
  image?: string;
};

export function ProductJsonLd({ name, description, slug, price, inventory, image }: ProductJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${slug}`,
      priceCurrency: "IRR",
      price,
      availability: inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
