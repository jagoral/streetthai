import { designTokens } from "@streetthai/ui";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useHydrated,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import type { DbConnection } from "../db/use-street-thai-db.ts";

export type RouterContext = {
  designTokensCss: string;
  db: DbConnection;
  registerServiceWorker: () => void;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: designTokens.color.accent },
      { title: "StreetThai" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    styles: [{ children: match.context.designTokensCss }],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootDocument({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  return (
    <html lang="en" data-hydrated={hydrated}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { registerServiceWorker } = Route.useRouteContext();
  useEffect(registerServiceWorker, [registerServiceWorker]);
  return <Outlet />;
}
