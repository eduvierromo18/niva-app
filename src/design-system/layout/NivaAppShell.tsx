"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NivaButton } from "@/design-system/components/NivaButton";
import { NivaIconButton } from "@/design-system/components/NivaIconButton";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import { NivaPageContainer } from "@/design-system/layout/NivaLayoutPrimitives";
import { NivaSidebar } from "@/design-system/layout/NivaSidebar";
import { NivaTopbar } from "@/design-system/layout/NivaTopbar";
import type { NivaNavigationGroup, NivaNavigationItem, NivaShellBrand, NivaShellUser } from "@/design-system/layout/types";

export type NivaAppShellProps = {
  children: ReactNode;
  navigation: NivaNavigationItem[];
  brand: NivaShellBrand;
  user?: NivaShellUser;
  groupOrder?: NivaNavigationGroup[];
  homeHref?: string;
  homeTitle?: string;
  homeSubtitle?: string;
  appSubtitle?: string;
  searchPlaceholder?: string;
  primaryAction?: ReactNode;
  sidebarFooter?: ReactNode;
  mobilePrimaryCount?: number;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getCurrentNavigationItem(navigation: NivaNavigationItem[], pathname: string) {
  return navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? navigation[0];
}

export function NivaAppShell({
  children,
  navigation,
  brand,
  user,
  groupOrder = ["primary", "workspace", "support"],
  homeHref = "/dashboard",
  homeTitle = "Hola Luis.",
  homeSubtitle = "Asi esta tu dinero hoy.",
  appSubtitle = "Niva",
  searchPlaceholder = "Buscar registros, cuentas o categorias...",
  primaryAction,
  sidebarFooter,
  mobilePrimaryCount = 4,
}: NivaAppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerTitleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const currentPage = getCurrentNavigationItem(navigation, pathname);
  const isHome = pathname === homeHref;
  const mobileItems = navigation.filter((item) => (item.group ?? "primary") === "primary").slice(0, mobilePrimaryCount);

  useEffect(() => {
    if (!mobileOpen) return;
    const triggerElement = drawerTriggerRef.current;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector));
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
      triggerElement?.focus();
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--niva-color-background)] text-[var(--niva-color-foreground)]">
      <main className="min-h-screen px-4 pb-24 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pb-8 lg:pt-6">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <NivaSidebar
            brand={brand}
            items={navigation}
            activeHref={pathname}
            groupOrder={groupOrder}
            className="fixed left-6 top-6 hidden h-[calc(100vh-3rem)] max-w-64 lg:flex"
            footer={sidebarFooter}
          />

          <div className="hidden lg:block" />

          <NivaPageContainer width="full" className="px-0">
            <NivaTopbar
              title={isHome ? homeTitle : currentPage.title}
              subtitle={isHome ? homeSubtitle : appSubtitle}
              searchPlaceholder={searchPlaceholder}
              leading={
                <NivaIconButton
                  ref={drawerTriggerRef}
                  icon={<Menu className="h-4 w-4" />}
                  label="Abrir navegacion"
                  variant="ghost"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                />
              }
              actions={<NivaShellActions isHome={isHome} user={user} primaryAction={primaryAction} />}
            />
            <div className="mt-8 min-w-0">
              {children}
            </div>
          </NivaPageContainer>
        </div>
      </main>

      <NivaMobileNavigation items={mobileItems} activeHref={pathname} settingsActive={pathname === "/settings"} />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={drawerTitleId}>
          <button
            type="button"
            aria-label="Cerrar navegacion"
            className="absolute inset-0 bg-[var(--niva-color-overlay)]"
            onClick={() => setMobileOpen(false)}
          />
          <div ref={drawerRef} className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-3rem))] p-4">
            <NivaSidebar
              brand={brand}
              items={navigation}
              activeHref={pathname}
              groupOrder={groupOrder}
              label="Navegacion movil"
              className="max-w-none"
              onNavigate={() => setMobileOpen(false)}
              footer={
                <div className="grid gap-3">
                  <h2 id={drawerTitleId} className="sr-only">
                    Navegacion
                  </h2>
                  <NivaButton ref={closeButtonRef} variant="secondary" size="sm" iconLeft={<X className="h-4 w-4" />} onClick={() => setMobileOpen(false)}>
                    Cerrar
                  </NivaButton>
                  {sidebarFooter}
                </div>
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type NivaShellActionsProps = {
  isHome: boolean;
  user?: NivaShellUser;
  primaryAction?: ReactNode;
};

function NivaShellActions({ isHome, user, primaryAction }: NivaShellActionsProps) {
  return (
    <>
      {!isHome ? primaryAction : null}
      <NivaIconButton icon={<Bell className="h-4 w-4" />} label="Notificaciones" />
      {user ? (
        <Link
          href={user.href ?? "/settings"}
          className={cn(
            "flex items-center gap-3 rounded-[var(--niva-radius-xl)] px-2 py-1.5",
            nivaTransition,
            nivaFocusRing,
            "hover:bg-[var(--niva-color-muted-surface)]",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--niva-radius-full)] bg-[var(--niva-color-foreground)] text-sm font-bold text-[var(--niva-color-background)]">
            {user.initials}
          </span>
          <span className="hidden max-w-40 truncate text-sm font-semibold text-[var(--niva-color-foreground)] sm:inline">{user.name}</span>
          <ChevronDown aria-hidden={true} className="hidden h-4 w-4 text-[var(--niva-color-muted)] sm:block" />
        </Link>
      ) : null}
    </>
  );
}

type NivaMobileNavigationProps = {
  items: NivaNavigationItem[];
  activeHref: string;
  settingsActive: boolean;
};

function NivaMobileNavigation({ items, activeHref, settingsActive }: NivaMobileNavigationProps) {
  return (
    <nav aria-label="Navegacion inferior" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--niva-color-border)] bg-[var(--niva-color-surface)]/95 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = activeHref === item.href || activeHref.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={`${item.href}-${item.title}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--niva-radius-xl)] px-2 py-2 text-[11px] font-semibold text-[var(--niva-color-muted)]",
                nivaTransition,
                nivaFocusRing,
                active && "bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]",
              )}
            >
              {Icon ? <Icon aria-hidden={true} className="h-5 w-5" /> : null}
              <span className="max-w-full truncate">{item.title}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          aria-current={settingsActive ? "page" : undefined}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--niva-radius-xl)] px-2 py-2 text-[11px] font-semibold text-[var(--niva-color-muted)]",
            nivaTransition,
            nivaFocusRing,
            settingsActive && "bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]",
          )}
        >
          <Menu aria-hidden={true} className="h-5 w-5" />
          <span>Mas</span>
        </Link>
      </div>
    </nav>
  );
}
