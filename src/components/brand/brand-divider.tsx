import { cn } from "@/lib/utils";

type BrandDividerProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function BrandDivider({ className, tone = "light" }: BrandDividerProps) {
  const stroke = tone === "dark" ? "currentColor" : "currentColor";
  const colorClass = tone === "dark" ? "text-background/25" : "text-border";

  return (
    <div className={cn("flex items-center gap-3", colorClass, className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-signal">
        <path
          d="M10 2L11.8 8.2H18L13.1 12.1L15 18.2L10 14.4L5 18.2L6.9 12.1L2 8.2H8.2L10 2Z"
          stroke={stroke}
          strokeWidth="1"
          fill="none"
        />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" className="text-signal" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}
