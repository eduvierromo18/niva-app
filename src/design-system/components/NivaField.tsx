import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { nivaDisabledState, nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import type { NivaOption } from "@/design-system/types";

type FieldShellProps = {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
};

function FieldShell({ id, label, description, error, children }: FieldShellProps) {
  const descriptionId = description && id ? `${id}-description` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold leading-snug text-[var(--niva-color-foreground)]">
          {label}
        </label>
      ) : null}
      {children}
      {description && !error ? (
        <p id={descriptionId} className="text-xs leading-normal text-[var(--niva-color-muted)]">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium leading-normal text-[var(--niva-color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function composeDescriptionIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

const controlClasses = cn(
  "w-full rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-4 text-sm text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xs)]",
  "placeholder:text-[var(--niva-color-placeholder)]",
  nivaTransition,
  nivaFocusRing,
  nivaDisabledState,
);

export type NivaInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: string;
};

export function NivaInput({ label, description, error, className, id, "aria-describedby": describedBy, ...props }: NivaInputProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const descriptionId = description && !error && id ? `${id}-description` : undefined;

  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={composeDescriptionIds(describedBy, errorId, descriptionId)}
        className={cn("h-11", controlClasses, error && "border-[var(--niva-color-danger)]", className)}
        {...props}
      />
    </FieldShell>
  );
}

export type NivaTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  description?: string;
  error?: string;
};

export function NivaTextarea({ label, description, error, className, id, "aria-describedby": describedBy, ...props }: NivaTextareaProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const descriptionId = description && !error && id ? `${id}-description` : undefined;

  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={composeDescriptionIds(describedBy, errorId, descriptionId)}
        className={cn("min-h-24 py-3", controlClasses, error && "border-[var(--niva-color-danger)]", className)}
        {...props}
      />
    </FieldShell>
  );
}

export type NivaSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  description?: string;
  error?: string;
  options: NivaOption[];
  placeholder?: string;
};

export function NivaSelect({ label, description, error, options, placeholder, className, id, "aria-describedby": describedBy, ...props }: NivaSelectProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const descriptionId = description && !error && id ? `${id}-description` : undefined;

  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      <span className="relative block">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={composeDescriptionIds(describedBy, errorId, descriptionId)}
          className={cn("h-11 appearance-none pr-10", controlClasses, error && "border-[var(--niva-color-danger)]", className)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden={true} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-muted)]" />
      </span>
    </FieldShell>
  );
}

export type NivaSearchProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function NivaSearch({ label = "Buscar", className, type = "search", ...props }: NivaSearchProps) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <Search aria-hidden={true} className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-placeholder)]" />
      <input
        type={type}
        className={cn(
          "h-11 w-full rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-4 pr-11 text-sm text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xs)] placeholder:text-[var(--niva-color-placeholder)]",
          nivaTransition,
          nivaFocusRing,
          nivaDisabledState,
          className,
        )}
        {...props}
      />
    </label>
  );
}
