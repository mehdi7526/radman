"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={cn(
          "h-11 w-full rounded-md border bg-white px-3 pe-10 text-sm outline-none transition focus:ring-2 focus:ring-ring",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
        aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
