# `@dvcol/neo-svelte/floating/dialog`

```ts
import { NeoDialog, NeoDialogConfirm, NeoDialogStepper } from '@dvcol/neo-svelte/floating/dialog';
```

## Components

- `NeoDialog` — modal/non-modal dialog backed by the native `<dialog>` element.
- `NeoDialogConfirm` — pre-composed confirm dialog (`NeoDialog` + `NeoConfirm`).
- `NeoDialogStepper` — pre-composed multi-step wizard dialog.

## Concepts

- `bind:open` is the single source of truth.
- `modal` toggles between `dialog.showModal()` (true: backdrop + focus trap + body inert) and `dialog.show()` (false: non-modal).
- `closable` wires the close affordance (escape, backdrop click, close button); turn it off when the dialog is dismissed only via an explicit action.

## Common pattern

```svelte
<script lang="ts">
  import { NeoDialog } from '@dvcol/neo-svelte/floating/dialog';

  let open = $state(false);
</script>

<button onclick={() => open = true}>Open</button>
<NeoDialog bind:open modal closable>
  Content
</NeoDialog>
```

## Gotchas

- Native `<dialog>` form-association: a `<form method="dialog">` inside auto-closes on submit. Use this pattern for confirm flows.
- Focus returns to the previously focused element on close; if your trigger unmounts, manage focus yourself.

See also: [floating](../AGENTS.md), [floating/drawer](../drawer/AGENTS.md).
