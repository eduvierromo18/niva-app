"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NivaButton } from "@/design-system/components/NivaButton";
import { NivaIconButton } from "@/design-system/components/NivaIconButton";

export type NivaModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  primaryAction?: string;
  secondaryAction?: string;
  footer?: ReactNode;
  onClose: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  preview?: boolean;
  className?: string;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function NivaModal({
  open,
  title,
  description,
  children,
  primaryAction = "Guardar",
  secondaryAction = "Cancelar",
  footer,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  preview = false,
  className,
}: NivaModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || preview) return;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose, open, preview]);

  if (!open) return null;

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={preview ? undefined : true}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        // max-h + overflow keep tall forms bounded to the viewport. On mobile the
        // overlay anchors the panel to the bottom (items-end), so without this a
        // form taller than the screen overflows off the top and its first fields
        // (e.g. the amount input) become unreachable.
        "max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[var(--niva-radius-2xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-5 text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xl)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h2 id={titleId} className="text-base font-bold leading-tight">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm leading-normal text-[var(--niva-color-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        <NivaIconButton icon={<X className="h-4 w-4" />} label="Cerrar" variant="ghost" size="sm" onClick={onClose} />
      </div>
      <div className="mt-5 space-y-4">{children}</div>
      {footer !== undefined ? footer : (
        <div className="mt-6 flex justify-end gap-3">
          <NivaButton variant="secondary" size="sm" onClick={onSecondaryAction ?? onClose}>
            {secondaryAction}
          </NivaButton>
          <NivaButton size="sm" onClick={onPrimaryAction}>
            {primaryAction}
          </NivaButton>
        </div>
      )}
    </div>
  );

  if (preview) return panel;

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--niva-color-overlay)] p-4 backdrop-blur-sm sm:items-center">{panel}</div>;
}
