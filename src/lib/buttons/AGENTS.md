# `@dvcol/neo-svelte/buttons`

```ts
import { NeoArrowButton, NeoButton, NeoButtonGroup, NeoCancelButton, NeoCheckboxButton, NeoCloseButton, NeoRadioButton, NeoSwitchButton } from '@dvcol/neo-svelte/buttons';
```

## Components

- `NeoButton` — base button. Accepts the full neumorphic option matrix.
- `NeoButtonGroup` / `NeoButtonRow` — visually-joined group of buttons; manages spacing, dividers, and shared shadow scope.
- `NeoArrowButton` — icon-driven directional button.
- `NeoCheckboxButton`, `NeoRadioButton`, `NeoSwitchButton` — input-shaped buttons that bind a boolean (`bind:checked`) or value group; use these when you want input semantics with button styling.
- `NeoCancelButton`, `NeoCloseButton` — pre-styled affordances for dismissing dialogs / drawers / forms.

## Concepts

- **Variant matrix** — `disabled`, `loading`, `readonly`, `skeleton`, `pressed`, `rounded`, `glass`, `flat`, `text`, `borderless`, `elevation`. They compose; expect them to interact (e.g. `loading` overrides hover affordance, `skeleton` neutralises content).
- **Snippets, not text content** — pass labels via the `children` snippet. `icon` and `loader` snippets let you swap the indicator without re-implementing the button.
- **Bindable state** — `bind:ref` for the underlying element, `bind:hovered` / `bind:focused` / `bind:pressed` for parent-level affordances (e.g. tooltip triggers).

## Common pattern

```svelte
<NeoButton onclick={save} loading={saving} disabled={!dirty}>
  {#snippet icon()}<NeoIconConfirm />{/snippet}
  Save
</NeoButton>
```

## Gotchas

- For icon-only buttons pass `aria-label` — the visual icon is not announced to screen readers.
- `NeoCheckboxButton` / `NeoRadioButton` are buttons that _behave_ as inputs; inside `NeoForm` they auto-register via form context. Don't wrap them in `<label>` manually.

See also: [inputs](../inputs/AGENTS.md), [icons](../icons/AGENTS.md).
