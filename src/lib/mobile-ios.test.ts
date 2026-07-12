import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "src/components/mobile/niva-mobile-experience.tsx"),
  "utf8",
);

describe("Niva mobile iOS experience", () => {
  it("keeps the approved five-slot mobile navigation", () => {
    expect(source).toContain("Inicio");
    expect(source).toContain("Actividad");
    expect(source).toContain("Análisis");
    expect(source).toContain("Cuentas");
    expect(source).toContain('aria-label="Nuevo registro"');
  });

  it("respects iOS safe areas", () => {
    expect(source).toContain("env(safe-area-inset-top)");
    expect(source).toContain("env(safe-area-inset-bottom)");
  });

  it("covers normal, loading, empty and error states", () => {
    expect(source).toContain("MobileSkeleton");
    expect(source).toContain("MobileEmpty");
    expect(source).toContain("MobileError");
  });

  it("uses real product routes instead of static frames", () => {
    for (const route of ["/dashboard", "/movements", "/categories", "/accounts", "/goals"]) {
      expect(source).toContain(route);
    }
  });
});
