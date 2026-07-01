import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AuroraSidebarItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
};

type AuroraSidebarGroup = {
  items: AuroraSidebarItem[];
};

type AuroraSidebarProps = {
  items: AuroraSidebarItem[];
  groups?: AuroraSidebarGroup[];
  footer?: ReactNode;
  className?: string;
};

export function AuroraSidebar({ items, groups, footer, className }: AuroraSidebarProps) {
  const sections = groups ?? [{ items }];

  return (
    <aside className={cn("flex h-full min-h-[520px] w-full max-w-64 flex-col rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)]", className)}>
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#42D3FF] via-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">A</span>
        <div>
          <p className="text-lg font-bold leading-tight text-[#111827]">Aurora</p>
          <p className="text-xs font-medium text-[#6B7280]">Personal Finance</p>
        </div>
      </div>
      <nav className="mt-8 space-y-3">
        {sections.map((group, groupIndex) => (
          <div key={groupIndex} className={cn(groupIndex > 0 && "border-t border-[#E5E7EB] pt-3")}>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={`${groupIndex}-${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#6B7280] transition-all duration-200 ease-out hover:bg-[#F3F4F6] hover:text-[#111827]",
                    item.active && "bg-[#EFF6FF] text-[#2563EB]",
                  )}
                >
                  {item.icon ? <span className={cn("text-[#9CA3AF]", item.active && "text-[#2563EB]")}>{item.icon}</span> : null}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {footer ? <div className="mt-auto pt-6">{footer}</div> : null}
    </aside>
  );
}
