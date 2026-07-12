import { cn } from "@/lib/utils";

type BrandGearProps = {
  className?: string;
  size?: number;
};

export function BrandGear({ className, size = 20 }: BrandGearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("text-signal", className)}
    >
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19.4 13.5 18 12.8l.3-1.7 1.6-.5-.2-1.7-1.6-.2-.9-1.4 1.1-1.2-1.2-1.1-1.4.9-1.7-.2-.5-1.6-.2-1.7 1.6-.5.3-1.7-1.4-.7-1.4.7-.3 1.7-1.6.5.2 1.7 1.7.2.9 1.4-1.1 1.2 1.2 1.1 1.4-.9.5 1.6.2 1.7-1.6-.3 1.7 1.4.7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
