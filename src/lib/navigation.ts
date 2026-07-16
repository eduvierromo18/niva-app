import {
  ChartPie,
  Flag,
  Gauge,
  CalendarClock,
  Landmark,
  PiggyBank,
  ReceiptText,
  WalletCards,
} from "lucide-react";

export const appNavigation = [
  { title: "Inicio", href: "/dashboard", icon: Gauge, group: "primary" },
  { title: "Actividad", href: "/movements", icon: ReceiptText, group: "primary" },
  { title: "Cuentas", href: "/accounts", icon: WalletCards, group: "primary" },
  { title: "Programados", href: "/programados", icon: CalendarClock, group: "primary" },
  { title: "Análisis", href: "/categories", icon: ChartPie, group: "workspace" },
  { title: "Objetivos", href: "/goals", icon: Flag, group: "workspace" },
  { title: "Presupuestos", href: "/budgets", icon: PiggyBank, group: "workspace" },
  { title: "Deudas", href: "/liabilities", icon: Landmark, group: "workspace" },
];
