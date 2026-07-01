"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { AuroraButton } from "@/components/aurora/buttons/AuroraButton";
import { AuroraIconButton } from "@/components/aurora/buttons/AuroraIconButton";
import { cn } from "@/lib/utils";

type AuroraModalProps = {
  open?: boolean;
  title: string;
  children: ReactNode;
  primaryAction?: string;
  secondaryAction?: string;
  footer?: ReactNode;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  preview?: boolean;
  className?: string;
};

export function AuroraModal({
  open = true,
  title,
  children,
  primaryAction = "Guardar",
  secondaryAction = "Cancelar",
  footer,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  preview = false,
  className,
}: AuroraModalProps) {
  if (!open) return null;

  const panel = (
    <div className={cn("w-full max-w-md rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.10)]", className)}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <AuroraIconButton icon={<X className="h-4 w-4" />} label="Cerrar" variant="ghost" onClick={onClose} />
        </div>
        <div className="mt-5 space-y-4">{children}</div>
        {footer ?? (
          <div className="mt-6 flex justify-end gap-3">
            <AuroraButton variant="secondary" size="sm" onClick={onSecondaryAction ?? onClose}>{secondaryAction}</AuroraButton>
            <AuroraButton size="sm" onClick={onPrimaryAction}>{primaryAction}</AuroraButton>
          </div>
        )}
      </div>
  );

  if (preview) return panel;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#111827]/35 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      {panel}
    </div>
  );
}
