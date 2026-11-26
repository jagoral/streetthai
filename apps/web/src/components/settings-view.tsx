import type { LearnerSettingsCollection, PoliteParticle } from "@streetthai/db";
import { tokenVar } from "@streetthai/ui";
import { useEffect, useState, type CSSProperties } from "react";
import {
  useStreetThaiDb,
  type DbConnection,
  type StreetThaiDbModule,
} from "../db/use-street-thai-db.ts";

export type SettingsViewProps = {
  connection: DbConnection;
};

export function SettingsView({ connection }: SettingsViewProps) {
  const state = useStreetThaiDb(connection);

  return (
    <main style={viewStyle}>
      <h1 style={titleStyle}>Settings</h1>
      {state.status === "ready" ? (
        <PoliteParticlePicker settings={state.db.learnerSettings} module={state.module} />
      ) : (
        <p role="status" style={statusStyle}>
          {state.status === "loading"
            ? "Loading your settings..."
            : "Your settings could not be loaded."}
        </p>
      )}
    </main>
  );
}

type PoliteParticlePickerProps = {
  settings: LearnerSettingsCollection;
  module: StreetThaiDbModule;
};

function PoliteParticlePicker({ settings, module }: PoliteParticlePickerProps) {
  const settingsId = module.LEARNER_SETTINGS_ID;
  const politeParticle = useStoredPoliteParticle(settings, settingsId);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  async function choose(next: PoliteParticle) {
    setSaving(true);
    setSaveFailed(false);
    try {
      const tx =
        settings.get(settingsId) === undefined
          ? settings.insert({ id: settingsId, politeParticle: next })
          : settings.update(settingsId, (draft) => {
              draft.politeParticle = next;
            });
      await tx.when("settled");
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <fieldset aria-busy={saving} disabled={saving} style={fieldsetStyle}>
      <legend style={legendStyle}>Polite particle</legend>
      {module.politeParticles.map((particle) => (
        <label key={particle} style={optionStyle}>
          <input
            type="radio"
            name="polite-particle"
            value={particle}
            checked={politeParticle === particle}
            onChange={() => void choose(particle)}
          />
          {particle}
        </label>
      ))}
      {saveFailed ? (
        <p role="alert" style={statusStyle}>
          Your choice could not be saved.
        </p>
      ) : null}
    </fieldset>
  );
}

function useStoredPoliteParticle(
  settings: LearnerSettingsCollection,
  settingsId: string,
): PoliteParticle | undefined {
  const [politeParticle, setPoliteParticle] = useState(
    () => settings.get(settingsId)?.politeParticle,
  );

  useEffect(() => {
    const subscription = settings.subscribeChanges(
      () => setPoliteParticle(settings.get(settingsId)?.politeParticle),
      { includeInitialState: true },
    );
    return () => subscription.unsubscribe();
  }, [settings, settingsId]);

  return politeParticle;
}

const viewStyle: CSSProperties = {
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

const statusStyle: CSSProperties = {
  color: tokenVar("color", "muted"),
  marginBlock: tokenVar("space", "sm"),
};
