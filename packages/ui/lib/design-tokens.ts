/**
 * Placeholder design tokens until the Design Prototype hand-off replaces their values.
 * Apps style only through these tokens, never through raw color or size literals.
 */
export const designTokens = {
  color: {
    surface: "#fffaf3",
    text: "#1f1a17",
    muted: "#6b5f57",
    accent: "#c8102e",
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
  font: {
    body: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  text: {
    body: "1rem",
    title: "1.75rem",
  },
  leading: {
    body: "1.5",
    tight: "1.2",
  },
} as const;

export type DesignTokens = typeof designTokens;

export type TokenGroup = keyof DesignTokens;

/**
 * A `:root` stylesheet that declares every token as a `--st-<group>-<name>` custom property.
 */
export const designTokensCss = `:root{${Object.entries(designTokens)
  .flatMap(([group, values]) =>
    Object.entries(values).map(([name, value]) => `--st-${group}-${name}:${value};`),
  )
  .join("")}}`;

/**
 * Returns the `var(...)` reference to one token's custom property.
 */
export function tokenVar<Group extends TokenGroup>(
  group: Group,
  name: keyof DesignTokens[Group] & string,
): string {
  return `var(--st-${group}-${name})`;
}
