import Link from "next/link";
import { ChevronRight } from "lucide-react";

type AuroraBreadcrumbItem = {
  label: string;
  href?: string;
};

export function AuroraBreadcrumb({ items }: { items: AuroraBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#6B7280]">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {item.href ? <Link href={item.href} className="hover:text-[#2563EB]">{item.label}</Link> : <span className="text-[#111827]">{item.label}</span>}
          {index < items.length - 1 ? <ChevronRight className="h-3.5 w-3.5 text-[#D1D5DB]" /> : null}
        </span>
      ))}
    </nav>
  );
}
