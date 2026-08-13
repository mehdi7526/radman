"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IconButton, InputAdornment, TextField } from "@mui/material";

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      label="رمز عبور"
      fullWidth
      required={props.required}
      size="small"
      variant="outlined"
      className={className}
      slotProps={{
        htmlInput: { dir: props.dir },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                edge="start"
                onClick={() => setVisible((current) => !current)}
                tabIndex={-1}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff", minHeight: 44 },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dbe7e8" },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5f8f9d" },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#275d7a", borderWidth: 2 }
      }}
    />
  );
}
