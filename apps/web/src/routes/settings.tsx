import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "../components/settings-view.tsx";

export const Route = createFileRoute("/settings")({
  ssr: false,
  component: SettingsPage,
});

function SettingsPage() {
  const { db } = Route.useRouteContext();
  return <SettingsView connection={db} />;
}
