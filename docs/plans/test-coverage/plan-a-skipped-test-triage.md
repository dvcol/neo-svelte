# Plan A — Skipped-test triage & fixes

> **Status: on hold.** Documentation only. Not executed in the current branch.

## Context

Building out coverage for the floating-ui migration left **8 skipped tests** behind across jsdom and browser suites. Most are pinned with `it.skip` + `TODO:` markers per `AGENTS.md` convention (real bugs that we did not want to silently absorb into the contract suite). One is a jsdom limitation that the browser suite already covers.

Two complications make blind-fixing risky:

1. The recent `554af81 feat(floating): drop skeleton and move to custom floating-ui wrapper` removed skeleton entirely and replaced it with our own `popover.svelte.ts` wrapper. Several `TODO:` comments explicitly say _"Phase 2 migration to @floating-ui/dom will fix this"_ — that migration has happened. Some bugs may already be fixed; others may still be present; others may need a different fix than the original TODO suggested.
2. `NeoMenu.svelte:53,67` still maintains the old parallel `tooltipOpen = $state(false)` pattern. The menu has not been re-wired through the new wrapper, so menu-side bugs are likely all still present.

The goal: re-verify each skip against current code, then either unskip (already fixed), fix (still broken), or re-classify (harness vs. bug).

## Inventory & per-item plan

### NeoTooltip — `src/lib/floating/tooltips/NeoTooltip.svelte`

`onOpenChange` (~lines 138-142) currently reads:

```text
if (_reason === 'click' && _open && keepOpenOnClick) return;
if (_reason !== 'click') open = _open;
```

This still drops every `_reason === 'click'` update except the `keepOpenOnClick` short-circuit — confirming the bug pinned in `src/lib/floating/tooltips/NeoTooltip.test.ts:270`, `:284`, and `demo/components/floating/tooltips/TestTooltip.browser.test.ts:183` is **still present** post-migration.

