import { cn } from "@/lib/utils";

type AuroraPillsProps = {
  items: string[];
  active?: string;
  className?: string;
};

export function AuroraPills({ items, active = items[0], className }: AuroraPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ease-out",
            active === item ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.26)]" : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111827]",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
