import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const activeUiFiles = [
  "src/components/layout/app-shell.tsx",
  "src/components/screens/dashboard-screen.tsx",
  "src/components/screens/accounts-screen.tsx",
  "src/components/screens/movements-screen.tsx",
  "src/components/screens/scheduled-screen.tsx",
  "src/components/screens/budgets-screen.tsx",
  "src/components/screens/goals-screen.tsx",
  "src/components/screens/liabilities-screen.tsx",
  "src/components/screens/settings-screen.tsx",
  "src/components/auth/auth-card.tsx",
];

describe("UI v5 active route compliance", () => {
  it.each(activeUiFiles)("%s does not depend on Aurora", (file) => {
    const source = readFileSync(resolve(process.cwd(), file), "utf8");

    expect(source).not.toContain("@/components/aurora");
    expect(source).not.toMatch(/\b(?:slate|zinc|emerald|rose|amber)-\d+/);
    expect(source).not.toMatch(/[ÃÂ]/);
  });
});

