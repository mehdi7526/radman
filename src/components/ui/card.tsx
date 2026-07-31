import { Card as MuiCard, type CardProps } from "@mui/material";

export function Card({ className, variant = "outlined", ...props }: CardProps) {
  return <MuiCard variant={variant} className={className} {...props} />;
}
