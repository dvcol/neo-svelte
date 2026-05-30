# `@dvcol/neo-svelte/cards`

```ts
import { NeoCard } from '@dvcol/neo-svelte/cards';
```

## Components

- `NeoCard` — neumorphic / glassmorphic surface. Used as a layout primitive for tiles, panels, and floating containers.

## Concepts

- The card carries the elevation/shadow tokens (`--neo-box-shadow-*`); nested neumorphic components inherit a coherent light source from their card ancestor.
- Snippet props let you inject `header`, `footer`, and `children` regions while keeping a consistent padding scale.

## Gotchas

- Stacking many cards with strong elevation looks muddy. Prefer one elevated surface per visual group; nest `flat` cards inside.

See also: [collapse](../collapse/AGENTS.md), [containers](../containers/AGENTS.md).
