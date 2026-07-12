import { cn } from "@/lib/utils";

export type NivaMarkTone = "positive" | "dark";

export function NivaMark({
  tone = "positive",
  className,
  title = "Niva",
}: {
  tone?: NivaMarkTone;
  className?: string;
  title?: string;
}) {
  const upright = tone === "dark" ? "#FCFCFD" : "#111827";
  const crossing = tone === "dark" ? "#6E8AD6" : "#27409A";

  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
      className={cn("h-8 w-8 shrink-0", className)}
      fill="none"
    >
      <line x1="40" y1="33" x2="40" y2="83" stroke={upright} strokeWidth="13" />
      <line x1="80" y1="33" x2="80" y2="83" stroke={upright} strokeWidth="13" />
      <line x1="40" y1="33" x2="80" y2="83" stroke={crossing} strokeWidth="13" />
    </svg>
  );
}

export function NivaWordmark({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-niva-brand)] text-[1.625rem] font-light leading-none tracking-[-0.03em]",
        inverse ? "text-[#FCFCFD]" : "text-[#111827]",
        className,
      )}
    >
      Niva
    </span>
  );
}

export function NivaBrandLockup({
  ground = "light",
  className,
}: {
  ground?: "light" | "dark";
  className?: string;
}) {
  const dark = ground === "dark";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <NivaMark tone={dark ? "dark" : "positive"} />
      <NivaWordmark inverse={dark} />
    </span>
  );
}

