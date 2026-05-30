# `@dvcol/neo-svelte/floating/portal`

```ts
import { NeoPortal, NeoPortalContainer, NeoPortalTarget } from '@dvcol/neo-svelte/floating/portal';
```

## Components

- `NeoPortal` — render children into another DOM node (default: `document.body`).
- `NeoPortalContainer` — provider that designates a target subtree for nested `NeoPortalTarget` lookups.
- `NeoPortalTarget` — named slot a `NeoPortal` can target by id.

## Concepts

- Portals preserve Svelte component identity and reactivity across the DOM hop.
- The named-target pattern (`NeoPortalContainer` + `NeoPortalTarget` + `NeoPortal target="..."`) lets you portal _within_ the app shell instead of body — useful for shadow-DOM and modal-stack scenarios.

## Gotchas

- Portaled content escapes CSS scoping. Keep style dependencies on theme tokens (`--neo-*`) so they still resolve via `[neo-theme-root]`.
- Z-index ordering across multiple portaled overlays is the consumer's job — the library does not maintain a global stack.

See also: [floating](../AGENTS.md), [floating/notification](../notification/AGENTS.md).
