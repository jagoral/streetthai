import shared from "@streetthai/config/oxfmtrc.json" with { type: "json" };

export default {
  ...shared,
  ignorePatterns: [
    ".agents/**",
    ".claude/**",
    "internal-docs/**",
    ".product-docs/**",
    "**/*.md",
    "skills-lock.json",
    "pnpm-lock.yaml",
  ],
};
