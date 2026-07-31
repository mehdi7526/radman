"use client";

import * as React from "react";
import { TextField } from "@mui/material";

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "color">;

const fieldLabels: Record<string, string> = { address: "آدرس", note: "توضیحات سفارش", description: "توضیحات", imageUrls: "آدرس تصاویر" };

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, placeholder, ...props }, ref) => (
  <TextField
    {...(props as Record<string, unknown>)}
    label={fieldLabels[props.name ?? ""] ?? placeholder}
    placeholder={fieldLabels[props.name ?? ""] ? placeholder : undefined}
    inputRef={ref}
    fullWidth
    multiline
    minRows={4}
    variant="outlined"
    className={className}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff" },
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dbe7e8" },
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5f8f9d" },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#275d7a", borderWidth: 2 }
    }}
  />
));
Textarea.displayName = "Textarea";
