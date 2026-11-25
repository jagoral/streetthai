---
name: formal-verify
description: Design, run, and maintain formal verification checks (TLA+, fast-check property tests, or exhaustive invariant checks) for StreetThai's kill-condition areas. Use whenever creating or modifying offline sync/replication, 90-Day Pass entitlements, allergy/dietary card assembly, or Thai G2P/Sound Spelling tone rules.
---

# Formal Verification

Verify high-stakes invariants where a bug harms users and example-based tests rarely reach the breaking interleaving or input.

## Choose the tool from the question

- **Concurrency, retries, reconnects, or state-transition ordering** (offline sync/RxDB/Dexie/Supabase outbox, 90-Day Pass lifecycle): model the protocol in **TLA+** and run TLC over bounded state spaces.
- **Universal behavior over large input domains** (Thai G2P, Step-0 Unicode normalization, syllable classification, tone derivation, numeral modes): run **property-based testing (`fast-check`)** directly against the real TypeScript entry points.
- **Finite, safety-critical catalogs** (allergy & dietary card assembly, serialization, offline rendering): run **exhaustive invariant tests** over every catalog item and combination.

## Validity criteria

Every formal check in this repo must satisfy all five rules:

1. **True to the code.** Every modeled state, variable, and indivisible step maps directly to real files, functions, and names in this repo.
2. **Able to fail.** A check never seen failing proves nothing. Prove every new or edited check against a deliberate broken mutation of the real code, confirm it catches the bug, then revert the mutation.
3. **Findings stay findings.** When real code violates a property, report the counterexample as a short sequence of steps in the code's own terms. Never weaken a property or model to force a pass.
4. **Honest about scope.** Record exact bounds, assumptions, and exclusions. A passing bounded check proves the model within its bounds, not the entire system.
5. **Cheap to rerun and kept in sync.** Expose one fast command (`pnpm verify:<area>`), pin the tool version, and record the covered file paths and the commit SHA at which correspondence was last confirmed.

## When modifying covered code

1. Check the verification spec's coverage list and sync commit.
2. Run `pnpm verify:<area>` before and after your change.
3. If a check fails, distinguish a real product bug from an intended design change. Update the model only when the product contract intentionally changed, re-prove it catches a broken mutation, and advance the sync commit only after verifying correspondence.
