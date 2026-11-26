import { describe, expect, test } from "vitest";
import { designTokens, designTokensCss, tokenVar } from "../index.ts";

describe("designTokens", () => {
  test("defines placeholder color, space and type tokens", () => {
    expect(Object.keys(designTokens)).toEqual(
      expect.arrayContaining(["color", "space", "font", "text", "leading"]),
    );
  });

  test("designTokensCss declares one --st custom property per token on :root", () => {
    expect(designTokensCss).toBe(
      ":root{" +
        "--st-color-surface:#fffaf3;" +
        "--st-color-text:#1f1a17;" +
        "--st-color-muted:#6b5f57;" +
        "--st-color-accent:#c8102e;" +
        "--st-space-xs:0.25rem;" +
        "--st-space-sm:0.5rem;" +
        "--st-space-md:1rem;" +
        "--st-space-lg:2rem;" +
        '--st-font-body:system-ui, -apple-system, "Segoe UI", sans-serif;' +
        "--st-text-body:1rem;" +
        "--st-text-title:1.75rem;" +
        "--st-leading-body:1.5;" +
        "--st-leading-tight:1.2;" +
        "}",
    );
  });

  test("tokenVar references a custom property that designTokensCss declares", () => {
    expect(tokenVar("color", "surface")).toBe("var(--st-color-surface)");
    expect(designTokensCss).toContain("--st-color-surface:");
    expect(tokenVar("space", "md")).toBe("var(--st-space-md)");
  });
});
