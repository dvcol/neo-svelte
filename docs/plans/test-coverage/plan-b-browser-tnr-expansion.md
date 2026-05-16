# Plan B — Browser TNR coverage expansion

> **Status: plan of record for the `worktree-test-coverage-plan-b` branch.**

## Context

Phase 2 of the floating-ui migration shipped browser tests for **NeoTooltip** and **NeoMenu** (plus the pop\* family already covered before). Other components in the library still rely on jsdom-only coverage, which cannot pin behaviors that depend on real layout, real `:focus-visible`, real pointer events, real `requestAnimationFrame`, or themed visual contracts.

This plan adds a second wave of browser tests across four buckets, prioritized by infra/regression risk:

1. Floating (Dialog / Drawer / NotificationStack)
2. Collapse / Tabs / Accordion
3. Drag-sensitive inputs (ColorPicker, Pin, FilePicker, Switch, NumberStep)
4. Visual primitives (Card, Button family, Skeleton, Image)

## Conventions to reuse

Per [`AGENTS.md`](../../../AGENTS.md):

- File layout: `demo/components/<scope>/Demo<Name>.svelte`, optionally `Test<Name>.browser.test.svelte`, and `Test<Name>.browser.test.ts`. Visual baselines live in `<scope>/__screenshots__/Test<Name>.browser.test.ts/`.
- Shared harness: `demo/components/TestHarness.svelte` discovers `Test<Name>.browser.test.svelte` via `import.meta.glob` — works for any new scope folder. The demo SPA exposes them at `#/test/<name>?prop=value`.
- Existing patterns to copy:
  - `demo/components/floating/tooltips/TestTooltip.browser.test.ts` — themed visual contract suite (model for visual primitives).
  - `demo/components/floating/menu/TestMenu.browser.test.ts` — viewport-constrained positioning + keyboard traversal (model for floating + accordion/tabs).
  - `demo/components/inputs/TestRange.browser.test.ts` — drag interaction (model for ColorPicker / Switch / NumberStep).
- Tag visual-only describes with `tags: ['browser', 'visual']`; behavior describes get `tags: ['browser']`. Filter via `pnpm vitest --project browser --tag visual`.
- Reuse helpers in `test/helpers/` rather than duplicating render/setup boilerplate.

## Quality bar (every new suite)

- **TNR**: pin observable behavior — state transitions, ARIA wiring, callback args/order, derived values. No tautologies; no defaults TS already enforces.
- **Matrix**: for every boolean/enum prop that gates behavior, cover **on**, **off**, **and at least one combination** with a related flag. `it.each` for table-driven combinations.
- **Bugs surfaced**: write expected behavior as `it.skip(...)` with `TODO:` + file:line + grep-able marker. Surface in PR description.

## Bucket 1 — Floating (Dialog / Drawer / NotificationStack)

**Why browser-only**: real `<dialog>`/`HTMLDialogElement`, focus trap traversal, slide/fade transitions via real `requestAnimationFrame`, scroll lock, portal mount points, draggable handle pointer events, stacking of multiple notifications.

| Component              | Suite                                                                          | Key cases (TNR + matrix)                                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NeoDialog`            | `demo/components/floating/dialog/TestDialog.browser.test.ts`                   | Open/close (modal vs. non-modal × backdrop on/off), focus trap on Tab/Shift-Tab, restore focus on close, draggable handle drag, escape-to-close (on/off), position variants (center/top/bottom/left/right) — visual snapshots per position. |
| `NeoDrawer`            | `demo/components/floating/dialog/TestDrawer.browser.test.ts`                   | Slide-in per side (left/right/top/bottom), close-button on/off, scrollable content, focus restore. Visual snapshot per side.                                                                                                                |
| `NeoNotificationStack` | `demo/components/floating/notifications/TestNotificationStack.browser.test.ts` | Multiple notifications stacking order, auto-dismiss timing, manual close, position (top/bottom × start/center/end). Visual snapshot of stacked state.                                                                                       |

## Bucket 2 — Collapse / Tabs / Accordion

**Why browser-only**: real animation timing (`requestAnimationFrame`), scroll-into-view sync, roving tabindex/keyboard traversal, scroll-shadow visibility on overflow.

| Component                           | Suite                                                               | Key cases                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NeoAccordion` + `NeoCollapseGroup` | `demo/components/containers/collapse/TestAccordion.browser.test.ts` | Single-vs-multi expansion, keyboard ArrowUp/Down/Home/End, focus visibility, scroll-into-view on open. Visual snapshot of expanded state.                                     |
| `NeoCollapse`                       | `demo/components/containers/collapse/TestCollapse.browser.test.ts`  | Open/close transitions complete (no half-open visual), `min`/`max` height clamping.                                                                                           |
| `NeoTabs` / `NeoTabsCard`           | `demo/components/nav/TestTabs.browser.test.ts`                      | Tab key focus order through tablist, ArrowLeft/Right roving tabindex, scroll-shadow visibility on overflow, active tab indicator transition. Visual snapshot per orientation. |

