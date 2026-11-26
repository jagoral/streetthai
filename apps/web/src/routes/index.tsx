import { createFileRoute } from "@tanstack/react-router";
import { APP_TAGLINE } from "../app-tagline.ts";
import { AppShell, BodyText } from "../components/app-shell.tsx";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell title="StreetThai">
      <BodyText>{APP_TAGLINE}</BodyText>
    </AppShell>
  );
}
