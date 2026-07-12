import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--niva-radius-full)] bg-[var(--niva-color-muted-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--niva-color-muted)]",
        className,
      )}
      {...props}
    />
  );
}
