import {
  ChartPie,
  CircleHelp,
  CreditCard,
  Flag,
  Gauge,
  CalendarClock,
  ListTree,
  ReceiptText,
  Settings,
  WalletCards,
} from "lucide-react";

export const appNavigation = [
  { title: "Home", href: "/dashboard", icon: Gauge, group: "primary" },
  { title: "Tu dinero", href: "/accounts", icon: WalletCards, group: "primary" },
  { title: "Actividad", href: "/movements", icon: ReceiptText, group: "primary" },
  { title: "Analisis", href: "/categories", icon: ChartPie, group: "primary" },
  { title: "Objetivos", href: "/goals", icon: Flag, group: "primary" },
  { title: "Programados", href: "/programados", icon: CalendarClock, group: "workspace" },
  { title: "Presupuestos", href: "/budgets", icon: ChartPie, group: "workspace" },
  { title: "Categorias", href: "/categories", icon: ListTree, group: "workspace" },
  { title: "Cuentas", href: "/accounts", icon: CreditCard, group: "workspace" },
  { title: "Configuracion", href: "/settings", icon: Settings, group: "support" },
  { title: "Ayuda", href: "/settings", icon: CircleHelp, group: "support" },
];
