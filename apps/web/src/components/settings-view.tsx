import type { PoliteParticle, StreetThaiDb } from "@streetthai/db";
import { tokenVar } from "@streetthai/ui";
import {
  Suspense,
  useCallback,
  useOptimistic,
  useSyncExternalStore,
  useTransition,
  type CSSProperties,
} from "react";
import { useStreetThaiDb, type DbConnection } from "../db/use-street-thai-db.ts";
import { AppShell, BodyText } from "./app-shell.tsx";

export type SettingsViewProps = {
  connection: DbConnection;
};

/**
 * Learner settings screen; it suspends while the database opens, and a failure to open or save
 * reaches the nearest error boundary.
 */
export function SettingsView({ connection }: SettingsViewProps) {
  return (
    <AppShell title="Settings">
      <Suspense fallback={<BodyText role="status">Loading your settings...</BodyText>}>
        <PoliteParticlePicker connection={connection} />
      </Suspense>
    </AppShell>
  );
}

function PoliteParticlePicker({ connection }: SettingsViewProps) {
  const { db, politeParticles } = useStreetThaiDb(connection);
  const [politeParticle, showPoliteParticle] = useOptimistic(useSavedPoliteParticle(db));
  const [saving, startSaving] = useTransition();

  function choose(next: PoliteParticle) {
    startSaving(async () => {
      showPoliteParticle(next);
      await db.savePoliteParticle(next);
    });
  }

  return (
    <fieldset aria-busy={saving} disabled={saving} style={fieldsetStyle}>
      <legend style={legendStyle}>Polite particle</legend>
      {politeParticles.map((particle) => (
        <label key={particle} style={optionStyle}>
          <input
            type="radio"
            name="polite-particle"
            value={particle}
            checked={politeParticle === particle}
            onChange={() => choose(particle)}
          />
          {particle}
        </label>
      ))}
    </fieldset>
  );
}

function useSavedPoliteParticle(db: StreetThaiDb): PoliteParticle | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const subscription = db.learnerSettings.subscribeChanges(onChange);
      return () => subscription.unsubscribe();
    },
    [db],
  );
  const read = useCallback(() => db.politeParticle(), [db]);
  return useSyncExternalStore(subscribe, read, read);
}

const fieldsetStyle: CSSProperties = {
  borderColor: tokenVar("color", "muted"),
  display: "flex",
  flexDirection: "column",
  gap: tokenVar("space", "sm"),
  padding: tokenVar("space", "md"),
};

const legendStyle: CSSProperties = {
  paddingInline: tokenVar("space", "sm"),
};

const optionStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: tokenVar("space", "sm"),
};
