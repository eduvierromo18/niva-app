import { cn } from "@/lib/utils";

type AuroraLoadingProps = {
  label?: string;
  className?: string;
};

export function AuroraLoading({ label = "Cargando", className }: AuroraLoadingProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm font-semibold text-[#6B7280]", className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D1D5DB] border-t-[#2563EB]" />
      {label}
    </div>
  );
}
