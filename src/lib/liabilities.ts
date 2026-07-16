// Shared statement-period calculations for the Deudas/Liabilities surface, kept
// pure + tested like analytics.ts/dashboard.ts do for their own screens.

import { currentMonthStart } from "@/lib/analytics";

export type StatementPeriod = { start: string; end: string };

function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

function statementCloseDate(year: number, monthIndex0: number, closingDay: number): Date {
  return new Date(Date.UTC(year, monthIndex0, Math.min(closingDay, daysInMonth(year, monthIndex0))));
}

/**
 * The statement period covering "today" for a card whose statement closes on
 * closingDay (1-31, clamped to shorter months) every month. A period runs from
 * the day after the previous closing date through the next closing date
 * (inclusive) -- e.g. closingDay=20, reference=July 15 -> June 21 to July 20
 * (this month hasn't closed yet). Once reference passes this month's closing
 * day, the period rolls forward to next month's.
 */
export function getCurrentStatementPeriod(closingDay: number, reference: Date = new Date()): StatementPeriod {
  const day = Math.max(1, Math.min(31, Math.round(closingDay)));
  const year = reference.getUTCFullYear();
  const monthIndex0 = reference.getUTCMonth();
  const refDateOnly = new Date(Date.UTC(year, monthIndex0, reference.getUTCDate()));
  const thisClose = statementCloseDate(year, monthIndex0, day);
  const end = refDateOnly.getTime() <= thisClose.getTime() ? thisClose : statementCloseDate(year, monthIndex0 + 1, day);
  const prevClose = statementCloseDate(end.getUTCFullYear(), end.getUTCMonth() - 1, day);
  const start = new Date(prevClose.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

/**
 * Resolves the period to show in a liability's statement detail: the real
 * statement-closing period when the card has a closing day captured, or the
 * current calendar month so far as a fallback when it doesn't (isFallback lets
 * the UI show a hint inviting the user to capture the closing day instead).
 */
export function getStatementPeriodForLiability(
  closingDay: number | null | undefined,
  reference: Date = new Date(),
): { period: StatementPeriod; isFallback: boolean } {
  if (closingDay) return { period: getCurrentStatementPeriod(closingDay, reference), isFallback: false };
  return { period: { start: currentMonthStart(reference), end: reference.toISOString().slice(0, 10) }, isFallback: true };
}
