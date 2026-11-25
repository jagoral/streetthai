# GLOSSARY.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Relationships

{Optional compact Mermaid classDiagram showing how canonical terms relate.}

## {Cluster Name}

**{Term}**:
{One or two sentences defining what it IS, not what it does. Bold other glossary terms.}
_Avoid_: {rejected synonyms}
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Bold other glossary terms inside a definition.** Let the sentence around it say how the two relate.
- **Only include terms specific to this project's domain.** General programming concepts (timeouts, error types, utilities) do not belong.
- **Mark deferred concepts `_Later_.`** Define them now so nothing gets named twice.
- **Group terms under subheadings** when natural clusters emerge.
