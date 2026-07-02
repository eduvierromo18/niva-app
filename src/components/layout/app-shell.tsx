"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Plus } from "lucide-react";
import { AuroraContainer, AuroraIconButton, AuroraPage, AuroraSidebar, AuroraSurface, AuroraTopbar } from "@/components/aurora";
import { appNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const sidebarGroupOrder = ["primary", "workspace", "support"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPageIndex = appNavigation.findIndex((item) => item.href === pathname);
  const currentPage = appNavigation[currentPageIndex] ?? appNavigation[0];
  const isHome = pathname === "/dashboard";
  const sidebarItems = appNavigation.map((item, index) => ({
    href: item.href,
    label: item.title,
    icon: <item.icon className="h-4 w-4" />,
    active: index === currentPageIndex,
    group: item.group,
  }));
  const sidebarGroups = sidebarGroupOrder
    .map((group) => ({
      items: sidebarItems.filter((item) => item.group === group),
    }))
    .filter((group) => group.items.length > 0);
  const mobileItems = appNavigation.filter((item) => item.group === "primary").slice(0, 4);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#111827]">
      <AuroraPage contained={false} className="px-4 pb-24 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pb-8 lg:pt-6">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <AuroraSidebar
            items={sidebarItems}
            groups={sidebarGroups}
            className="fixed left-6 top-6 hidden h-[calc(100vh-3rem)] max-w-64 lg:flex"
            footer={
              <div className="rounded-[20px] border border-[#DBEAFE] bg-[#F9FAFB] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <p className="text-sm font-bold text-[#111827]">Todo al día</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#6B7280]">Niva mantiene tu lectura financiera clara y sin ruido.</p>
              </div>
            }
          />

          <div className="hidden lg:block" />

          <AuroraContainer className="min-w-0 max-w-none px-0">
            <AuroraTopbar
              title={isHome ? "Hola Luis." : currentPage.title}
              subtitle={isHome ? "Así está tu dinero hoy." : "Niva"}
              searchPlaceholder="Buscar registros, cuentas o categorías..."
              actions={
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Link
                    href="/movements"
                    className="hidden h-10 items-center gap-2 rounded-lg bg-[#047857] px-4 text-sm font-bold text-white shadow-[0_4px_12px_rgba(4,120,87,0.22)] transition-all duration-200 ease-out hover:bg-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 sm:inline-flex"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo registro
                  </Link>
                  <AuroraIconButton icon={<Bell className="h-4 w-4" />} label="Notificaciones" />
                  <Link href="/settings" className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#F3F4F6]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-sm font-bold text-white">
                      LR
                    </div>
                    <span className="hidden max-w-40 truncate text-sm font-semibold text-[#111827] sm:inline">Luis Eduvier Romo</span>
                    <ChevronDown className="hidden h-4 w-4 text-[#6B7280] sm:block" />
                  </Link>
                </div>
              }
            />
            <AuroraSurface className="mt-5 min-w-0 overflow-hidden p-3 sm:p-5">
              <AuroraContainer className="max-w-none px-0">{children}</AuroraContainer>
            </AuroraSurface>
          </AuroraContainer>
        </div>
      </AuroraPage>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileItems.map((item) => (
            <Link
              key={`${item.href}-${item.title}`}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-[#6B7280]",
                pathname === item.href && "bg-[#EFF6FF] text-[#2563EB]",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-[#6B7280]",
              pathname === "/settings" && "bg-[#EFF6FF] text-[#2563EB]",
            )}
          >
            <Menu className="h-5 w-5" />
            Más
          </Link>
        </div>
      </nav>
    </div>
  );
}
