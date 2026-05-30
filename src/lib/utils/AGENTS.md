# `@dvcol/neo-svelte/utils`

```ts
import { /* ... */ } from '@dvcol/neo-svelte/utils';
```

## What's here

Shared helpers the components use internally. Reach for these before writing your own to stay token-consistent:

- **Color** — OKLCH manipulation, palette generation, contrast helpers.
- **Shadow / elevation** — neumorphic shadow builders that respect the active light source.
- **Border-radius** — radius scale helpers.
- **HTML element typing** — `HTMLNeoBaseElement<Tag>` and friends used to type wrapper component props.
- **Actions / hooks** — small Svelte 5 actions (e.g. scroll trackers) used by list/floating components.

## Concepts

- These helpers read from the same CSS custom properties the visual components consume. Calling them without a `NeoThemeProvider` ancestor produces uninitialised values.
- Tree-shakeable — import named symbols, not the whole namespace.

## Gotchas

- The exact API surface is the published types. Browse `dist/utils/index.d.ts` (or your editor's IntelliSense) — this guide intentionally does not enumerate it.

See also: [providers](../providers/AGENTS.md), [USAGE.md](../../../USAGE.md).
