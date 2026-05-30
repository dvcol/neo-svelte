# `@dvcol/neo-svelte/collapse`

```ts
import { NeoAccordion, NeoCollapse, NeoCollapseGroup } from '@dvcol/neo-svelte/collapse';
```

## Components

- `NeoCollapse` — single show/hide region with animated height transition. `bind:open`.
- `NeoCollapseGroup` — coordinates multiple collapses (mutually exclusive vs. independent).
- `NeoAccordion` — pre-styled accordion built on collapse-group with header affordances.

## Concepts

- Open state is the source of truth; bind it (`bind:open`) and toggle from anywhere (e.g. an external button).
- Transitions honor `prefers-reduced-motion`; do not replace them with `display: none` toggles unless you replicate that fallback.

## Gotchas

- `NeoCollapse` measures content height on toggle; if you stream content in async, set `open={false}` until the content is mounted to avoid an animation jump.

See also: [containers](../containers/AGENTS.md), [nav](../nav/AGENTS.md).
