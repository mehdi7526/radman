"use client";

import * as React from "react";
import { TextField } from "@mui/material";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">;

const fieldLabels: Record<string, string> = {
  name: "نام", customerName: "نام و نام خانوادگی", phone: "شماره موبایل", customerPhone: "شماره موبایل",
  email: "ایمیل", customerEmail: "ایمیل", password: "رمز عبور", otp: "کد تأیید", code: "کد تخفیف",
  q: "جستجو", minPrice: "حداقل قیمت", maxPrice: "حداکثر قیمت", price: "قیمت", inventory: "موجودی",
  slug: "شناسه", shortDescription: "توضیح کوتاه", imageAlt: "متن جایگزین تصویر", imageFiles: "تصاویر محصول",
  trackingCode: "کد رهگیری", sortOrder: "ترتیب نمایش", discountValue: "مقدار تخفیف", minOrderAmount: "حداقل سفارش",
  maxUses: "حداکثر استفاده", expiresAt: "تاریخ انقضا", id: "شماره سفارش"
  , postalCode: "کدپستی"
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, placeholder, dir, ...props }, ref) => (
  <TextField
    {...props}
    label={fieldLabels[props.name ?? ""] ?? placeholder}
    placeholder={fieldLabels[props.name ?? ""] ? placeholder : undefined}
    inputRef={ref}
    slotProps={{ htmlInput: { dir } }}
    fullWidth
    size="small"
    variant="outlined"
    className={className}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff", minHeight: 44 },
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dbe7e8" },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5f8f9d" },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#275d7a", borderWidth: 2 }
    }}
  />
));
Input.displayName = "Input";
