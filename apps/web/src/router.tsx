import { designTokensCss } from "@streetthai/ui";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import type { RouterContext } from "./routes/__root.tsx";

/**
 * Composition root: builds the router and injects every app-wide dependency through its context.
 */
export function getRouter() {
  const context: RouterContext = { designTokensCss };
  return createRouter({ routeTree, context, scrollRestoration: true });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
