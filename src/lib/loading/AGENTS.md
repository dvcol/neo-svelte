# `@dvcol/neo-svelte/loading`

```ts
import { NeoLazy, NeoLoadingMatrix, NeoSuspense } from '@dvcol/neo-svelte/loading';
```

## Components

- `NeoLazy` — defers rendering of children until they enter an `IntersectionObserver` threshold.
- `NeoSuspense` — declarative async-boundary wrapper; renders a loader snippet while a promise settles, falls back on error.
- `NeoLoadingMatrix` — pre-styled grid of loading dots; useful as a default placeholder.

## Concepts

- `NeoSuspense` accepts a `promise` (or `awaiting` boolean) and `loading` / `error` / `children` snippets. The error snippet receives the thrown error.
- `NeoLazy` is deliberately decoupled from `NeoSuspense` — compose them when you need both deferral and async rendering.

## Gotchas

- `NeoLazy` mounts children once the threshold is crossed and does not re-virtualize. For windowed lists use `NeoVirtualList`.

See also: [skeletons](../skeletons/AGENTS.md), [list](../list/AGENTS.md).
