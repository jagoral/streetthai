import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useHydrated,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export type RouterContext = {
  designTokensCss: string;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StreetThai" },
    ],
    styles: [{ children: match.context.designTokensCss }],
  }),
  shellComponent: RootDocument,
  component: Outlet,
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
