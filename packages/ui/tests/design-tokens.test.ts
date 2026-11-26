import { describe, expect, test } from "vitest";
import { designTokens, designTokensCss, tokenVar } from "../index.ts";

describe("designTokens", () => {
  test("defines placeholder color, space and type tokens", () => {
    expect(Object.keys(designTokens)).toEqual(
      expect.arrayContaining(["color", "space", "font", "text", "leading"]),
    );
  });

  test("designTokensCss declares one --st custom property per token on :root", () => {
    expect(designTokensCss.startsWith(":root{")).toBe(true);
    for (const [group, values] of Object.entries(designTokens)) {
      for (const [name, value] of Object.entries(values)) {
        expect(designTokensCss).toContain(`--st-${group}-${name}:${value};`);
      }
    }
  });

  test("tokenVar references a custom property that designTokensCss declares", () => {
    expect(tokenVar("color", "surface")).toBe("var(--st-color-surface)");
    expect(designTokensCss).toContain("--st-color-surface:");
    expect(tokenVar("space", "md")).toBe("var(--st-space-md)");
  });
});
