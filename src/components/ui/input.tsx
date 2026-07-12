import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-sm border border-input bg-porcelain px-3 text-base outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
