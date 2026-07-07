"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/product-image";

type ProductGalleryProps = {
  images: { url: string; alt: string }[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return <div className="aspect-[4/3] rounded-lg bg-muted" />;
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-water">
        <ProductImage src={activeImage.url} alt={activeImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border ${index === activeIndex ? "border-primary ring-2 ring-primary/30" : "border-sky-100"}`}
            >
              <ProductImage src={image.url} alt={image.alt} fill sizes="80px" loading="lazy" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
