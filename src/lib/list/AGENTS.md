# `@dvcol/neo-svelte/list`

```ts
import {
  NeoList,
  NeoListBaseItem,
  NeoListBaseLoader,
  NeoListBaseSection,
  NeoListSearch,
  NeoVirtualList,
} from '@dvcol/neo-svelte/list';
```

## Components

- `NeoList` — flat or sectioned list with selection, filtering, infinite scroll.
- `NeoVirtualList` — windowed renderer for large datasets. Same item contract as `NeoList`.
- `NeoListSearch` — built-in search/filter input bound to a list's filter context.
- `NeoListBaseItem`, `NeoListBaseSection`, `NeoListBaseLoader` — building blocks for custom item renderers.

## Concepts

- **Item contract** — each item has `{ id, value, label?, disabled?, ... }`. Pass via the `items` prop; render custom UI through the `item` snippet receiving the item context.
- **Selection** — `bind:selected` (single or array, controlled by `multiple`). `selectOnFocus`, `selectOnHover`, `keepFocusOnSelect` tune the interaction model.
- **Filter / sort** — `filter` and `sort` accept either functions or option objects. `NeoListSearch` writes into the same filter pipeline.
- **Infinite scroll** — provide `onScrollEnd` (or `next`) to append pages. The list ships with a scrolling-tracker action so the callback fires once per threshold cross.
- **Virtualization** — `NeoVirtualList` requires fixed or measured row heights; pass `itemSize` (number or function).

## Common pattern

```svelte
<NeoList items={results} bind:selected onScrollEnd={loadMore}>
  {#snippet item({ value })}<span>{value.title}</span>{/snippet}
</NeoList>
```

## Gotchas

- `NeoVirtualList` does not virtualize variable-height content automatically. For dynamic heights provide an `itemSize` function or use `NeoList`.
- ARIA `role="listbox"` is wired automatically; do not add your own `role` on the wrapper.

See also: [inputs](../inputs/AGENTS.md) (`NeoSelect` is built on `NeoList`).
