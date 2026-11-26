import { tokenVar } from "@streetthai/ui";
import type { CSSProperties, ReactNode } from "react";

export type AppShellProps = {
  title: string;
  children: ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <main style={shellStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <p style={bodyStyle}>{children}</p>
    </main>
  );
}

const shellStyle: CSSProperties = {
  backgroundColor: tokenVar("color", "surface"),
  color: tokenVar("color", "text"),
  fontFamily: tokenVar("font", "body"),
  fontSize: tokenVar("text", "body"),
  lineHeight: tokenVar("leading", "body"),
  padding: tokenVar("space", "lg"),
};

const titleStyle: CSSProperties = {
  color: tokenVar("color", "accent"),
  fontSize: tokenVar("text", "title"),
  lineHeight: tokenVar("leading", "tight"),
  marginBlock: tokenVar("space", "md"),
};

const bodyStyle: CSSProperties = {
  color: tokenVar("color", "muted"),
  marginBlock: tokenVar("space", "sm"),
};
