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

- `NeoList` — flat or sectioned list with selection, filtering, infinite scroll, and a high-level row extension point.
- `NeoVirtualList` — windowed renderer for large datasets. Same item contract as `NeoList`.
- `NeoListSearch` — built-in search/filter input bound to a list's filter context.
- `NeoListBaseItem`, `NeoListBaseSection`, `NeoListBaseLoader` — building blocks for custom item renderers.

## Concepts

- **Item contract** — each item has `{ id, value, label?, disabled?, ... }`. Pass via the `items` prop; render custom UI through the `item` snippet receiving the item context.
- **Selection** — `bind:selected` (single or array, controlled by `multiple`). `selectOnFocus`, `selectOnHover`, `keepFocusOnSelect` tune the interaction model.
- **Filter / sort** — `filter` and `sort` accept either functions or option objects. `NeoListSearch` writes into the same filter pipeline.
- **Infinite scroll** — provide `onScrollEnd` (or `next`) to append pages. The list ships with a scrolling-tracker action so the callback fires once per threshold cross.
- **Virtualization** — `NeoVirtualList` requires fixed or measured row heights; pass `itemSize` (number or function).
- **Row composition** — `row` wraps the configured item/section content without replacing it. Its context is a superset of the item context, adding parent section metadata and a pre-bound `content()` snippet. Always call `content()` unless intentionally suppressing the configured `item`, `section`, or default renderer.

## Common pattern

```svelte
<NeoList items={results} bind:selected onScrollEnd={loadMore}>
  {#snippet item({ value })}<span>{value.title}</span>{/snippet}
</NeoList>
```

```svelte
<script lang="ts">
  import { NeoList } from '@dvcol/neo-svelte/list';
  import { NeoSortableItem, NeoSortableProvider } from '@dvcol/neo-svelte/sortable';
  import { attachToParent } from '@dvcol/neo-svelte/utils';

  let items = $state([
    { id: 'alpha', data: { id: 'alpha', value: 'alpha', label: 'Alpha' } },
    { id: 'bravo', data: { id: 'bravo', value: 'bravo', label: 'Bravo' } },
  ]);
</script>

<NeoSortableProvider bind:items>
  {#snippet children(ctx)}
    <NeoList items={ctx.items.map(({ data }) => data)}>
      {#snippet row({ item, index, content })}
        <NeoSortableItem id={String(item.id ?? index)} {index} data={item}>
          {#snippet children({ instance })}
            <div {...attachToParent(instance.attach)}>
              {@render content()}
            </div>
          {/snippet}
        </NeoSortableItem>
      {/snippet}
    </NeoList>
  {/snippet}
</NeoSortableProvider>
```

This is the minimal NeoList integration: the entire row is draggable. Add a handle inside the wrapper and attach `instance.attachHandle` only when drag activation should be restricted to that handle. The wrapper must remain the direct child rendered by `NeoSortableItem` because `attachToParent` deliberately registers NeoList's keyed outer row.

## Gotchas

- `NeoVirtualList` does not virtualize variable-height content automatically. For dynamic heights provide an `itemSize` function or use `NeoList`.
- ARIA `role="listbox"` is wired automatically; do not add your own `role` on the wrapper.
- `row` is non-virtual. It is ignored with a warning when `virtual` is enabled because virtual rows are mounted and evicted by the viewport renderer.

See also: [inputs](../inputs/AGENTS.md) (`NeoSelect` is built on `NeoList`).
