---
name: wide-event-logging
description: Decide what StreetThai server operations log, using the wide event pattern (one structured event per operation carrying every decision, count, and outcome). Use whenever adding logging, instrumenting a server endpoint, AI call, webhook, sync endpoint, or scheduled job, debugging a production issue, or touching console.log/console.error in server code. Also trigger when the user mentions "wide events" or structured logs.
---

# Wide Event Logging

Every server operation emits **one structured event** when it finishes (pattern from [loggingsucks.com](https://loggingsucks.com)). The event is the full story of that one run: who, what came in, which branch it took, why it stopped, what it produced, what it cost, and what went wrong on the side. Reading a single event must answer "what happened and why" without opening the code or any other log line.

The value is in **what** goes into the event, so most of this skill is about that.

## The questions every event answers

Before writing any `set` call, list the questions someone debugging this operation will ask. Each one becomes a field.

| Question | Field kind | Example fields |
| --- | --- | --- |
| Which operation, for whom, on what? | Identity | `op`, `learnerId`, `phraseCardId`, `webhookEventId` |
| What shape was the input? | Input shape, never input content | `captureInputLength`, `captureInputScript: "thai" \| "latin" \| "mixed"`, `retryCount`, `mode: "initial" \| "refill"` |
| Which way did it go? | Branch taken | `path: "cache_hit" \| "g2p" \| "llm"`, `action: "inserted" \| "refreshed" \| "reassigned"`, `resumePath` |
| Why did it stop early? | Exit reason (enum) | `skipped: "no_entitlement"`, `exitReason: "already_processed"`, `rejectionReason: "bad_signature"` |
| Did a guardrail fire? | Guardrail hit + its limits | `rateLimited: true, retryAfterMs`, `tooLarge: true, maxLength`, `throttled: true` |
| What state did it move from and to? | State transition | `previousStatus`, `newStatus`, `transitionedToActive: true` |
| What did it plan vs. actually produce? | Plan vs. actual | `plannedReplyVariants: 4, producedReplyVariants: 3`, `filteredCount` |
| How much came out? | Outcome counts | `imported`, `skippedCount`, `pushedCount`, `conflictCount`, `deletedCount` |
| What did it kick off next? | Side effects scheduled | `scheduledAudioClipGeneration: true`, `refillTriggered: true` |
| What failed without failing the operation? | Degraded / partial failure | `partialFailure: { failed: 1, total: 4 }`, `analyticsError: true`, `audioClipError: "timeout"` |
| What did AI or external calls do and cost? | AI and cost | `model`, `inputTokens`, `outputTokens`, `finishReason`, `llmDurationMs`, `costUsd` |
| How good was the result? | Quality signals | `inferredThaiConfidence`, `soundSpellingFromCatalog: true`, `fallbackUsed: true` |
| How long did each part take? | Timing | `durationMs` (automatic), `llmDurationMs`, `dbDurationMs` |
| Did it fail? | Error | `error: true`, `errorCode`, `errorName`, `errorMessage`, `causeName`, `causeMessage` (set only by `setError`) |

Not every event needs every row, but an operation that exits early without `skipped`/`exitReason`, or produces something without a count, is under-instrumented.

## Field rules

- **Reasons are enums, not sentences.** `skipped: "stale_webhook"`, not `skipped: "jobId mismatch, probably stale"`. Enums can be grouped and counted; sentences cannot.
- **Record the limit next to the hit.** A guardrail field without its threshold (`maxLength`, `retryAfterMs`, `entitlement`) cannot be tuned later.
- **Record plan and actual side by side** whenever an operation decides how much to produce before producing it. The gap between them is the bug.
- **Non-fatal failures are fields, not errors.** When a side step fails but the operation still succeeds (analytics, cost tracking, a thumbnail, cleanup), set a named field (`analyticsError: true`) and keep `error` unset. `error: true` means the operation itself failed.
- **Log the masked boundary error and its `cause`, never leak `cause` on the wire.** When the boundary translator masks an unexpected failure into an `internal` error, pass the translated error to `evt.setError(error)` so the wide event records `errorCode: "internal"` alongside `causeName` and `causeMessage` (never raw user content), while the wire response omits `cause`.
- **Expected domain refusals still carry `errorCode`.** Refusals like `invalid-input`, `not-found`, `conflict`, or `rate-limited` record `errorCode` (plus any guardrail or exit fields) so they are countable without looking like unhandled 500s.
- **Booleans for "did it happen"**, counts for "how many", enums for "which one". Never stringify a count or a boolean.
- **Add fields the moment they are known**, so an event that fails halfway still carries everything learned before the failure.
- **Use `GLOSSARY.md` terms** in `op` names and fields (`learnerId`, not `userId`; `phraseCardId`, not `flashcardId`; `thailandPass`, not `subscription`).

## Privacy: shape, never content

Logs leave the device and are searchable, so log **the shape of the data, never the data itself**:

- **Never:** emails, names, auth tokens, payment details, raw request bodies, prompts or completions, Capture Input text, Inferred Thai, Sound Spelling output, free-text titles, URLs with query strings.
- **Never:** Allergy Profile contents or which allergens an Allergy Card covers. Log `allergyCardId`, `allergenCount`, and `catalogVersion` instead.
- **Instead:** IDs, lengths, counts, enums, booleans, durations, versions, and opaque `learnerId`.

## StreetThai examples

What a good event carries for operations this product will have:

**`thailandPass.activate`** - `learnerId`, `thailandPassId`, `source: "paddle" | "revenuecat"`, `stackedOnExisting`, `previousExpiresAt`, `newExpiresAt`, `daysAdded`, `offlineAllowanceDays`, `skipped: "already_active" | "duplicate_purchase"`.

**`webhook.paddle` / `webhook.revenuecat`** - `webhookEventId`, `eventType`, `result: "applied" | "ignored" | "duplicate"`, `rejectionReason: "bad_signature" | "unknown_learner"`, `entitlementChanged`, `previousEntitlement`, `newEntitlement`.

**`capture.inferThai`** - `learnerId`, `captureInputLength`, `captureInputScript`, `path: "catalog" | "g2p" | "llm"`, `model`, `inputTokens`, `outputTokens`, `finishReason`, `llmDurationMs`, `fallbackUsed`, `betaToneCardShown`, `rateLimited`, `retryAfterMs`.

**`sync.push` / `sync.pull`** - `learnerId`, `collection`, `batchSize`, `pushedCount`, `conflictCount`, `conflictResolution: "server_wins" | "merged"`, `checkpointBefore`, `checkpointAfter`, `offlineGapMs`, `partialFailure`.

**`allergyCard.assemble`** - `learnerId`, `allergyCardId`, `allergenCount`, `catalogVersion`, `allPhrasesFromCatalog`, `missingPhraseCount` (any non-zero value is a kill-condition signal; see `formal-verify`).

**`phraseCard.generateReplyVariants`** - `phraseCardId`, `plannedReplyVariants`, `producedReplyVariants`, `filteredCount`, `filterReasons`, `model`, tokens, `scheduledAudioClipGeneration`, `audioClipError`.

## What to instrument

- **Instrument:** server endpoints that do I/O or represent a Learner intent, AI calls, payment webhooks, sync endpoints, scheduled jobs (one event per run).
- **Skip:** pure domain functions (G2P, tone derivation, formatting) - they are tested, not logged; trivial reads; helpers always called inside an instrumented operation (they add fields to the parent's event); client and offline code.

## Mechanics

The event is a small `WideEvent` object (`op` set at creation, `set(key, value)` / `set({...})`, `setError(error)`, `emit()` adds `durationMs` and writes one JSON line). If `packages/logging/` does not exist yet, create it the first time you instrument something, with the clock and log sink injected (`AGENTS.md` bans `Date.now` in `packages/**` and module mocking) and wired once in the app's composition root, whatever server framework it uses.

```typescript
async function activate(rawInput: unknown): Promise<ActivationResult> {
  const evt = startEvent("thailandPass.activate");
  try {
    const input = parseActivateInput(rawInput);
    evt.set({ learnerId: input.learnerId, source: input.source });
    const result = await activateThailandPass(input, evt);
    evt.set({ newExpiresAt: result.expiresAt });
    return result;
  } catch (error) {
    evt.setError(error);
    throw error;
  } finally {
    evt.emit();
  }
}
```

- Create the event before the first `await`; `emit()` in `finally`, exactly once.
- Helpers receive the event and `set` fields, but never `emit`.
- No `console.log` / `console.error` in server code, no log levels (`error: true` distinguishes failures), no global logger, no logging wrappers.
- Product analytics (funnels, retention) are separate events in the analytics tool. A wide event is for understanding one run of one operation.

To find instrumented operations, grep for `startEvent("` instead of keeping a list.
