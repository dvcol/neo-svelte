# `@dvcol/neo-svelte/progress`

```ts
import { NeoProgress, NeoProgressBar, NeoProgressMark } from '@dvcol/neo-svelte/progress';
```

## Components

- `NeoProgress` — composite progress component with optional marks.
- `NeoProgressBar` — bare bar (determinate or indeterminate).
- `NeoProgressMark` — anchored marks/checkpoints rendered atop a progress track.

## Concepts

- Determinate: pass `value` (0–`max`). Indeterminate: omit `value` (or pass `indeterminate`).
- Animated via `--neo-progress` `@property`; transitions resolve smoothly without JS interpolation.

See also: [stepper](../stepper/AGENTS.md), [loading](../loading/AGENTS.md).
