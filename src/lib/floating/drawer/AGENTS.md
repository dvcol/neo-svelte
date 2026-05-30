# `@dvcol/neo-svelte/floating/drawer`

```ts
import { NeoDrawer, NeoDrawerConfirm, NeoDrawerStepper } from '@dvcol/neo-svelte/floating/drawer';
```

## Components

- `NeoDrawer` — edge-anchored panel (left/right/top/bottom) backed by the native `<dialog>` element.
- `NeoDrawerConfirm` / `NeoDrawerStepper` — pre-composed confirm and multi-step variants.

## Concepts

- Same `bind:open` / `modal` / `closable` semantics as `NeoDialog`.
- `placement` controls which edge the drawer slides in from.
- Drag-to-dismiss uses `NeoHandle` from `@dvcol/neo-svelte/floating`.

## Gotchas

- On small viewports a top/bottom drawer may overlap on-screen keyboards; size content for the visual viewport, not the layout viewport.
- For nested drawers, give each its own `bind:open` — they do not coordinate automatically.

See also: [floating/dialog](../dialog/AGENTS.md), [floating](../AGENTS.md).
