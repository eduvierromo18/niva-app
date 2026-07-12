import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Meridian brand assets", () => {
  it("preserves the approved mark geometry and ground colors", () => {
    const positive = readFileSync(resolve("public/brand/meridian-mark-positive.svg"), "utf8");
    const dark = readFileSync(resolve("public/brand/meridian-mark-dark.svg"), "utf8");

    expect(positive).toContain('stroke="#111827"');
    expect(positive).toContain('stroke="#27409A"');
    expect(dark).toContain('stroke="#FCFCFD"');
    expect(dark).toContain('stroke="#6E8AD6"');
    expect(positive.match(/<line /g)).toHaveLength(3);
    expect(dark.match(/<line /g)).toHaveLength(3);
  });

  it("ships every approved local product font", () => {
    const fonts = [
      "archivo-light-latin.woff2",
      "ibm-plex-mono-regular-latin.woff2",
      "ibm-plex-mono-medium-latin.woff2",
      "inter-latin.woff2",
      "manrope-latin.woff2",
    ];

    for (const font of fonts) {
      expect(existsSync(resolve("public/fonts", font)), font).toBe(true);
    }
  });
});

