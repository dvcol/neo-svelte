# `@dvcol/neo-svelte/containers`

```ts
import { NeoTransitionContainer } from '@dvcol/neo-svelte/containers';
```

## Components

- `NeoTransitionContainer` — wrapper that applies a coordinated enter/exit transition to its children. Useful for route transitions and conditionally-rendered panels.

## Concepts

- Pass children via the `children` snippet, keyed by the value you want to drive the transition (e.g. route name).
- Composes with the bundled `transition.scss` keyframes and respects `prefers-reduced-motion`.

See also: [collapse](../collapse/AGENTS.md), [floating/portal](../floating/portal/AGENTS.md).
