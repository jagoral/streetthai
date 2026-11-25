# Shapes and panels

## Shapes

- **Refine**: one version, one panel, revised every round. The default.
- **Rivals**: 2-5 makers answer the same brief in genuinely different ways. Score all of them with `--candidate`. Drop the bottom half after round 1, then the weakest each round. When the user picks one, stop work on the rest and continue as refine.
- **Consult first**: 3-5 consultants, one lens each, write short briefs before anything is made. Merge them and record why you resolved each conflict. Show a consultant the problem but not the current solution to avoid anchoring.
- **Cold read**: fresh agents with zero context.
  - *Comprehension*: "What is this, who is it for, what next, where did you get lost?" Record how many got it right as a check.
  - *Task*: they do a real task using only the work (extend the API, apply the skill). Grade against an answer you wrote first. Use 2-3 tasks.
  - *Persona*: they play a real reader (a manager with 5 minutes, a first-time user).
- **Council**: the same review goes to strong models from different providers. In T3 Code, resolve them with `orchestrator_capabilities`, then send one `delegate_task` per model. Report an unreachable model and do not substitute one.
- **Score once**: one round, no fixes. Use it as an audit or to check whether a loop is worth running.

## Panel

Cover these, then add the craft lenses the work needs:

- **Audience**: the person it is for. Do they get it and act?
- **Feasibility**: can it be built, run and afforded in time?
- **Approver proxy**: answers as the client or manager would, from what they actually said.
- **Adversary**, when failure is costly: tries to break it.

Write each reviewer as one paragraph: role (a first name at most), lens, what it checks, what it blocks on.
