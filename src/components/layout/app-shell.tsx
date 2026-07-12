"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { NivaMark, NivaWordmark } from "@/components/brand/niva-brand";
import { NivaAppShell, NivaLayoutSurface } from "@/design-system";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import { appNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const sidebarGroupOrder = ["primary", "workspace", "support"];

type AppShellProps = {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    currencyCode: string;
    locale: string;
  };
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppShell({ children, user }: AppShellProps) {
  const firstName = user.name.trim().split(/\s+/)[0] || "Usuario";
  const initials = getInitials(user.name) || "N";

  return (
    <NivaAppShell
      navigation={appNavigation}
      brand={{
        name: "Niva",
        description: "Finanzas personales",
        mark: <NivaMark tone="dark" />,
        wordmark: <NivaWordmark inverse />,
      }}
      user={{ name: user.name, initials, href: "/settings" }}
      groupOrder={sidebarGroupOrder}
      homeTitle={`Hola, ${firstName}.`}
      homeSubtitle="Así está tu dinero hoy."
      searchPlaceholder="Buscar registros, cuentas o categorías…"
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
        <NivaLayoutSurface className="border-[var(--niva-color-inverse-subtle)] bg-white/5 p-4 text-[var(--niva-color-inverse-foreground)] shadow-none">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[var(--niva-radius-full)] bg-[var(--niva-color-accent)]" />
            <p className="text-sm font-semibold text-[var(--niva-color-inverse-foreground)]">Todo al día</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--niva-color-inverse-muted)]">
            {user.currencyCode} · {user.locale}
          </p>
        </NivaLayoutSurface>
      }
    >
      {children}
    </NivaAppShell>
  );
}
