import type { ReactNode } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type AuroraHeroProps = {
  greeting: string;
  label: string;
  value: string;
  delta?: string;
  action?: ReactNode;
  variant?: "primary" | "light" | "dark";
  className?: string;
};

export function AuroraHero({ greeting, label, value, delta, action, variant = "primary", className }: AuroraHeroProps) {
  const isPrimary = variant === "primary";
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-5 shadow-[0_24px_48px_rgba(37,99,235,0.18)] sm:p-7",
        isPrimary && "border-[#6676FF] bg-gradient-to-br from-[#2563EB] via-[#5757F5] to-[#7C5CFF] text-white",
        variant === "light" && "border-[#E5E7EB] bg-white text-[#111827] shadow-[0_12px_24px_rgba(0,0,0,0.08)]",
        isDark && "border-[#263244] bg-[#111827] text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]",
        className,
      )}
    >
      <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10 bg-white/10" />
      <div className="relative">
        <p className={cn("text-base font-semibold", !isPrimary && !isDark && "text-[#111827]")}>{greeting}</p>
        <p className={cn("mt-7 text-lg font-medium", isPrimary || isDark ? "text-white" : "text-[#6B7280]")}>{label}</p>
        <p className="mt-4 break-words text-4xl font-bold tracking-tight sm:text-5xl">{value}</p>
        {delta ? (
          <p className={cn("mt-4 flex items-center gap-1 text-sm font-medium", isPrimary || isDark ? "text-emerald-100" : "text-[#10B981]")}>
            <TrendingUp className="h-4 w-4" />
            {delta}
          </p>
        ) : null}
        <div className="mt-8 max-w-full">
          {action ?? (
            <button className="inline-flex h-11 items-center gap-3 rounded-lg bg-white px-6 text-sm font-bold text-[#2563EB] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out hover:-translate-y-0.5">
              Ver detalle
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
