import Image, { type ImageProps } from "next/image";

export function isExternalImage(src: ImageProps["src"]) {
  return typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));
}

export function ProductImage({ src, ...props }: ImageProps) {
  return <Image src={src} unoptimized={isExternalImage(src)} {...props} />;
}
