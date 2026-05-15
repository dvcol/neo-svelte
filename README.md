<h1 align="center">Welcome to <i>Neo Svelte</i></h1>
<h3 align="center">A neo-morphic ui library for svelte 5</h3>

<p>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D8.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://github.com/dvcol/neo-svelte#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/dvcol/neo-svelte/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/dvcol/neo-svelte/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/dvcol/neo-svelte" />
  </a>
 <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
  </a>
</p>

## Description

Neo Svelte is a modern UI library for Svelte 5, designed to bring a sleek, soft, and futuristic look to web applications with neumorphism and glassmorphism design elements.

It provides a collection of pre-styled, accessible, and highly customizable components that make it easy to build visually appealing UIs with minimal effort.

## Prerequisites

Note: Svelte Simple Router is a svelte 5 native library, and will not work with prior versions of svelte.

- svelte >= 5.0.0

## Install

```sh
pnpm add @dvcol/neo-svelte
```

## Getting Started

Wrap any component inside the style provider

```svelte
<script lang="ts">
  import { NeoThemeProvider } from '@dvcol/neo-svelte';
</script>

<NeoThemeProvider>
  ...
</NeoThemeProvider>
```

Then import any of the components you want to use.

See examples in the demo (code [here](https://github.com/dvcol/neo-svelte/tree/fed1b3f42e863e18968c77256527a837957b3304/demo/components), live demo [here](https://dvcol.github.io/neo-svelte/#/inputs)).

## TODO

- [ ] @media any-pointer:coarse any-hover:none
- [ ] move to inline/bloc to support writing-mode
- [x] Buttons
  - [x] toggle
  - [x] groups
  - [ ] floating (speed dial)
  - [ ] split
- [x] tags/pills
  - [x] badge
- [x] Tabs
- [x] Card
- [x] Inputs
  - [x] Password
  - [x] Pin
  - [x] Color picker
  - [x] checkbox
  - [x] radio
- [x] Text Area
  - [ ] @ / # tags
- [x] file picker
  - [x] drag & drop
  - [x] multiple
- [x] numbers
  - [x] digits
  - [ ] phone
  - [ ] credit card
  - [x] pin
- [x] time/date/week
  - [ ] range
- [x] switch
- [x] slider
  - [x] range
  - [x] inset
  - [x] custom before-after
  - [x] steps
  - [x] ticks
  - [ ] vertical
  - [ ] circular
  - [ ] rating (stars)
- [x] select
  - [x] native
  - [x] custom
- [x] form

  - [x] validation
  - [x] fieldset

- [x] list

  - [x] select
    - [x] multiple
    - [x] disabled
    - [x] readonly
    - [x] sections
    - [x] keyboard navigation
  - [x] scroll shadow
  - [x] virtualized
  - [x] infinite scroll
  - [ ] pagination
  - [ ] drag & drop
  - [ ] timeline
  - [ ] pull/scroll to refresh
  - [x] filter
  - [x] sort
  - [ ] tree

- [x] progress

  - [x] vertical
  - [ ] circular
  - [ ] meter (progress group)
  - [x] ticks
  - [x] min/max
  - [x] indeterminate
  - [x] color/background
  - [x] duration/timeout
  - [x] start/stop/cancel/finish/reset

- [x] collapse

  - [x] description
  - [x] vertical
  - [x] accordion
  - [x] controlled (min, max, toggle)

- [x] stepper

  - [x] vertical
  - [ ] collapse
  - [x] progress/dots
  - [x] controls (cancel, next, prev, finish)
  - [x] touch swipe

- [x] tooltip

  - [x] popconfirm
  - [x] popselect
  - [x] popstepper

- [x] Modal/dialog

  - [x] HTML Dialog
    - [x] animation (slide/fade)
    - [x] stepper
    - [x] confirm
    - [x] backdrop
    - [x] position (center, top, bottom, left, right)
    - [x] custom tag (not dialog)
    - [x] draggable
  - [ ] HTML Popover
  - [x] Drawer
    - [x] size (width, height)
    - [x] scrollable
    - [x] close button
    - [ ] persistant

- [ ] Command Palette

  - [ ] list
  - [ ] header
  - [ ] footer
  - [ ] panel
  - [ ] shortcuts
  - [ ] expanded buttons

- [x] menu

  - [x] nested menus
  - [ ] collapsable (expand below)
  - [ ] menu pane (multi column, expand right/left)
  - [ ] menu list
  - [x] Dropdown
  - [x] Sections
  - [x] Dividers

- [ ] Chat
  - [ ] infinite scroll
  - [ ] virtual scroll
  - [ ] async
  - [ ] stream
  - [ ] generative text animation
  - [ ] scroll to bottom
  - [ ] typing indicator
  - [ ] read indicator
  - [ ] reactions
  - [ ] threads
  - [ ] @ / # tags
  - [ ] mentions
  - [ ] attachments
  - [ ] gifs/images
  - [ ] videos
  - [ ] audio
  - [ ] custom cards (contact, etc.)
  - [ ] custom bubbles
  - [ ] custom input
- [ ] table
- [ ] pagination

- [ ] auto-complete

  - [ ] @ / # tags
  - [ ] select
  - [ ] multiple
  - [ ] auto-complete
    - [ ] @ / # tags

- [ ] image
  - [ ] videos
  - [ ] carousel
  - [ ] parallax
- [ ] avatar

  - [x] badge

- [x] PointerTracker (Pointer Events)

  - [x] track cursor
  - [x] grow to tabindex targets
  - [x] twist, tilt & pressure support (for supported pencils)

- [ ] loader
  - [ ] spinner
  - [X] matrix
  - [ ] pull to refresh (top, bottom, left, right)
  - [x] skeleton
  - [x] lazy load
  - [X] suspense

- [ ] text
  - [ ] elevation
  - [ ] code block (shiki ?)
  - [x] ellipsis
  - [x] mark
  - [x] scroll & shadow
  - [x] typing animation
    - [x] fake cursor
    - [x] fake typos
    - [x] random pauses

- [x] Alerts
  - [x] toast
  - [x] rich notification
- [ ] container
  - [x] transition
  - [ ] split/resizable
  - [ ] flex
  - [ ] grid
  - [ ] masonry ?

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

## Author

- Github: [@dvcol](https://github.com/dvcol)

## Show your support

Give a ⭐️ if this project helped you!

 <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
</a>

## 📝 License

This project is [MIT](https://github.com/dvcol/neo-svelte/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
