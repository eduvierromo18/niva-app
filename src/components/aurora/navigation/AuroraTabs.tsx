import { cn } from "@/lib/utils";

type AuroraTabsProps = {
  tabs: string[];
  active?: string;
  className?: string;
};

export function AuroraTabs({ tabs, active = tabs[0], className }: AuroraTabsProps) {
  return (
    <div className={cn("flex gap-6 border-b border-[#E5E7EB]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-semibold transition-all duration-200 ease-out",
            active === tab ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#6B7280] hover:text-[#111827]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
