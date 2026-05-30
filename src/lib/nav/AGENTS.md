# `@dvcol/neo-svelte/nav`

```ts
import { NeoTab, NeoTabDivider, NeoTabPanel, NeoTabs, NeoTabsCard, NeoTabsRow } from '@dvcol/neo-svelte/nav';
```

## Components

- `NeoTabs` — tab strip + panels.
- `NeoTab`, `NeoTabPanel` — building blocks for fully-controlled tab structures.
- `NeoTabsCard`, `NeoTabsRow` — pre-styled variants (card surface, inline row).
- `NeoTabDivider` — visual separator between tab groups.

## Concepts

- `bind:active` is the source of truth (id of the active tab).
- ARIA: tabs are wired with `role="tab"` / `tabpanel`, arrow-key navigation, `aria-controls`/`aria-labelledby`.
- Lazy panels: pass `lazy` to mount only the active panel; otherwise all panels mount eagerly to preserve scroll/focus state.

## Common pattern

```svelte
<NeoTabs bind:active items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}>
  {#snippet panel({ id })}
    {#if id === 'a'}<APanel />{:else}<BPanel />{/if}
  {/snippet}
</NeoTabs>
```

See also: [stepper](../stepper/AGENTS.md), [collapse](../collapse/AGENTS.md).
