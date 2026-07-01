"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-zinc-50">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{description}</p> : null}
          </div>
          <Button variant="ghost" className="h-9 w-9 px-0" onClick={onClose} aria-label="Cerrar">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
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
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50";

