import { describe, expect, it } from "vitest";
import { getCurrentStatementPeriod, getStatementPeriodForLiability } from "@/lib/liabilities";

describe("getCurrentStatementPeriod", () => {
  it("runs from the day after the previous closing date through this month's closing date, when today hasn't reached it yet", () => {
    const period = getCurrentStatementPeriod(20, new Date("2026-07-15T10:00:00Z"));
    expect(period).toEqual({ start: "2026-06-21", end: "2026-07-20" });
  });

  it("treats the closing day itself as still inside the current period", () => {
    const period = getCurrentStatementPeriod(20, new Date("2026-07-20T23:00:00Z"));
    expect(period).toEqual({ start: "2026-06-21", end: "2026-07-20" });
  });

  it("rolls forward to next month's closing date once today has passed this month's", () => {
    const period = getCurrentStatementPeriod(20, new Date("2026-07-21T00:00:00Z"));
    expect(period).toEqual({ start: "2026-07-21", end: "2026-08-20" });
  });

  it("clamps a closing day beyond a shorter month's length", () => {
    const period = getCurrentStatementPeriod(31, new Date("2026-02-15T10:00:00Z"));
    expect(period).toEqual({ start: "2026-02-01", end: "2026-02-28" });
  });

  it("rolls a December period into January of the next year", () => {
    const period = getCurrentStatementPeriod(20, new Date("2026-12-25T10:00:00Z"));
    expect(period).toEqual({ start: "2026-12-21", end: "2027-01-20" });
  });
});

describe("getStatementPeriodForLiability", () => {
  it("uses the real statement period when a closing day is captured", () => {
    const result = getStatementPeriodForLiability(20, new Date("2026-07-15T10:00:00Z"));
    expect(result.isFallback).toBe(false);
    expect(result.period).toEqual({ start: "2026-06-21", end: "2026-07-20" });
  });

  it("falls back to the current calendar month so far when there is no closing day", () => {
    const result = getStatementPeriodForLiability(null, new Date("2026-07-15T10:00:00Z"));
    expect(result.isFallback).toBe(true);
    expect(result.period).toEqual({ start: "2026-07-01", end: "2026-07-15" });
  });
});
