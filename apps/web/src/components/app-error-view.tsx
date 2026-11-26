import { AppShell, BodyText } from "./app-shell.tsx";

/**
 * The app's single UI error boundary view: every error a screen does not handle lands here with
 * the same learner-facing copy, whatever its cause.
 */
export function AppErrorView() {
  return (
    <AppShell title="Something went wrong">
      <BodyText role="alert">Please reload StreetThai to try again.</BodyText>
    </AppShell>
  );
}
