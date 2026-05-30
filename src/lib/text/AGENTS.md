# `@dvcol/neo-svelte/text`

```ts
import { NeoEllipsis, NeoHtml, NeoMark, NeoScrollShadow, NeoTypewriter } from '@dvcol/neo-svelte/text';
```

## Components

- `NeoEllipsis` — multi-line ellipsis with optional tooltip-on-truncation.
- `NeoHtml` — render trusted-then-sanitized HTML (uses `dompurify` under the hood).
- `NeoMark` — `<mark>`-style highlight with palette tokens.
- `NeoTypewriter` — reveal text character-by-character; honors `prefers-reduced-motion`.
- `NeoScrollShadow` — gradient masks at the scroll edges of an overflowing region.

## Concepts

- `NeoHtml` sanitizes input by default. Override the sanitizer config only if you control the source.
- `NeoEllipsis` measures text on resize; for virtualized lists prefer CSS `text-overflow: ellipsis` to avoid layout thrash.

## Gotchas

- Never feed user-generated HTML into `NeoHtml` without confirming the sanitizer config is appropriate; defaults are safe but extensions can loosen them.

See also: [media](../media/AGENTS.md), [list](../list/AGENTS.md).
