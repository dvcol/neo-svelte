# `@dvcol/neo-svelte/icons`

```ts
import { NeoIconAccount, NeoIconArrow, NeoIconClose, NeoIconConfirm /* … */ } from '@dvcol/neo-svelte/icons';
```

## Components

A library of pre-built icon components (`NeoIcon*`). Browse the live demo (`DemoIcons`) or autocomplete on the import to discover the full set.

## Concepts

- Each icon is an inline SVG component. Color follows `currentColor`; size follows the bundled `--neo-icon-size` token (or your CSS).
- Animated icons (`NeoIconBouncingDots`, `NeoIconCircleLoading`) honor `prefers-reduced-motion`.

## Gotchas

- Icons are decorative by default. When an icon is the only content of an interactive element (e.g. icon-only button), pass `aria-label` to the parent — the icon itself does not announce.
- Tree-shaking works per icon — do **not** import via the barrel if bundle size matters.

See also: [buttons](../buttons/AGENTS.md), [loading](../loading/AGENTS.md).
