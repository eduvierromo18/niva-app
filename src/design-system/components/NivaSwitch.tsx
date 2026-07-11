"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { nivaDisabledState, nivaFocusRing, nivaTransition } from "@/design-system/tokens";

type NivaSwitchAccessibleLabel =
  | {
      label: string;
      "aria-label"?: string;
    }
  | {
      label?: string;
      "aria-label": string;
    };

export type NivaSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-checked" | "aria-label" | "role" | "onChange"> &
  NivaSwitchAccessibleLabel & {
  checked: boolean;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
};

export function NivaSwitch({
  checked,
  label,
  description,
  onCheckedChange,
  className,
  disabled,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: NivaSwitchProps) {
  const descriptionId = description && label ? `${label.toLowerCase().replace(/\s+/g, "-")}-switch-description` : undefined;

  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy ?? descriptionId}
      disabled={disabled}
      className={cn("inline-flex items-center gap-3 text-left", nivaFocusRing, nivaDisabledState, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange?.(!checked);
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5",
          nivaTransition,
          checked ? "bg-[var(--niva-color-accent)]" : "bg-[var(--niva-color-neutral-300)]",
        )}
      >
        <span className={cn("h-5 w-5 rounded-full bg-[var(--niva-color-surface)] shadow-[var(--niva-shadow-sm)] transition-transform duration-[var(--niva-motion-base)]", checked && "translate-x-5")} />
      </span>
      {label || description ? (
        <span className="grid gap-0.5">
          {label ? <span className="text-sm font-semibold text-[var(--niva-color-foreground)]">{label}</span> : null}
          {description ? (
            <span id={descriptionId} className="text-xs leading-normal text-[var(--niva-color-muted)]">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}
