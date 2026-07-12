import type { ButtonHTMLAttributes } from "react";
import { NivaButton } from "@/design-system";
import type { NivaButtonVariant } from "@/design-system";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Extract<NivaButtonVariant, "primary" | "secondary" | "ghost">;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <NivaButton className={className} variant={variant} {...props} />;
}
