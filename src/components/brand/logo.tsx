import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "size-10", px: 40 },
  md: { box: "size-11", px: 44 },
  lg: { box: "size-[72px]", px: 72 },
  xl: { box: "size-48 md:size-56", px: 224 }
} as const;

type LogoProps = {
  className?: string;
  imageClassName?: string;
  size?: keyof typeof sizeMap;
  showText?: boolean;
  showTagline?: boolean;
  href?: string;
  priority?: boolean;
};

export function Logo({
  className,
  imageClassName,
  size = "md",
  showText = true,
  showTagline = true,
  href,
  priority = false
}: LogoProps) {
  const dimensions = sizeMap[size];

  const content = (
    <>
      <span className={cn("relative shrink-0 overflow-hidden rounded-full", dimensions.box, imageClassName)}>
        <Image
          src={brand.logoSrc}
          alt={`${brand.name} — ${brand.tagline}`}
          width={dimensions.px}
          height={dimensions.px}
          priority={priority}
          className="size-full object-cover"
        />
      </span>
      {showText ? (
        <span className="leading-tight">
          <span className="block text-base font-bold text-foreground">{brand.name}</span>
          {showTagline ? (
            <span className="block text-xs font-normal text-muted-foreground">{brand.tagline}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const rootClass = cn("inline-flex items-center gap-3", className);

  if (href) {
    return (
      <Link href={href} className={rootClass}>
        {content}
      </Link>
    );
  }

  return <div className={rootClass}>{content}</div>;
}

export function LogoMark({
  className,
  size = "md",
  priority = false,
  alt
}: {
  className?: string;
  size?: keyof typeof sizeMap;
  priority?: boolean;
  alt?: string;
}) {
  const dimensions = sizeMap[size];

  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-full", dimensions.box, className)}>
      <Image
        src={brand.logoSrc}
        alt={alt ?? `${brand.name} — ${brand.tagline}`}
        width={dimensions.px}
        height={dimensions.px}
        priority={priority}
        className="size-full object-cover"
      />
    </span>
  );
}
