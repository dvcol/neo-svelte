# Phase 3: Splinter failed migration; re-port skeleton 1-1 in Svelte 5; widen Menu/Range coverage

> Sibling docs: [`phase-1.md`](./phase-1.md) (test infrastructure + TNR), [`phase-2.md`](./phase-2.md) (first migration attempt).
> This file supersedes the migration approach taken in phase 2 commits `f1ae6b3d` + `af8097b7`.

## Context

The `@skeletonlabs/floating-ui-svelte` → `@floating-ui/dom` migration on `dev` (commits `f1ae6b3d` + `af8097b7`) regressed two pointer behaviors:

1. **Hover bridge across trigger→content** — fixed in `af8097b7` via a shared `closeTimers` WeakMap and a new `hoverableFloating` primitive, but the fix is **patch-level** rather than a structural mirror of skeleton's interaction model.
2. **Nested submenu positioning** — `af8097b7` widened the hover surface to the `<li>` wrapper, but the user reports the leaf submenu **still** opens off-axis (not on the side of its trigger) and a perceptible delay was introduced that wasn't there pre-migration. The placement bug is independent of the hover surface fix and likely traces to how reference/floating elements bind during nested mount.

Three concurrent decisions converge:

- The migration code keeps the right idea (custom thin wrapper over `@floating-ui/dom`) but skipped a faithful port of skeleton's interaction model. Notable structural deviations: skeleton's `useInteractions()` produces a `getReferenceProps/getFloatingProps` event-prop map composed across hooks; the current code attaches handlers via direct `addEventListener` from `AttachFn` factories. That divergence is the root of the regressions because the event-binding ordering, capture/bubble semantics, and synthetic-prop merging differ.
- Svelte 5 ships first-class **attachments** (`{@attach …}`), **runes** (`$state`, `$derived`, `$effect`), and **async** primitives. The skeleton library shipped before all three were stable; a 1-1 port lets us replace its older Svelte idioms with modern equivalents while keeping the algorithm identical.
- The pre-migration test suite tested only `Tooltip` deeply. `Menu` (nested >2 levels, big-screen no-overlap vs small-screen forced overlap), `Range` (thumb hover/drag), and other consumers are under-covered, so regressions were invisible until manual smoke-testing.

The intended outcome:

