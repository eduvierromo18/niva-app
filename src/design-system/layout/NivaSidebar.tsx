import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import type { NivaNavigationGroup, NivaNavigationItem, NivaShellBrand } from "@/design-system/layout/types";

export type NivaSidebarProps = {
  brand: NivaShellBrand;
  items: NivaNavigationItem[];
  activeHref?: string;
  groupOrder?: NivaNavigationGroup[];
  footer?: ReactNode;
  label?: string;
  className?: string;
  onNavigate?: () => void;
};

function isActiveRoute(itemHref: string, activeHref?: string) {
  if (!activeHref) return false;
  if (itemHref === "/") return activeHref === itemHref;
  return activeHref === itemHref || activeHref.startsWith(`${itemHref}/`);
}

function groupNavigation(items: NivaNavigationItem[], groupOrder: NivaNavigationGroup[]) {
  const knownGroups = groupOrder.map((group) => ({
    key: group,
    items: items.filter((item) => (item.group ?? "primary") === group),
  }));
  const extraGroups = Array.from(new Set(items.map((item) => item.group ?? "primary").filter((group) => !groupOrder.includes(group)))).map((group) => ({
    key: group,
    items: items.filter((item) => (item.group ?? "primary") === group),
  }));

  return [...knownGroups, ...extraGroups].filter((group) => group.items.length > 0);
}

export function NivaSidebar({ brand, items, activeHref, groupOrder = ["primary", "workspace", "support"], footer, label = "Navegacion principal", className, onNavigate }: NivaSidebarProps) {
  const groups = groupNavigation(items, groupOrder);

  return (
    <aside
      className={cn(
        "flex h-full min-h-[520px] w-full max-w-64 flex-col rounded-[var(--niva-radius-2xl)] border border-[var(--niva-color-inverse-subtle)] bg-[var(--niva-color-inverse-surface)] p-3 text-[var(--niva-color-inverse-foreground)] shadow-[var(--niva-shadow-lg)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--niva-radius-lg)] text-lg font-bold", brand.mark ? "bg-transparent" : "bg-[var(--niva-color-accent)] text-[var(--niva-color-accent-foreground)] shadow-[var(--niva-shadow-sm)]")}>
          {brand.mark ?? brand.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          {brand.wordmark ?? <p className="truncate text-lg font-bold leading-tight text-[var(--niva-color-foreground)]">{brand.name}</p>}
          {brand.description ? <p className="truncate text-xs font-medium text-[var(--niva-color-inverse-muted)]">{brand.description}</p> : null}
        </div>
      </div>
      <nav aria-label={label} className="mt-6 space-y-3">
        {groups.map((group, groupIndex) => (
          <div key={group.key} className={cn(groupIndex > 0 && "border-t border-[var(--niva-color-inverse-subtle)] pt-3")}>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActiveRoute(item.href, activeHref);
                const Icon = item.icon;

                return (
                  <Link
                    key={`${group.key}-${item.href}-${item.title}`}
                    href={item.disabled ? activeHref ?? item.href : item.href}
                    aria-current={active ? "page" : undefined}
                    aria-disabled={item.disabled || undefined}
                    tabIndex={item.disabled ? -1 : undefined}
                    onClick={(event) => {
                      if (item.disabled) {
                        event.preventDefault();
                        return;
                      }
                      onNavigate?.();
                    }}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-[var(--niva-radius-xl)] px-3 py-2.5 text-sm font-semibold text-[var(--niva-color-inverse-muted)]",
                      nivaTransition,
                      nivaFocusRing,
                      "hover:bg-white/10 hover:text-[var(--niva-color-inverse-foreground)]",
                      active && "bg-white/10 text-[var(--niva-color-inverse-foreground)] shadow-[inset_3px_0_0_var(--niva-color-accent)]",
                      item.disabled && "pointer-events-none opacity-50",
                    )}
                  >
                    {Icon ? (
                      <Icon
                        aria-hidden={true}
                        className={cn("h-4 w-4 shrink-0 text-[var(--niva-color-inverse-muted)]", active && "text-[var(--niva-color-inverse-foreground)]")}
                      />
                    ) : null}
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      {footer ? <div className="mt-auto pt-6">{footer}</div> : null}
    </aside>
  );
}
