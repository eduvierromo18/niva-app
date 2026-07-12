"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { NivaMark, NivaWordmark } from "@/components/brand/niva-brand";
import { appNavigation } from "@/lib/navigation";
import { NivaAppShell, NivaLayoutSurface } from "@/design-system";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

const sidebarGroupOrder = ["primary", "workspace", "support"];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <NivaAppShell
      navigation={appNavigation}
      brand={{ name: "Niva", description: "Finanzas personales", mark: <NivaMark />, wordmark: <NivaWordmark /> }}
      user={{ name: "Luis Eduvier Romo", initials: "LR", href: "/settings" }}
      groupOrder={sidebarGroupOrder}
      homeTitle="Hola Luis."
      homeSubtitle="Asi esta tu dinero hoy."
      searchPlaceholder="Buscar registros, cuentas o categorias..."
      primaryAction={
        <Link
          href="/movements"
          className={cn(
            "hidden h-10 items-center gap-2 rounded-[var(--niva-radius-md)] bg-[var(--niva-color-accent)] px-4 text-sm font-semibold text-[var(--niva-color-accent-foreground)] shadow-[var(--niva-shadow-sm)] sm:inline-flex",
            nivaTransition,
            nivaFocusRing,
            "hover:bg-[var(--niva-color-accent-hover)]",
          )}
        >
          <Plus aria-hidden={true} className="h-4 w-4" />
          Nuevo registro
        </Link>
      }
      sidebarFooter={
        <NivaLayoutSurface variant="subtle" className="p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[var(--niva-radius-full)] bg-[var(--niva-color-success)]" />
            <p className="text-sm font-bold text-[var(--niva-color-foreground)]">Todo al dia</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--niva-color-muted)]">Niva mantiene tu lectura financiera clara y sin ruido.</p>
        </NivaLayoutSurface>
      }
    >
      {children}
    </NivaAppShell>
  );
}
