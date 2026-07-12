import { describe, expect, it } from "vitest";
import { colors } from "@/design/tokens/colors";
import { radius } from "@/design/tokens/radius";
import { shadows } from "@/design/tokens/shadows";
import { typography } from "@/design/tokens/typography";

describe("Niva Design Manual v4 tokens", () => {
  it("uses the approved cool product palette", () => {
    expect(colors.semantic.background).toBe("#FAFBFC");
    expect(colors.semantic.foreground).toBe("#111827");
    expect(colors.semantic.accent).toBe("#1E7A4E");
    expect(colors.semantic.accentHover).toBe("#186640");
    expect(colors.semantic.danger).toBe("#454B57");
    expect(colors.semantic.info).toBe("#5B6472");
  });

  it("keeps Meridian ultramarine outside the product accent", () => {
    expect(colors.brand.ultramarine).toBe("#27409A");
    expect(colors.brand.ultramarine).not.toBe(colors.semantic.accent);
  });

  it("uses the approved typography, radius and cool shadow systems", () => {
    expect(typography.fontFamily.sans).toContain("Inter");
    expect(typography.fontFamily.display).toContain("Manrope");
    expect(typography.fontFamily.mono).toContain("IBM Plex Mono");
    expect(radius.xl).toBe("1.125rem");
    expect(radius["3xl"]).toBe("1.625rem");
    expect(shadows.sm).toContain("16 24 40");
  });
});

