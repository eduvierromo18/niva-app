import {
  Banknote,
  Bike,
  Car,
  CircleDollarSign,
  CreditCard,
  Home,
  PiggyBank,
  ReceiptText,
  ShoppingBag,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { FinanceAccount, FinanceMetric, FinanceMovement, ScheduledTransaction } from "@/lib/finance-types";

export const accounts: FinanceAccount[] = [
  { id: "cash", name: "Efectivo", alias: "Caja diaria", type: "Efectivo", balance: 3000, color: "bg-[var(--niva-color-info)]", icon: CircleDollarSign },
  { id: "payroll", name: "Cuenta nómina", alias: "Nómina", type: "Banco", balance: 38250, color: "bg-[var(--niva-color-foreground)]", icon: WalletCards, bank_name: "bbva" },
  { id: "savings", name: "Ahorro", alias: "Reserva", type: "Banco", balance: 33150, color: "bg-[var(--niva-color-accent)]", icon: PiggyBank, bank_name: "nu" },
  { id: "nu-card", name: "Tarjeta credito", alias: "Credito", type: "Tarjeta", balance: -2150, color: "bg-[var(--niva-color-muted)]", icon: CreditCard, bank_name: "nu" },
];

export const metrics: FinanceMetric[] = [
  { label: "Ingresos", value: 45230, delta: 18.5, trend: "up", icon: Banknote },
  { label: "Gastos", value: 28450, delta: -8.3, trend: "down", icon: ReceiptText },
  { label: "Balance", value: 16780, delta: 35.7, trend: "up", icon: WalletCards },
  { label: "Ahorro", value: 37.1, delta: 12.4, trend: "up", icon: PiggyBank, percent: true },
];

export const categoryData = [
  { name: "Comida", value: 7250, color: "#1E7A4E", icon: Utensils },
  { name: "Vivienda", value: 6800, color: "#454B57", icon: Home },
  { name: "Transporte", value: 3450, color: "#5B6472", icon: Car },
  { name: "Compras", value: 2950, color: "#6B7280", icon: ShoppingBag },
  { name: "Servicios", value: 1900, color: "#9CA3AF", icon: Bike },
];

export const chartSeries = [
  { day: "1", ingresos: 5400, gastos: 2500 },
  { day: "3", ingresos: 4300, gastos: 3100 },
  { day: "5", ingresos: 5500, gastos: 4100 },
  { day: "8", ingresos: 4200, gastos: 3600 },
  { day: "10", ingresos: 6000, gastos: 3400 },
  { day: "12", ingresos: 5000, gastos: 3900 },
  { day: "15", ingresos: 2100, gastos: 2800 },
  { day: "17", ingresos: 6500, gastos: 3200 },
  { day: "20", ingresos: 4600, gastos: 5000 },
  { day: "22", ingresos: 4900, gastos: 3800 },
  { day: "25", ingresos: 3000, gastos: 4100 },
  { day: "28", ingresos: 7600, gastos: 4500 },
  { day: "30", ingresos: 4300, gastos: 3100 },
];

export const movements: FinanceMovement[] = [
  { date: "26 Jun", description: "Nómina quincenal", merchant: "Empresa SA de CV", account: "Cuenta nómina", category: "Ingresos", type: "Ingreso", amount: 22500 },
  { date: "25 Jun", description: "Supermercado", merchant: "Walmart", account: "Cuenta nómina", category: "Comida", type: "Gasto", amount: -1850 },
  { date: "24 Jun", description: "Renta", merchant: "Departamento", account: "Cuenta nómina", category: "Vivienda", type: "Gasto", amount: -6800 },
  { date: "22 Jun", description: "Ahorro mensual", merchant: "Transferencia interna", account: "Cuenta nómina", destinationAccount: "Ahorro", category: "Transferencia", type: "Transferencia", amount: 5000 },
  { date: "20 Jun", description: "Gasolina", merchant: "Shell", account: "Tarjeta", category: "Transporte", type: "Gasto", amount: -950 },
];

export const budgets = [
  { name: "Comida", spent: 7250, limit: 9000, icon: Utensils },
  { name: "Vivienda", spent: 6800, limit: 7000, icon: Home },
  { name: "Transporte", spent: 3450, limit: 4500, icon: Car },
  { name: "Compras", spent: 2950, limit: 5000, icon: ShoppingBag },
];

export const goals = [
  { name: "Fondo de emergencia", current: 33150, target: 80000, date: "Dic 2026" },
  { name: "Viaje familiar", current: 12400, target: 45000, date: "Ago 2026" },
  { name: "Enganche auto", current: 56000, target: 120000, date: "Mar 2027" },
];

export const liabilities = [
  { name: "Tarjeta principal", balance: 12800, limit: 50000, closing: "18 de cada mes", due: "04 de cada mes", icon: CreditCard },
  { name: "Prestamo personal", balance: 42000, limit: 70000, closing: "N/A", due: "15 de cada mes", icon: Banknote },
];

export const scheduledTransactions: ScheduledTransaction[] = [
  {
    id: "rent",
    name: "Renta",
    type: "expense",
    amount: 6800,
    account: "Cuenta nómina",
    category: "Vivienda",
    frequency: "monthly",
    startDate: "2026-01-01",
    nextDueDate: "2026-07-01",
    status: "active",
    notes: "Pago mensual del departamento",
    autoCreate: false,
  },
  {
    id: "netflix",
    name: "Netflix",
    type: "subscription",
    amount: 299,
    account: "Tarjeta credito",
    category: "Entretenimiento",
    frequency: "monthly",
    startDate: "2026-01-05",
    nextDueDate: "2026-06-30",
    status: "active",
    autoCreate: false,
  },
  {
    id: "payroll-next",
    name: "Nómina quincenal",
    type: "income",
    amount: 22500,
    account: "Cuenta nómina",
    category: "Ingresos",
    frequency: "biweekly",
    startDate: "2026-01-15",
    nextDueDate: "2026-07-15",
    status: "active",
    autoCreate: false,
  },
  {
    id: "card-payment",
    name: "Pago tarjeta principal",
    type: "debt_payment",
    amount: 6450,
    account: "Cuenta nómina",
    destinationAccount: "Tarjeta credito",
    category: "Pago de deuda",
    frequency: "monthly",
    startDate: "2026-01-04",
    nextDueDate: "2026-07-04",
    status: "active",
    autoCreate: false,
  },
  {
    id: "savings-transfer",
    name: "Transferencia a ahorro",
    type: "transfer",
    amount: 5000,
    account: "Cuenta nómina",
    destinationAccount: "Ahorro",
    category: "Transferencia",
    frequency: "monthly",
    startDate: "2026-01-22",
    nextDueDate: "2026-07-22",
    status: "paused",
    autoCreate: false,
  },
];