## Bucket 3 — Drag-sensitive inputs

**Why browser-only**: pointer-cross drag, multi-input focus traversal, drop-zone events, real keyboard repeat.

| Component        | Suite                                                    | Key cases                                                                                                     |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NeoColorPicker` | `demo/components/inputs/TestColorPicker.browser.test.ts` | Drag the SV slider + hue slider, value sync, keyboard arrow steps, format toggling (hex/rgb/hsl).             |
| `NeoPin`         | `demo/components/inputs/TestPin.browser.test.ts`         | Type into one cell auto-advances focus; backspace retreats focus; paste fills all cells; arrow keys traverse. |
| `NeoFilePicker`  | `demo/components/inputs/TestFilePicker.browser.test.ts`  | Drag-enter highlights drop zone; drop adds file(s); single vs. multiple; rejection of disallowed types.       |
| `NeoSwitch`      | `demo/components/inputs/TestSwitch.browser.test.ts`      | Click to toggle, keyboard space, drag handle past midpoint snaps on/off, disabled state.                      |
| `NeoNumberStep`  | `demo/components/inputs/TestNumberStep.browser.test.ts`  | Increment/decrement buttons, hold-to-repeat behavior, min/max clamping, step granularity.                     |

## Bucket 4 — Visual primitives

**Why browser-only**: themed visual contracts (elevation, glass, shadow, glow) cannot be pinned in jsdom without real layout + computed styles.

| Component                                                                                                    | Suite                                                                                | Key cases                                                                                                              |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `NeoCard`                                                                                                    | `demo/components/cards/TestCard.browser.test.ts`                                     | Visual snapshots across elevation × glass × shadow × rounded matrix. Hover-elevation transition.                       |
| `NeoButton` family (`NeoButton`, `NeoCloseButton`, `NeoArrowButton`, `NeoCheckboxButton`, `NeoSwitchButton`) | `demo/components/buttons/TestButton.browser.test.ts` (one suite, multiple describes) | Visual snapshots per variant × state (default/hover/focus-visible/active/disabled). Focus ring rendering.              |
| `NeoSkeletonContainer`                                                                                       | `demo/components/skeletons/TestSkeleton.browser.test.ts`                             | Shimmer animation present, layout preserved on swap to real content. Visual snapshot of shimmer + post-swap.           |
| `NeoImage`                                                                                                   | `demo/components/media/TestImage.browser.test.ts`                                    | Load-state transitions (placeholder → loaded → error), intersection-observer lazy load. Visual snapshot of each state. |

## Execution order

Bucket 1 → 2 → 3 → 4 (highest infra/regression risk first; visual primitives last because their failure mode is cosmetic, not functional).

Suggested commit/PR granularity: one commit per bucket on the `worktree-test-coverage-plan-b` branch. Visual baselines committed alongside the suite that produced them.

## Critical files

- New tests under `demo/components/<scope>/Test<Name>.browser.test.ts` (and harness `Test<Name>.browser.test.svelte` only when needed).
- New visual baselines under `demo/components/<scope>/__screenshots__/Test<Name>.browser.test.ts/`.
- `vite.config.ts` — verify project globs already pick these up (they should — convention is enforced by `*.browser.test.ts` suffix).
- `test/helpers/render.js` (and any sibling helpers) — extend if shared setup is needed; do not duplicate.
- No changes to `src/lib/**` for Plan B (any bug surfaced becomes an `it.skip` with a TODO and is fixed in a follow-up — keeping Plan B purely additive).

## Verification

- `pnpm test:browser` — full browser suite green.
- `pnpm vitest --project browser --tag visual` — visual contract suite green; review committed PNGs in PR.
- `pnpm test:unit` — jsdom suite still green (no regressions from harness/helper changes).
- For each new suite, also drive the demo SPA: `pnpm dev` → `/#/test/<name>?<props>` and confirm the harness page renders and behaves as the test asserts.
- Auto-failure attachments land in `.vitest-attachments/` (gitignored) — never under `__screenshots__/`. Confirm `.gitignore` covers this before first run.

## Out of scope

- Fixing any bug surfaced during Plan B — record as `it.skip` with TODO and triage in [`plan-a-skipped-test-triage.md`](./plan-a-skipped-test-triage.md).
- Adding new components from [`ROADMAP.md`](../../../ROADMAP.md) (split, persistent drawer, virtualized chat, etc.).
- Refactoring `src/lib/**` for testability — only add tests.
