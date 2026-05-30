# `@dvcol/neo-svelte/badge`

```ts
import { NeoBadge } from '@dvcol/neo-svelte/badge';
```

## Components

- `NeoBadge` — small status / count indicator. Renders inline by default; pass a child (or wrap a target) to anchor the badge in a corner of an element.

## Concepts

- Color follows the active theme palette (`primary`/`secondary`/`error`/`warning`/`success`/`default`). Override via `--neo-color-*` tokens scoped to the badge instance.
- Visibility is reactive — bind a count and let the consumer decide when to hide (`{#if count}<NeoBadge>{count}</NeoBadge>{/if}`).

## Gotchas

- A `NeoThemeProvider` ancestor is required for the badge palette to resolve.

See also: live demo `DemoBadge`, neighboring [pill](../pill/AGENTS.md).
