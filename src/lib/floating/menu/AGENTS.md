# `@dvcol/neo-svelte/floating/menu`

```ts
import { NeoMenu, NeoMenuList, NeoMenuListItem } from '@dvcol/neo-svelte/floating/menu';
```

## Components

- `NeoMenu` — popover menu anchored to a trigger, with cascading submenus.
- `NeoMenuList`, `NeoMenuListItem` — building blocks for custom menu structures.

## Concepts

- Triggers are passed via the `trigger` snippet; the menu auto-wires `aria-expanded` / `aria-controls`.
- Keyboard nav: ArrowUp/Down between items, ArrowRight opens a submenu, ArrowLeft / Esc closes.
- Submenus cascade using `placement` + `shift` (cross-axis) — the parent menu's placement is inherited.

## Gotchas

- Menu items must be focusable for keyboard nav (the components handle this when you use `NeoMenuListItem`); custom item renderers must opt in via `tabindex` + role.
- Cascading submenus need horizontal offset from the parent — leave `flip`/`shift` middleware enabled (the default).

See also: [floating/tooltips](../tooltips/AGENTS.md), [floating](../AGENTS.md).
