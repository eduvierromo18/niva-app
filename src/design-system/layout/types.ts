import type { ComponentType, ReactNode } from "react";

export type NivaNavigationGroup = "primary" | "workspace" | "support" | string;

export type NivaNavigationItem = {
  title: string;
  href: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  group?: NivaNavigationGroup;
  disabled?: boolean;
};

export type NivaShellBrand = {
  name: string;
  description?: string;
  mark?: ReactNode;
};

export type NivaShellUser = {
  name: string;
  initials: string;
  href?: string;
};