| File:Line                                                                           | Status                                      | Action                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/floating/tooltips/NeoTooltip.test.ts:234` — `openOnFocus` jsdom skip       | Harness-only (no `:focus-visible` in jsdom) | Keep skipped; verify the browser-suite counterpart at `demo/components/floating/tooltips/TestTooltip.browser.test.ts:152` covers the positive path. Add a one-line comment cross-referencing the browser test so future readers don't try to "fix" it in jsdom. |
| `src/lib/floating/tooltips/NeoTooltip.test.ts:270` & `:284` — `openOnClick` on/off  | Real bug, still present                     | Rewrite the `click` branch to `open = _open` when `openOnClick` is enabled. Keep the `keepOpenOnClick` early-return for the _closing_ edge only. Unskip both jsdom tests and the browser counterpart.                                                           |
| `demo/components/floating/tooltips/TestTooltip.browser.test.ts:183` — pointer click | Same bug                                    | Unskip after the fix above.                                                                                                                                                                                                                                     |

Critical files for the tooltip fix:

- `src/lib/floating/tooltips/NeoTooltip.svelte` (~lines 138-142, the `onOpenChange` body)
- Existing tests above — unskip in the same commit.

### NeoMenu — `src/lib/floating/menu/NeoMenu.svelte`

The component has not been re-wired to the new popover wrapper. All four pinned bugs are likely still present. Verify by running the skipped tests first, then plan fix.

| File:Line                                                                                                         | Bug                                                                                                                                                     | Action                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `demo/components/floating/menu/TestMenu.browser.test.ts:65` — `open=true` ignored on mount                        | Parallel `tooltipOpen` state at `NeoMenu.svelte:53,67` overwrites inbound `open` prop on first effect tick                                              | Seed `tooltipOpen` from `open` on mount, or collapse the parallel state by reading/writing `open` directly via getter/setter. The new wrapper's `open` is a single bindable getter — adopt the same pattern. |
| `demo/components/floating/menu/TestMenu.browser.test.ts:129` — Tab focus doesn't enter menu on `bottom` placement | `NeoMenu.svelte:73` early-returns when `e.shiftKey !== position?.includes('top')` — for plain Tab + bottom placement this is `false !== false → return` | Replace the placement-coupled early-return with a simpler "if open and not shift-tab, redirect into menu; if shift-tab, exit menu". Unskip after fix.                                                        |
| `demo/components/floating/menu/TestMenu.browser.test.ts:337` — submenu overlaps parent at viewport edge           | Submenu chain doesn't pass `shift({ padding })` middleware                                                                                              | Add `shift({ padding })` to nested-menu middleware. The new `popover.svelte.ts` wrapper makes middleware composition explicit — extend the menu's wiring to include shift on the cross-axis.                 |
| `demo/components/floating/menu/TestMenu.browser.test.ts:367` — cascading submenus overflow at mobile size         | `flip()` middleware not configured for cross-axis cascade                                                                                               | Add `flip({ crossAxis: true })` (or `shift()`) to the cascading-submenu middleware. Verify by running the test at iPhone-SE viewport (390px).                                                                |

Critical files for the menu fixes:

- `src/lib/floating/menu/NeoMenu.svelte` (lines 53-77 — parallel state + Tab handler)
- `src/lib/floating/menu/NeoMenuList.svelte` (submenu wiring — verify middleware composition)
- `src/lib/floating/common/popover/popover.svelte.ts` (reuse the wrapper rather than re-introducing skeleton-style binding)

### NeoDialogStepper / NeoDrawerStepper

| File:Line                                                                                           | Bug                                                                                                                                                                                          | Action                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/floating/dialog/NeoDialogStepper.test.ts:95` — multi-step confirm crashes Svelte 5 runtime | Teardown race: `unmountOnClose` flips `open=false` while outgoing transition + in-flight `goTo` resolve, reading `$derived` from a destroyed effect. Error: `get_fn(...) is not a function`. | Re-run the test to confirm the crash still reproduces post-skeleton-drop. If it does: defer `unmountOnClose` until transitions complete (or guard the derived read). Likely fix in `NeoDialogStepper.svelte` / shared stepper unmount path — investigate the `goTo` flow before settling on the fix shape. |
| `src/lib/floating/drawer/NeoDrawerStepper.test.ts:96` — same                                        | Same root cause via `NeoFloatingStepper`/`NeoStepper` teardown race                                                                                                                          | Same fix; both stepper variants should unskip together.                                                                                                                                                                                                                                                    |

Critical files:

- `src/lib/floating/dialog/NeoDialogStepper.svelte`
- `src/lib/floating/drawer/NeoDrawerStepper.svelte`
- `src/lib/floating/common/NeoFloatingStepper.svelte` (likely shared teardown path)
- `src/lib/inputs/stepper/NeoStepper.svelte` (the underlying stepper — `goTo` resolution)

## Execution order

1. Re-run each skipped test individually with `pnpm vitest --run --project unit -t "<title>"` / `--project browser -t "<title>"` and confirm the bug still reproduces (or note already-fixed).
2. Group fixes: tooltip click bug → menu parallel-state + Tab → menu submenu middleware → stepper teardown. Each group becomes its own commit.
3. Unskip the corresponding test as part of the same commit as its fix; remove the inline `TODO:` comment.
4. Run the full suite: `pnpm test` (both projects). Verify no regressions in adjacent tests.

## Verification

- `pnpm test:unit` — jsdom suite green, all unskips pass.
- `pnpm test:browser` — browser suite green, all unskips pass.
- For the stepper teardown fix, also exercise the demo SPA: `pnpm dev` → `/#/test/dialog-stepper?steps=3` and click through last-step Confirm; no console errors.
- For the menu submenu middleware fix, resize the browser to ~390px and exercise nested-menu cascade at viewport edge — confirm no overlap, no overflow.
