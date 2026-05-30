# `@dvcol/neo-svelte/floating/tooltips`

```ts
import { NeoPopConfirm, NeoPopSelect, NeoPopStepper, NeoTooltip } from '@dvcol/neo-svelte/floating/tooltips';
```

## Components

- `NeoTooltip` — popover surface for hints, inline forms, popconfirms.
- `NeoPopConfirm` — pre-composed confirm popover (`NeoTooltip` + `NeoConfirm`).
- `NeoPopSelect` — popover-mounted select.
- `NeoPopStepper` — popover-mounted multi-step wizard.

## Concepts

- Defaults: `openOnHover` + `openOnFocus`. Add `openOnClick` for click-to-toggle behavior.
- **Pointer-cross hover bridge** — `keepOpenOnHover` keeps the tooltip open while the pointer crosses the gap from the trigger into the floating surface. This is the only way to make a hover-tooltip clickable without flicker.
- Trigger goes in the `trigger` snippet; tooltip body in `children`.

## Common pattern

```svelte
<NeoTooltip placement="top" openOnHover openOnFocus keepOpenOnHover>
  {#snippet trigger()}<NeoButton>Hover me</NeoButton>{/snippet}
  Tooltip body
</NeoTooltip>
```

## Gotchas

- For interactive tooltip content, set `keepOpenOnHover` AND `keepOpenOnFocus` — otherwise focus moving inside the tooltip closes it.
- `flip` and `autoPlacement` are alternatives — pick one. Combine `flip` + `shift` for the most predictable behavior in tight viewports.

See also: [floating/menu](../menu/AGENTS.md), [floating](../AGENTS.md).
