import * as React from "react";
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import NextLink from "next/link";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "accent" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size" | "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, sx, children, ...props }, ref) => {
    const firstChild = asChild ? React.Children.toArray(children)[0] : null;
    const child = firstChild && React.isValidElement(firstChild)
      ? firstChild as React.ReactElement<{ href?: string; children?: React.ReactNode }>
      : null;
    const muiVariant = variant === "outline" || variant === "secondary" ? "outlined" : variant === "ghost" ? "text" : "contained";
    const color = variant === "destructive" ? "error" : variant === "secondary" ? "secondary" : "primary";
    return (
      <MuiButton
        ref={ref}
        component={asChild ? NextLink : "button"}
        href={child?.props.href}
        variant={muiVariant}
        color={color}
        size={size === "sm" ? "small" : size === "lg" ? "large" : "medium"}
        className={className}
        sx={{ ...(variant === "accent" ? { backgroundColor: "#b8894d", color: "#112033", "&:hover": { backgroundColor: "#a87a40" } } : {}), ...(size === "icon" ? { minWidth: 44, width: 44, px: 0 } : {}), ...sx }}
        {...props}
      >
        {child?.props.children ?? children}
      </MuiButton>
    );
  }
);
Button.displayName = "Button";

export { Button };
