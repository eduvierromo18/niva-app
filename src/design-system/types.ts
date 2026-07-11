import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type NivaTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export type NivaSize = "sm" | "md" | "lg";

export type NivaPolymorphicProps<TElement extends ElementType, TProps = object> = TProps &
  Omit<ComponentPropsWithoutRef<TElement>, keyof TProps | "as"> & {
    as?: TElement;
  };

export type NivaOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type NivaAction = {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
};