- Current `dev` (with broken migration) is preserved on a side branch (`floating-migration-attempt-1`) for reference / cherry-picking. `dev` resets to `main` (`8d94f02`) — clean slate with both `@floating-ui/dom` and `@skeletonlabs/floating-ui-svelte` deps still present.
- A **new** internal package (`src/lib/floating/common/floating/`) is implemented as a faithful port of skeleton's `useFloating / useHover / useFocus / useClick / useDismiss / useRole / useInteractions / useId / FloatingArrow` modules, but rewritten in idiomatic Svelte 5 — runes, attachments, no JSX-style bind shims. Algorithm parity is the contract; surface signatures may evolve to feel native.
- Consumers (`NeoTooltip`, `NeoMenuListItem`, `NeoRange`, `NeoPopSelect`, etc.) migrate to the new internal package via a one-shot rename (skeleton import → internal import). No behavior change beyond what skeleton would have given.
- **Before** the migration commits land, an expanded browser test suite codifies the gaps the previous attempt missed: deeply nested menu placement at multiple viewport sizes, Range thumb behavior, hover-bridge contract for every consumer.
- `@skeletonlabs/floating-ui-svelte` dependency is removed only after all consumers point to the internal port and tests pass.
- Native CSS anchor positioning is **explicitly out of scope** (Safari 14+ floor doesn't support it; not worth the dual-path complexity).

This work happens directly on `dev` after the reset.

## Critical files

**Created:**

- `vendor-ref/floating-ui-svelte/` — local **read-only** clone of `https://github.com/skeletonlabs/floating-ui-svelte` as a sibling reference (gitignored). Used as the source-of-truth for behavior parity during the rewrite. Never imported, never bundled.
- `src/lib/floating/common/floating/` — new internal package. One file per skeleton module, Svelte-5 idiomatic. Expected entries:
  - `use-floating.svelte.ts` — `useFloating()` reactive state factory (placement, x/y, strategy, middlewareData, elements, autoUpdate lifecycle).
  - `use-hover.svelte.ts` — `useHover()` with `restMs`, `delay`, `move`, `mouseOnly`, `handleClose` parity. Returns event-prop maps (reference + floating).
  - `use-focus.svelte.ts` — `useFocus()` with relatedTarget boundary checks.
  - `use-click.svelte.ts` — `useClick()` with `event: 'click' | 'mousedown'`, `toggle`, `ignoreMouse`, `keyboardHandlers`.
  - `use-dismiss.svelte.ts` — `useDismiss()` with `escapeKey`, `referencePress`, `outsidePress`, `outsidePressEvent`, `ancestorScroll`, `bubbles`.
  - `use-role.svelte.ts` — `useRole()` for tooltip/dialog/menu/listbox/grid/tree ARIA wiring.
  - `use-interactions.svelte.ts` — `useInteractions(hooks[])` composer producing `getReferenceProps()` / `getFloatingProps()` / `getItemProps()` merged event-prop maps. **This is the structural fix** for the regression.
  - `use-id.svelte.ts` — stable id helper.
  - `floating-arrow.svelte` — port of skeleton's FloatingArrow component.
  - `attachments.ts` — Svelte-5 `{@attach}` adapters that wrap each hook into a single-line consumer ergonomics, modeled after https://www.skeleton.dev/docs/svelte/guides/cookbook/floating-ui-attachments.
  - `index.ts` — barrel re-export.
  - `floating.types.ts` — `FloatingContext`, `OpenChangeReason`, hook option types (mirroring skeleton's exported types verbatim).

**Modified:**

- `src/lib/floating/tooltips/NeoTooltip.svelte` — replace `@skeletonlabs/floating-ui-svelte` imports with `~/floating/common/floating/`. Use the new attachment adapter `{@attach floating(state)}` / `{@attach reference(state)}` / `{@attach floatingEl(state)}` plus the `useInteractions` composed prop maps. Drop the bespoke `attachInteractions` / `attachRole` / `hoverableFloating` composition introduced in `af8097b7`.
- `src/lib/floating/menu/NeoMenuListItem.svelte` — same replacement. Re-evaluate the `target={wrapperRef ?? ref}` workaround: the placement regression should disappear once the floating context binds reference + floating elements through `useFloating` correctly (skeleton sets reference at hook init, current code defers via two `$effect`s that race).
- `src/lib/floating/menu/NeoMenu.svelte` — replacement.
- `src/lib/inputs/NeoRange.svelte` — replacement (lower + upper tooltip both go through `useFloating`).
- `src/lib/floating/tooltips/NeoPopSelect.svelte`, `NeoPopConfirm.svelte`, `NeoPopStepper.svelte` — replacement.
- `package.json` — remove `@skeletonlabs/floating-ui-svelte` from `dependencies`. Keep `@floating-ui/dom`. Pin the version.
- `pnpm-lock.yaml` — regenerated.
- `.gitignore` — add `vendor-ref/` (reference clones, never committed).

**Deleted:**

- `src/lib/floating/common/use-floating.svelte.ts` — the current (broken-by-omission) wrapper. Superseded by the new internal package directory.

## Reusable existing utilities

- **`@floating-ui/dom`** — already a direct dependency at `8d94f02`. The new internal port wraps this exactly as skeleton does (no behavioral re-derivation; just modern Svelte glue around `computePosition`, `autoUpdate`, middleware re-exports).
- **Test helpers** — `test/helpers/{floating,floating-visual,visual,render}.ts` are unchanged and consumed by every browser test.
- **`waitForFloatingPosition`** in `test/helpers/floating.ts` — already polls bounding-rect stability. Will be reused for the new menu/range tests; we'll add a sibling helper `waitForStableFloating` that _also_ asserts non-zero rect (current helper treats 0×0 as "stable").
- **Demo browser test scaffolding** — `demo/components/**/Test<X>.browser.test.{ts,svelte}` co-located harness layout from prior work stays intact. New tests go beside existing ones in `demo/components/floating/menu/` and `demo/components/inputs/`.
- **Vitest browser project + `tags: ['browser']`** — already configured in `vite.config.ts`; new tests adopt the same tag.
- **Demo SPA `#/test/<x>?…` routes** — backed by the generic adapter from prior work; new menu/range URL params (e.g. `?levels=3&viewport=narrow`) plug in via the existing `query.ts` helpers.

## Implementation phases

### Phase 0 — Splinter & reset

0.1 `git checkout dev` → `git branch floating-migration-attempt-1` (preserves `f1ae6b3d` + `af8097b7` for reference). Push: `git push -u origin floating-migration-attempt-1`.

0.2 `git reset --hard 8d94f02` on `dev`. `git push --force-with-lease origin dev`. _Confirm with user before force-push since dev is shared._

0.3 Sanity: `pnpm install` (lockfile re-syncs to the pre-migration state where `@skeletonlabs/floating-ui-svelte@^0.3.9` is restored). `pnpm check` + `pnpm test:unit` + `pnpm test:browser` all green at the new tip.

0.4 Add `vendor-ref/` to `.gitignore`. Clone skeleton: `git clone https://github.com/skeletonlabs/floating-ui-svelte.git ../vendor-ref/floating-ui-svelte` (sibling to neo-svelte; convention: `~/Workspace/private/neo-svelte/vendor-ref/floating-ui-svelte` via gitignore — or keep it strictly outside the repo at `~/Workspace/private/floating-ui-svelte`. Decide based on agent ergonomics; either works since it's reference-only). Pin a known-good ref (latest `main` or last release tag).

0.5 Commit: `chore(floating): splinter dev to attempt-1; reset to main; ignore vendor-ref/`.

### Phase 1 — Add Menu + Range browser tests against the _pre-migration_ (working) library

Goal: codify the contracts that the migration must preserve. These are written **before** the rewrite and run against `@skeletonlabs/floating-ui-svelte` to lock the green baseline.

1.1 Audit `demo/components/floating/menu/TestMenu.browser.test.ts`. Existing coverage: layout default+flip, escape dismiss, single-level nested submenu hover, hover-bridge contract (added in attempt-1 — port forward; this code lives on `floating-migration-attempt-1` and should be cherry-picked). Add new describe blocks tagged `['browser']`:

- **deeply nested menus (≥3 levels)** — feed a 3-level item tree to the harness; expand level-1 → level-2 → level-3; assert each level's `.neo-tooltip:not([hidden])` rect is positioned to the side of its parent menuitem (sideOffset < 20px on the appropriate axis), each rect is non-zero, and the cascade's bounding box doesn't collapse onto a single column.
- **big-screen no-overlap** — emulate a 1920×1080 viewport (existing `mcp__chrome-devtools__resize_page` or equivalent vitest browser API; otherwise use a fixed `viewport.set` config). Open a 3-level cascade in the screen center; assert that successive submenus are placed strictly to the right (or strictly left in `reverse`) of their parent — never overlapping. Use `Math.abs(rect.left - parentRect.right) < 20` style assertions.
- **small-screen forced overlap / flip** — emulate 360×640 viewport. Open the same 3-level cascade near the right edge. Assert the leaf submenu either flips to the left side or overlaps its parent (whichever skeleton's `flip()` middleware decides). Pin behavior: `expect(flippedOrOverlaps).toBe(true)` with both branches recorded as acceptable; document which one skeleton actually does.
- **viewport edge pinning** — open menu at `top:0;left:0`, top-right, bottom-left, bottom-right. Assert each cascade stays inside the viewport (`rect.left >= 0 && rect.right <= window.innerWidth` etc.).

  1.2 Audit `demo/components/inputs/TestRange.browser.test.ts`. Existing: tooltip below/above handle, dual-handle render, `tooltips=false`. Add tagged `['browser']`:

- **thumb hover opens tooltip** — pointer-hover the thumb, assert tooltip becomes visible within `restMs + buffer`.
- **dual-range pointer follow** — drag the upper thumb across 30% range; assert the tooltip's `transform`/`left` stays within 4px of the thumb at sampled positions (every 10 frames or via `requestAnimationFrame` polling). This catches the visual drift the user noticed as "weird delay."
- **keyboard step sync** — focus thumb, press `ArrowRight` 5 times; assert tooltip text updates and rect re-positions in sync with each key event (no batching delay).

  1.3 Add `demo/components/floating/tooltips/TestPopSelect.browser.test.ts`, `TestPopConfirm.browser.test.ts`, `TestPopStepper.browser.test.ts` if absent — each gets a hover-bridge contract describe (matching the existing tooltip + menu hover-bridge tests) and a placement+flip describe. Mirror the existing `TestTooltip` shape.

  1.4 Add a new shared test helper `test/helpers/floating.ts:waitForStableFloating(el, { minWidth: 1, minHeight: 1, samples: 3 })` that polls until rect stable AND non-zero. Migrate the new menu/range tests to use it. (The current `waitForFloatingPosition` keeps existing call sites working.)

  1.5 Run `pnpm test:browser`. All new tests should pass against the **skeleton-backed** library (since `dev` is now reset to pre-migration). If any fail, that's a real bug in the existing library or a flaky test — fix the test before considering the green a baseline.

  1.6 Commit per logical group: `test(menu): cover deeply nested + viewport edge cases`; `test(range): cover thumb hover + drag follow`; `test(tooltips): hover-bridge for popselect/confirm/stepper`.

### Phase 2 — Vendor skeleton, then port to Svelte 5 idiomatic

2.1 Open `vendor-ref/floating-ui-svelte/packages/floating-ui-svelte/src/` and inventory: `hooks/use-floating.svelte.ts`, `hooks/use-hover.svelte.ts`, `hooks/use-focus.svelte.ts`, `hooks/use-click.svelte.ts`, `hooks/use-dismiss.svelte.ts`, `hooks/use-role.svelte.ts`, `hooks/use-interactions.svelte.ts`, `hooks/use-id.svelte.ts`, `components/FloatingArrow.svelte`, plus internal utils. Confirm count and surface match what the consumers need (cross-reference Phase 0 audit of pre-migration `NeoTooltip.svelte`).

2.2 Create `src/lib/floating/common/floating/` directory structure mirroring skeleton's. For each module, follow this porting protocol:

- Copy skeleton's source as a starting point, but rewrite to Svelte 5 idioms:
  - Internal state: `$state(...)` instead of stores. Reads exposed via getter properties on the returned object so consumers see reactive values without subscription boilerplate.
  - Computed values: `$derived(...)` / `$derived.by(...)`.
  - Side effects with cleanup: `$effect(...)` with returned teardown.
  - Element binding: prefer Svelte 5 `{@attach fn}` attachment helpers (per https://www.skeleton.dev/docs/svelte/guides/cookbook/floating-ui-attachments) over manual bind-then-effect dance. The attachment fires on element mount/unmount with stable cleanup.
  - Event handlers: keep the `getReferenceProps()` / `getFloatingProps()` model so consumers can spread them onto elements; this is the structural correctness piece. Internally, the prop map is built from the composed hook event-prop entries — same algorithm as skeleton.
  - Async work: where skeleton awaits microtasks (e.g., `tick()`-like flushes), use Svelte 5's await-tick or the new `$effect.flush` where applicable.
- Port one module at a time, in dependency order: `use-id` → `use-floating` → `use-hover` → `use-focus` → `use-click` → `use-dismiss` → `use-role` → `use-interactions` → `floating-arrow`.
- For each ported module, write a unit test under `src/lib/floating/common/floating/<module>.test.ts` that exercises the algorithm (open/close transitions, restMs timing, escape handling, outside-press detection). Use jsdom; mark `tags: ['jsdom']`.
- Where skeleton uses a class-based hook, port to a factory function returning a getter-bag (Svelte 5 idiomatic). Keep external API surface (option keys, callback shapes, return-value shape) byte-for-byte parity.
- If a skeleton API doesn't have a clean Svelte 5 equivalent (e.g., they leaned on `onDestroy` in awkward places), document the deviation in the file's leading comment with a one-line rationale.

  2.3 Add the `attachments.ts` helper that wraps `useFloating + useInteractions` into a single-line `{@attach floating(state)}` ergonomic — but keep the lower-level hooks exported too so consumers that need fine control can still compose manually. This matches skeleton's cookbook recipe.

  2.4 Re-export everything via `src/lib/floating/common/floating/index.ts`. The barrel mirrors `@skeletonlabs/floating-ui-svelte`'s named exports so the consumer migration in Phase 3 is a pure import-path rewrite.

  2.5 Run `pnpm test:unit` — every new module's unit tests are green.

  2.6 Commit per module batch (one commit per hook): `feat(floating): port useFloating to internal package (Svelte 5 attachments)`, `feat(floating): port useHover with restMs+delay parity`, etc. Roughly 8–10 commits.

### Phase 3 — Migrate consumers, drop skeleton dependency

3.1 Replace imports in each consumer one at a time, run targeted tests after each:

- `src/lib/floating/tooltips/NeoTooltip.svelte` — `@skeletonlabs/floating-ui-svelte` → `~/floating/common/floating/`. Run `pnpm vitest run src/lib/floating/tooltips/`.
- `src/lib/floating/menu/NeoMenu.svelte` + `NeoMenuListItem.svelte` — same.
- `src/lib/floating/tooltips/NeoPopSelect.svelte`, `NeoPopConfirm.svelte`, `NeoPopStepper.svelte`.
- `src/lib/inputs/NeoRange.svelte`.
- Any other grep hits (`grep -r '@skeletonlabs/floating-ui-svelte' src/`).

  3.2 Run **the full Phase 1 browser test suite** after each consumer migration. The hover-bridge, deeply-nested menu, and Range thumb-follow tests must stay green. If they break, the porting deviation in Phase 2 is the cause — fix at the hook level, not by patching the consumer.

  3.3 Once every consumer is migrated and all tests are green, remove `@skeletonlabs/floating-ui-svelte` from `package.json`. `pnpm install` to regen lockfile.

  3.4 Commit per consumer: `refactor(tooltip): consume internal floating package`, `refactor(menu): consume internal floating package`, etc. Final commit: `chore(deps): drop @skeletonlabs/floating-ui-svelte`.

### Phase 4 — Verify & document

4.1 Full verification:

- `pnpm check` → 0 errors.
- `pnpm lint` → clean.
- `pnpm test:unit` → all unit tests pass (existing + new hook unit tests; expect ~30+ new tests in Phase 2).
- `pnpm test:browser` → all browser tests pass (existing + new menu/range/popX from Phase 1).
- `grep -r '@skeletonlabs/floating-ui-svelte' src/ demo/` → empty.
- `pnpm dev` → manually exercise `#/test/menu`, `#/test/range`, `#/test/tooltip` URLs at multiple viewport sizes; confirm no visual regressions vs `floating-migration-attempt-1` and confirm the user's reported "weird delay" is gone.

  4.2 Update README "Floating" section to credit skeleton's algorithm and document the Svelte 5 attachment recipe (`{@attach floating(state)}`). Note that the internal port lives at `src/lib/floating/common/floating/` and the public API mirrors skeleton's for predictability.

  4.3 Commit: `docs(floating): document internal port + skeleton attribution`.

  4.4 Open PR `dev` → `main`. Description references both the regression report and the attempt-1 branch for archeology. Don't merge until user signs off on visual smoke at all three URLs.

## Verification

End-to-end checks the user can run after the rework:

1. `git rev-parse floating-migration-attempt-1` returns the SHA of the original `af8097b7` tip — work preserved.
2. `git rev-parse main` and `git merge-base main dev` both equal `8d94f02` initially (Phase 0); after Phase 4, `dev` is ahead of `main` by Phase 1–4 commits.
3. `grep -r '@skeletonlabs' package.json src/ demo/` returns no hits after Phase 3.
4. `pnpm dev`, navigate to `#/test/menu` with a deeply-nested item set; click through 3 levels; visually confirm cascading side-placement at default and `?reverse=true`.
5. `pnpm dev`, navigate to `#/test/range`; drag the thumb fast across the track; confirm the tooltip glues to the thumb without lag.
6. `pnpm test:browser` shows ≥40 browser tests passing (current 42 + ≥10 new from Phase 1). No flakes across 3 consecutive runs.
7. The new menu cascade tests pass at 1920×1080 _and_ 360×640 viewport sizes — both branches of `flip()` are exercised.
8. Hook unit tests under `src/lib/floating/common/floating/*.test.ts` cover ≥80% of skeleton's hook surface (each hook has at least: open/close happy path, edge cases per option, cleanup-on-destroy).

## What this plan deliberately does NOT do

- Does **not** touch CSS native anchor positioning. Browser support floor (Safari 14+) doesn't reach Safari 17.5 where it landed; dual-path complexity not justified. Future work, separate plan.
- Does **not** retain the bespoke `hoverable` / `hoverableFloating` / `closeTimers` WeakMap from `af8097b7`. Skeleton's `useHover.handleClose` covers the same hover-bridge correctness via a different mechanism; we adopt skeleton's pattern verbatim, then modernize.
- Does **not** keep the `composeAttachments` factory or the `AttachFn` model from the migration attempt. They are superseded by `useInteractions` (skeleton's composer) plus Svelte-5 `{@attach}` (idiomatic binding).
- Does **not** rebase or cherry-pick from `floating-migration-attempt-1`. The migration attempt is reference-only; Phase 1 forward-ports the _test additions_ from attempt-1 (hover-bridge contract, nested submenu placement test) but the _implementation_ is rewritten from skeleton, not patched.
- Does **not** merge to `main` automatically. PR + manual sign-off after visual smoke.
- Does **not** vendor skeleton into the published bundle. `vendor-ref/` is gitignored and reference-only; the published `dist/` only contains the rewritten internal port.
