# `@dvcol/neo-svelte/cursor`

```ts
import { NeoCursor, NeoCursorPointer } from '@dvcol/neo-svelte/cursor';
```

## Components

- `NeoCursor` — replaces the system cursor inside its scope with a custom rendered cursor (neumorphic dot / ring follower).
- `NeoCursorPointer` — pointer-style variant for click affordances.

## Gotchas

- Custom cursors compete with native focus rings; do not hide the OS cursor on input fields or actions where keyboard users need a focus indicator.
- Disable on touch devices (`@media (pointer: coarse)`) — there is no cursor to replace.

See also: live demo `DemoCursor`.
