# `@dvcol/neo-svelte/stepper`

```ts
import { NeoStepper } from '@dvcol/neo-svelte/stepper';
```

## Components

- `NeoStepper` — multi-step progress indicator with optional click-to-jump behavior.

## Concepts

- `bind:active` (id or index of the current step). `steps` is an array of `{ id, label?, disabled?, ... }`.
- `clickable` enables jumping to previously-completed steps.
- Compose with `NeoFloatingStepper` (in `floating`) when you want the same model inside a dialog/drawer/popover.

See also: [floating/dialog](../floating/dialog/AGENTS.md), [progress](../progress/AGENTS.md).
