# `@dvcol/neo-svelte/floating`

Cross-cutting primitives for everything that floats. The nested scopes (`dialog`, `drawer`, `menu`, `notification`, `portal`, `tooltips`) build on the same configuration vocabulary.

```ts
import { NeoConfirm, NeoFloatingStepper, NeoHandle } from '@dvcol/neo-svelte/floating';
```

## Components

- `NeoConfirm` — generic confirm body usable inside any floating surface (dialog, drawer, popover).
- `NeoFloatingStepper` — multi-step body for wizards inside dialogs / drawers / popovers.
- `NeoHandle` — drag handle for movable floating surfaces.

## Common configuration vocabulary

Every floating component exposes some subset of these props (see the nested scope guide for which apply):

- **`placement`** — `'top' | 'bottom' | 'left' | 'right'` (+ `-start` / `-end`). Drives `@floating-ui/dom` positioning.
- **Open triggers** — `openOnHover`, `openOnFocus`, `openOnClick`. Composable; e.g. `NeoTooltip` defaults to hover+focus, `NeoMenu` to click.
- **Hover bridges** — `keepOpenOnHover`, `keepOpenOnFocus` keep the surface open while the pointer/focus crosses from the trigger into the floating element.
- **Middleware** — `flip`, `shift`, `size`, `autoPlacement` exposed as boolean-or-options props.
- **`modal`** — for dialogs/drawers; renders inside the native `<dialog>` modal stack, traps focus, blocks background interaction.
- **`closable`** — adds the close affordance and wires the close action.
- **`bind:open`** — every floating surface is bindable; the consumer is the source of truth.

## Gotchas

- A `NeoThemeProvider` ancestor is mandatory; floating surfaces portal out of the trigger but read tokens off `[neo-theme-root]`.
- The portal target is the body by default; if you mount in a shadow root or scoped subtree, set the theme provider's `target` accordingly so portaled overlays still inherit tokens.
- `flip` and `autoPlacement` are alternatives — enable one, not both, or you'll fight your own placement strategy.

See also: [floating/dialog](./dialog/AGENTS.md), [floating/drawer](./drawer/AGENTS.md), [floating/menu](./menu/AGENTS.md), [floating/notification](./notification/AGENTS.md), [floating/portal](./portal/AGENTS.md), [floating/tooltips](./tooltips/AGENTS.md).
