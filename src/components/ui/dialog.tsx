"use client";

import { NivaModal } from "@/design-system";

export function Dialog({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <NivaModal open={open} title={title} description={description} onClose={onClose} footer={null} className="max-w-xl">
      {children}
    </NivaModal>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--niva-color-foreground)]">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "h-10 rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-3 text-sm text-[var(--niva-color-foreground)] outline-none transition-colors placeholder:text-[var(--niva-color-placeholder)] focus:border-[var(--niva-color-accent)] focus:ring-2 focus:ring-[var(--niva-color-accent-surface)]";
