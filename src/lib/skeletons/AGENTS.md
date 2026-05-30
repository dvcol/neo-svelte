# `@dvcol/neo-svelte/skeletons`

```ts
import { NeoSkeletonContainer, NeoSkeletonMedia, NeoSkeletonText } from '@dvcol/neo-svelte/skeletons';
```

## Components

- `NeoSkeletonContainer` — wrapping container that toggles a shared shimmer state across its children.
- `NeoSkeletonText` — line-shaped placeholder.
- `NeoSkeletonMedia` — block-shaped placeholder for images/cards.

## Concepts

- Most other components also accept `skeleton` directly (`NeoButton`, `NeoInput`, …). Use those when the placeholder shape should match the real component; reach for this scope when you need bare placeholders.
- Shimmer animation honors `prefers-reduced-motion`.

See also: [loading](../loading/AGENTS.md), [media](../media/AGENTS.md).
