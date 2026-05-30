# `@dvcol/neo-svelte/media`

```ts
import { NeoImage, NeoMedia } from '@dvcol/neo-svelte/media';
```

## Components

- `NeoImage` — neumorphic image with built-in skeleton, error fallback, lazy-loading.
- `NeoMedia` — generic media container (image / video / iframe) with the same affordances.

## Concepts

- `aspectRatio` is a first-class prop — pass `'16/9'` etc. The container reserves space before load to avoid CLS.
- Loading state is bindable (`bind:loaded`, `bind:errored`); use it to coordinate parent skeletons.

## Gotchas

- `<NeoImage>` does not proxy the `loading="eager"` default — it is `lazy` by default to align with the lazy mount story. Override explicitly if above-the-fold.

See also: [skeletons](../skeletons/AGENTS.md), [loading](../loading/AGENTS.md).
