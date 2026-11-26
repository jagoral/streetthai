import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/app-shell.tsx";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return <AppShell title="StreetThai">Speak Thai at the street stall, even offline.</AppShell>;
}
