import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuroraIconButton } from "@/components/aurora/buttons/AuroraIconButton";
import { cn } from "@/lib/utils";

type AuroraPaginationProps = {
  page?: number;
  total?: number;
  className?: string;
};

export function AuroraPagination({ page = 1, total = 10, className }: AuroraPaginationProps) {
  const pages = [1, 2, 3];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AuroraIconButton icon={<ChevronLeft className="h-4 w-4" />} label="Pagina anterior" />
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          className={cn("h-8 w-8 rounded-lg text-sm font-bold", item === page ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#6B7280] hover:bg-[#F3F4F6]")}
        >
          {item}
        </button>
      ))}
      <span className="px-2 text-sm font-semibold text-[#6B7280]">...</span>
      <button type="button" className="h-8 w-8 rounded-lg text-sm font-bold text-[#6B7280] hover:bg-[#F3F4F6]">{total}</button>
      <AuroraIconButton icon={<ChevronRight className="h-4 w-4" />} label="Pagina siguiente" />
    </div>
  );
}
