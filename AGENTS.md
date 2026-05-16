# Contributing & Testing

This file is for contributors and AI agents working in this repo. End-user docs live in [README.md](./README.md). The component roadmap lives in [ROADMAP.md](./ROADMAP.md).

## External context for AI agents

- Svelte / SvelteKit LLM-friendly documentation index: [https://svelte.dev/llms.txt](https://svelte.dev/llms.txt). Fetch this when you need authoritative, up-to-date Svelte 5 / runes / SvelteKit reference material before answering or editing.

The conventions below are enforced by tooling:

- Import boundary (`src/lib` → `demo/**` is forbidden) — see [`eslint.config.js`](./eslint.config.js).
- Test environments, project globs and tag filters (`unit` / `browser`, `jsdom` / `browser` / `visual`) — see [`vite.config.ts`](./vite.config.ts).

## Testing

Tests live in two distinct environments. The split is enforced by file location, file suffix, Vitest project globs, and per-suite [test tags](https://vitest.dev/guide/test-tags). Contributors MUST follow all four conventions; CI rejects PRs that mix them.

### Two environments, two suffixes

| Environment | Suffix              | Project   | Suite tag   | Where it lives                      |
|-------------|---------------------|-----------|-------------|-------------------------------------|
| jsdom       | `*.test.{ts,svelte}` | `unit`    | `'jsdom'`   | `src/lib/**` (co-located with code) |
| Real browser | `*.browser.test.ts` | `browser` | `'browser'` | `demo/**` (co-located with the demo page exercising the component) |

- **jsdom / unit** is the default. Use it for behavior, ARIA wiring, callback args, derived values, prop matrices — anything that does not need real layout, real pointer/drag, real scroll, real `requestAnimationFrame`, or real focus traversal.
- **browser** is reserved for tests that genuinely need a real browser engine (positioning under `@floating-ui/dom`, pointer-cross hover bridges, visual screenshot contracts).

### Per-suite tags (mandatory)

Every top-level `describe` MUST carry the matching tag. The vite project glob already routes the file, but the tag makes intent explicit at the suite level and enables `vitest --tag jsdom` / `--tag browser` filtering anywhere in the tree.

```ts
// src/lib/buttons/NeoButton.test.ts
import { describe, expect, it } from 'vitest';

describe('NeoButton', { tags: ['jsdom'] }, () => {
  it('renders the label', () => { /* … */ });
});
```

```ts
// demo/components/floating/tooltips/TestTooltip.browser.test.ts
import { describe, expect, it } from 'vitest';

describe('NeoTooltip — pointer-cross hover bridge', { tags: ['browser'] }, () => {
  it('keeps the tooltip open when the pointer crosses from trigger into floating', async () => { /* … */ });
});
```

### Folder layout & naming

`src/lib/**` is the published library. It contains source code and **only** jsdom unit tests next to the files they exercise.

| File                  | When to write it                                                                                                |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| `<Name>.test.ts`      | **Always.** The unit/contract test.                                                                              |
| `<Name>.test.svelte`  | **Only when the test genuinely needs a wrapper** — `$effect`, `$derived`, callback refs, multi-branch templates, theme/portal/router context that the test cannot assert via `render(<Name>, …)` directly. Mirrors the paired `.test.ts` name (`NeoTooltip.test.ts` ↔ `NeoTooltip.test.svelte`). When a harness is just `<Name {...rest} bind:foo />`, render the component directly instead. |

`demo/components/**` is the showcase + browser-test surface and **mirrors `src/lib/**` scope folders** (e.g. a tooltip lives at `src/lib/floating/tooltips/NeoTooltip.svelte` and its showcase + browser test live at `demo/components/floating/tooltips/`). No `visual/` subfolder; visual vs. behavior is a tag, not a directory. For every component that needs a browser test, three files co-exist in the same scope folder:

| File                             | When to write it                                                                                                |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `Demo<Name>.svelte`              | Public-facing showcase rendered by the demo SPA. Exhaustive props, themed, visible to humans.                   |
| `Test<Name>.browser.test.svelte` | **Optional** — only when the browser test needs setup the component cannot provide alone (theme provider, child snippets, callback refs). When all the test does is render with props, render the component directly from the `.ts`. |
| `Test<Name>.browser.test.ts`     | The browser test. Runs in `@vitest/browser-playwright`.                                                          |

Behavior vs. visual is a `tags` distinction. Tag a screenshot describe with `tags: ['browser', 'visual']` and filter via `pnpm vitest --project browser --tag visual`.

The demo SPA exposes a generic `#/test/<name>?prop=value` URL backed by `demo/components/TestHarness.svelte`. A recursive `import.meta.glob` discovers `Test<Name>.browser.test.svelte` anywhere under `demo/components/**`, so contributors can debug the same harness the browser test uses regardless of the scope folder it lives in.

Visual-contract baselines (committed PNGs) live alongside their test under `<scope>/__screenshots__/Test<Name>.browser.test.ts/` (e.g. `demo/components/floating/tooltips/__screenshots__/TestTooltip.browser.test.ts/`). Auto-failure attachments are sent to `.vitest-attachments/` (gitignored) — never to the `__screenshots__/` baseline directory.

### Path aliases

Deep relative imports are forbidden in test code. Use these aliases instead:

| Alias    | Resolves to | Use for                                           |
|----------|-------------|---------------------------------------------------|
| `~/`     | `src/lib/`  | Importing library components from demo or tests.  |
| `src/`   | `src/`      | Importing non-library `src/**` modules.           |
| `test/`  | `test/`     | Importing shared test helpers (e.g. `test/helpers/render.js`). |
| `demo/`  | `demo/`     | Importing demo utilities/router from a demo subfolder. |

### Import boundary (one-way)

- `demo/**` MAY import from `src/lib/**`. Test harnesses are expected to reach into library internals when they need to.
- `src/lib/**` MUST NOT import from `demo/**`. The library is what we publish; it cannot depend on demo or test infrastructure. ESLint enforces this rule.

### Running tests

```sh
pnpm test             # both projects
pnpm test:unit        # jsdom only (`unit` project)
pnpm test:browser     # real browser (`browser` project)

# Tag filters work across projects:
pnpm vitest --run --project unit    --tag jsdom
pnpm vitest --run --project browser --tag browser
```

### Quality bar — three non-negotiable rules

These three rules apply to every `*.test.ts` / `*.browser.test.ts` in the repo, in any phase, library-wide.

1. **Qualitative, exhaustive, relevant (TNR) coverage.** Tests must pin observable behavior — state transitions, ARIA wiring, callback args/order, derived values, transforms, edge inputs. No tautologies (`expect(Enum.Foo).toBe('foo')`, asserting defaults TS already enforces, asserting an object literal equals itself). When extending an existing file, prune cases that fail this bar.
2. **Exhaustive option matrix — on, off, AND combinations.** For every boolean/enum prop that gates behavior (`openOn{Hover,Focus,Click}`, `modal`, `closable`, `multiple`, `clearable`, `disabled`, `readonly`, `keepOpen*`, `placement`, etc.) cover the on path, the off path, and at least one composition with another related flag. Use `it.each` for table-driven cases. Only enumerate combinations where flags genuinely interact.
3. **Known bugs → `it.skip` with a TODO + expected behavior.** When implementation behavior is illogical or broken, do NOT pin the broken state. Instead write the **expected** behavior as `it.skip(...)` with an inline comment containing the bug summary, file:line reference, and a grep-able `TODO:` marker. The skipped test is the contract for the fix; unskipping it = the bug is resolved. Surface the bug in the PR description so it gets triaged.
