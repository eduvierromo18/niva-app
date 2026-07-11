"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";

export type NivaTabItem = {
  id: string;
  label: string;
  panel?: ReactNode;
  disabled?: boolean;
};

export type NivaTabsProps = {
  tabs: NivaTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  className?: string;
};

export function NivaTabs({ tabs, value, onValueChange, label, className }: NivaTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabledTabs = tabs.map((tab, tabIndex) => ({ tab, tabIndex })).filter(({ tab }) => !tab.disabled);
    if (enabledTabs.length === 0) return;

    const currentEnabledIndex = enabledTabs.findIndex(({ tabIndex }) => tabIndex === index);
    const safeEnabledIndex = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
    const nextEnabled = event.key === "ArrowRight" ? enabledTabs[(safeEnabledIndex + 1) % enabledTabs.length] : undefined;
    const previousEnabled = event.key === "ArrowLeft" ? enabledTabs[(safeEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length] : undefined;
    const firstEnabled = event.key === "Home" ? enabledTabs[0] : undefined;
    const lastEnabled = event.key === "End" ? enabledTabs[enabledTabs.length - 1] : undefined;
    const target = nextEnabled ?? previousEnabled ?? firstEnabled ?? lastEnabled;

    if (!target) return;
    event.preventDefault();
    onValueChange(target.tab.id);
    requestAnimationFrame(() => {
      document.getElementById(`${target.tab.id}-tab`)?.focus();
    });
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-6 border-b border-[var(--niva-color-border)]">
        {tabs.map((tab, index) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tab.id}-panel`}
              disabled={tab.disabled}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "border-b-2 px-1 pb-3 text-sm font-semibold",
                nivaTransition,
                nivaFocusRing,
                selected ? "border-[var(--niva-color-accent)] text-[var(--niva-color-accent)]" : "border-transparent text-[var(--niva-color-muted)] hover:text-[var(--niva-color-foreground)]",
              )}
              onClick={() => onValueChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
          hidden={tab.id !== value}
          className="pt-6"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
