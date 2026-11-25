---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing GLOSSARY.md, or recording or editing an ADR in docs/adr/.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `GLOSSARY.md` for vocabulary is not this skill: that is a one-line habit any skill can do. This skill is for when you are changing the model, not just consuming it.)

## File structure

Single context at the repo root:

```text
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-first-decision.md
│       └── 0002-second-decision.md
└── src/
```

Create `docs/adr/` lazily: only when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `GLOSSARY.md`, call it out immediately. "Your glossary defines 'Pass' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You are saying 'card': do you mean a **Phrase Card**, an **Allergy Card**, or a **Beta Tone Card**? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force precision about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. Surface any contradiction immediately.

### Update GLOSSARY.md inline

When a term is resolved, update `GLOSSARY.md` right there. Do not batch these up: capture them as they happen. Use the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md).

`GLOSSARY.md` must stay devoid of implementation details. Do not treat `GLOSSARY.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Record every design decision as an ADR

Record every design or architectural decision as a concise, concrete ADR under `docs/adr/` following [ADR-FORMAT.md](./ADR-FORMAT.md) and the `.agents/skills/internal-docs/SKILL.md` writing register. Keep each ADR short (often one tight paragraph) and claim-first.
