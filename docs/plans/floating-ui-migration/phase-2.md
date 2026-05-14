# Phase 2: Migration to `@floating-ui/dom` via Svelte 5 `{@attach}` + Phase 3: Verification

> **Sibling plan:** [`phase-1.md`](./phase-1.md) (test infrastructure + TNR coverage). Phase 2 assumes that suite is in place and green.

## Context for this phase (read on a cold start)

**Why we're here.** `@skeletonlabs/floating-ui-svelte` is dead upstream (skeletonlabs/floating-ui-svelte#169). Phase 1 already landed a TNR (true-and-real) test suite over `src/lib/`, run under a hybrid Vitest setup (jsdom + `@vitest/browser` Playwright provider). That suite is the **contract** — it must stay green throughout this phase. A red test = a behavior regression.

**Testing rules (apply here too).** Any new tests added in Phase 2 (e.g. `use-floating.svelte.ts.test.ts`, browser autoUpdate cases) follow the same three rules codified in [`phase-1.md`](./phase-1.md#testing-rules--apply-to-all-subsections-phases-and-unit-tests):

1. Qualitative, exhaustive, relevant (TNR) coverage — no tautologies, pin real behavior.
2. Exhaustive option matrix — on, off, AND combinations.
3. Known bugs → `it.skip` with TODO + expected-behavior assertion (never lock the broken state).

If a Phase 2 PR uncovers an illogical-behavior bug in either the new primitives or the consumers, follow rule 3: skip-with-TODO and surface in the PR description rather than papering over it.

**What this phase does.** Replace skeleton imports with `@floating-ui/dom` driven by Svelte 5 `{@attach}` (per Skeleton's own cookbook: https://www.skeleton.dev/docs/svelte/guides/cookbook/floating-ui-attachments#summary). Build a small in-repo set of attachment factories — not a long-lived "useFloating" framework — that mirror the skeleton API surface used today.

**Direct migration surface (only these files import the dead lib):**

- `src/lib/floating/tooltips/NeoTooltip.svelte` — primary consumer (`useFloating`, `useHover`, `useFocus`, `useClick`, `useDismiss`, `useRole`, `useInteractions`, `offset`, `flip`, `size`, `autoPlacement`).
- `src/lib/floating/tooltips/neo-tooltip.model.ts` — re-exports types (`UseFloatingOptions`, `UseFloatingReturn`, `Use{Hover,Focus,Click,Dismiss,Role}Options`, `offset`).
- `src/lib/floating/common/neo-placement.model.ts` — `type UseFloatingOptions` (placement union extraction only).
- `src/lib/inputs/NeoRange.svelte` — `useFloating`, `flip`, `offset`.
- `src/lib/inputs/neo-range.model.ts` — `type UseFloatingOptions`.

**Transitively coupled** (no skeleton import, but inherits behavior via NeoTooltip): `NeoMenu*`, `NeoPopSelect`, `NeoPopConfirm`, `NeoPopStepper`, `NeoSelect`. Dialog/Drawer/Notification/Portal use no floating-ui at all.

**Key behaviors that must survive the swap** (each is locked by a Phase 1 test):

1. `open` is `$bindable` and reactive in both directions.
2. NeoTooltip's manual listener attachment for external `target` elements (NeoTooltip.svelte:243-267).
3. Middleware order: `offset → size → (autoPlacement | flip)` for tooltip; `flip → offset` for range.
4. Custom dismiss reconciliation (NeoTooltip.svelte:142-151) — hover/focus/click states do not stomp each other.
5. `transform-origin` derived from resolved placement (NeoTooltip.svelte:223-230).
6. Manual `floating.update()` calls on window resize (NeoTooltip.svelte:313-319) and on PopSelect items/selected change (NeoPopSelect.svelte:86-91) — must map to `autoUpdate` + imperative refresh.
7. ARIA: `role`, `aria-describedby`, `aria-haspopup`, `aria-expanded`, `aria-controls` set on the right elements.
8. NeoMenu Safari branch: flip middleware disabled when `isSafari()`.

---

## Phase 2 — Migration (one PR per file group, suite green at every commit)

### 2.1 Add deps and primitives (1 PR — foundation only, no consumer file changes yet)

**Dependencies:**

- Add: `@floating-ui/dom` (peer of `@floating-ui/utils`).
- Do **not** remove `@skeletonlabs/floating-ui-svelte` yet — it stays installed until 2.7 so the suite can run against both during the rollout.

**New file: `src/lib/floating/common/use-floating.svelte.ts`** — thin primitives, internal-only:

- `floating(options)` — returns `{ reference, floating, update, destroy, open, placement, x, y, strategy, middlewareData }` as a Svelte 5 reactive state object (`$state` for `open`/placement/x/y).
  - Internally calls `computePosition` from `@floating-ui/dom` with the configured middleware list and wires `autoUpdate(reference, floating, update)`.
  - Exposes `setOpen(boolean, reason?)` so interaction helpers can flip state coherently.
- Two `{@attach}` factories:
  - `attachReference(state)` — binds the element as the floating reference; on detach, clears.
  - `attachFloating(state)` — binds the floating element; on detach, calls `state.destroy()`.
- Interaction helpers (each returns an `{@attach}`-compatible callback or a small object holding event listeners attached via `addEventListener` so the manual `target` path keeps working):
  - `hoverable(state, opts)` — `pointerenter`/`pointerleave` with `restMs`, `delay`, `keepOpenOnHover`, `keepOpenOnFloating`.
  - `focusable(state, opts)` — `focusin`/`focusout` (uses `relatedTarget` to honor `keepOpenOnFocus`).
  - `clickable(state, opts)` — toggle on click; honors `outsideClickHandled` via `dismissable`.
  - `dismissable(state, opts)` — Escape, outside-click (capture phase), scroll close. Respects `closeOnDismiss`.
  - `roleable(state, opts)` — sets `role`, `aria-describedby`/`aria-haspopup`/`aria-expanded`/`aria-controls` on reference + floating.
- `composeAttachments(...fns)` — combines multiple attach functions so a single element can take all relevant handlers in one `{@attach}`.

These primitives **mirror the skeleton API surface used today** and nothing more. They live in `floating/common/`, not in a published-looking package.

**Tests added with the primitives:**

- `use-floating.svelte.ts.test.ts` (jsdom) — state transitions, `setOpen`, multiple attach/detach cycles do not leak listeners.
- `use-floating.browser.test.ts` — `autoUpdate` recomputes on resize/scroll.

### 2.2 `neo-placement.model.ts` (1 small PR)

- Replace `import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte'` with `import type { Placement } from '@floating-ui/dom'`.
- Adjust `NeoPlacement` derivation to extract from `Placement` directly.
- All other named exports (`NeoPlacements`, `NeoTooltipPlacements`, `NeoDialogPlacements`, `NeoNotificationPlacements`, `reversePlacement`, `invertPlacement`) keep their public shape.
- Phase 1's `neo-placement.model.test.ts` must stay green.

### 2.3 `neo-tooltip.model.ts` (1 PR)

- Drop skeleton type re-exports. Redefine the types we care about over `@floating-ui/dom`:
  - `UseFloatingOptions` = our local options type (`Placement`, `Strategy`, `Middleware[]`, plus our `onOpenChange`/`elements` shape).
  - `UseFloatingReturn` = our local return type matching `floating()` from `use-floating.svelte.ts`.
  - `Use{Hover,Focus,Click,Dismiss,Role}Options` = local interfaces with the field names already used in `NeoTooltipProps`.
- Public `NeoTooltipProps` field names must not change.
- Phase 1's NeoTooltip type-shape tests (and the wider tooltip behavior suite) must stay green.

### 2.4 `NeoTooltip.svelte` (1 PR — the heart of the migration)

Replace skeleton hooks with the new primitives. The diff is structural; behavior must not move.

- Build state:
  ```
  const state = floating({
    placement,
    middleware: [
      offset(offsetFn),
      size({ apply: ({ availableWidth, availableHeight }) => { /* existing strategy code */ } }),
      placement === 'auto'
        ? autoPlacement({ allowedPlacements: NeoTooltipPlacements })
        : flip({ fallbackAxisSideDirection: 'end' }),
    ],
    onOpenChange: (open, event, reason) => { /* existing reconciliation */ },
  });
  ```
- Trigger element gets `{@attach composeAttachments(attachReference(state), hoverable(...), focusable(...), clickable(...))}` — but only the helpers enabled by the current props (`openOnHover`, `openOnFocus`, `openOnClick`).
- For the external `target` path (NeoTooltip.svelte:243-267): keep the manual `addEventListener` loop, but iterate over the handler maps returned by the helpers' `getEventHandlers()` accessor instead of the skeleton lib's `getReferenceProps()`. The new primitives expose this accessor exactly so this branch stays viable.
- Floating element gets `{@attach composeAttachments(attachFloating(state), roleable(...), dismissable(...))}`.
- Custom dismiss reconciliation (NeoTooltip.svelte:142-151) ports to `dismissable` opts (`bubbles`, `referencePress`, `outsidePress` predicates, `escapeKey` predicate).
- Window resize → `state.update()` (existing pattern). `autoUpdate` already covers scroll/resize of the floating ancestor; the manual call covers the bindable `innerWidth`/`innerHeight` reactive pattern at NeoTooltip.svelte:313-319.
- `transform-origin` logic is unchanged — it sources `placement` from `state` instead of `floating.context.placement`.
- Exposed `toggle()`/`update()` methods now wrap `state.setOpen(...)` and `state.update()`.

### 2.5 `NeoPopSelect.svelte` (1 PR)

- Only the type import (`UseFloatingReturn`) changes — point it at the local type from `neo-tooltip.model.ts`.
- The manual update calls on items/selected change (NeoPopSelect.svelte:86-91) become `state.update()` via the floating context exposed by NeoTooltip's bindable ref.
- `NeoPopConfirm.svelte` / `NeoPopStepper.svelte` need no changes (they consume NeoTooltip purely through props/snippets).

### 2.6 `NeoMenu.svelte` and friends (1 PR — verify only)

- No source changes expected — NeoMenu wraps NeoTooltip and never imported skeleton directly.
- Run `floating/menu/*.test.ts` and `floating/menu/*.browser.test.ts`. If anything goes red, the regression is in the NeoTooltip swap, not here — fix in 2.4 and re-run.
- Confirm Safari branch (`mockIsSafari(true)` test) still disables flip via the new middleware list path.

### 2.7 `NeoRange.svelte` + `neo-range.model.ts` (1 PR)

- `neo-range.model.ts`: replace skeleton `UseFloatingOptions` import with the local one defined in 2.3 (or its own minimal copy if we want to keep range independent).
- `NeoRange.svelte`: same recipe as NeoTooltip but smaller —

  ```
  const state = floating({ placement, middleware: [flip(), offset(6)] });
  ```

  - `attachReference(state)` on the thumb element.
  - `attachFloating(state)` on the tooltip element.
  - No interaction helpers needed — range shows the tooltip whenever the thumb is focused/dragged, which is already managed by existing Range state (`focused`, `hovered`, drag state).

- Phase 1's `NeoRange.test.ts` and `NeoRange.browser.test.ts` must stay green.

### 2.8 Cleanup (1 PR)

- Remove `@skeletonlabs/floating-ui-svelte` from `package.json` and `pnpm-lock.yaml`.
- `rg @skeletonlabs/floating-ui-svelte src/ package.json pnpm-lock.yaml` returns nothing.
- Remove any stale type-only re-exports that pointed at the dead lib.
- Run the entire suite — every Phase 1 test stays green, every Phase 2-added primitive test stays green.

---

## Phase 2 risks → which Phase 1 test catches each

- **Manual listener path on `target` external element** → `NeoTooltip.test.ts` external-target case (Phase 1 §1.1).
- **Middleware order regression** → `NeoTooltip.browser.test.ts` placement/flip/size cases (§1.1).
- **`autoUpdate` not wired** → resize/scroll cases in `NeoTooltip.browser.test.ts` (§1.1).
- **ARIA changes** → role/aria-describedby/aria-expanded assertions in `NeoTooltip.test.ts` (§1.1) and `NeoMenu.browser.test.ts` (§1.2).
- **Hover/focus/click reconciliation edge cases** (NeoTooltip.svelte:142-151) → keepOpenOnHover/Focus/Click matrix tests (§1.1).
- **`transform-origin` mismatch after placement swap** → browser test asserts `transform-origin` string per resolved placement (§1.1).
- **PopSelect dropdown not repositioning on items change** → `NeoPopSelect.test.ts` manual-update assertion (§1.1).
- **Range tooltip not flipping near top edge** → `NeoRange.browser.test.ts` (§1.3).
- **Menu Safari branch broken** → `NeoMenu.browser.test.ts` Safari case (§1.2).

If any of these go red during a Phase 2 PR, the migration step is wrong — fix the implementation, do not loosen the test.

---

## Phase 3 — Verification

End-to-end checks before declaring done. All commands run from the repo root.

1. **Install clean:**
   - `pnpm install` — lockfile has no `@skeletonlabs/floating-ui-svelte`.
   - `rg @skeletonlabs src/ package.json pnpm-lock.yaml` returns nothing.
2. **Static checks:**
   - `pnpm typecheck` (or `pnpm svelte-check`) — clean.
   - `pnpm lint` — clean.
3. **Test suite:**
   - `pnpm test:unit` — all green.
   - `pnpm test:browser` — all green.
   - `pnpm test` — both projects green sequentially.
4. **Manual smoke (demo app):** `pnpm dev`, then exercise each migration-affected component:
   - **NeoTooltip:** hover/focus/click triggers, viewport-edge flip, `target` external element, portal mount, transition origin matches placement.
   - **NeoMenu:** nested menus, arrow-key nav, Esc closes all, Safari (or `mockIsSafari` story).
   - **NeoPopSelect:** open, search filter, select, close-on-select, height adapts to filter results.
   - **NeoPopConfirm / NeoPopStepper:** confirm/cancel, step nav, Escape.
   - **NeoSelect:** open/close via `open` bindable, arrow-key highlight, Enter selects, dropdown placement near viewport edge.
   - **NeoRange:** drag thumb, dual-handle, tooltip flips near top, default 6px offset.
   - **NeoDialog / NeoDrawer / NeoNotification:** sanity sweep — these were not migrated but share the Phase 1 safety net.
5. **Build:** `pnpm build` succeeds; no runtime warnings about missing exports; bundle size delta is sane (the new code path should be smaller — fewer abstractions).
6. **Demo app a11y spot-check:** with the dev server running, open the menu and tooltip stories with VoiceOver/NVDA briefly. Announcements should match what Phase 1 ARIA tests asserted (role, expanded state, describedby).

## Critical files touched in this phase

- New: `src/lib/floating/common/use-floating.svelte.ts` + co-located tests.
- Modified: `src/lib/floating/common/neo-placement.model.ts`, `src/lib/floating/tooltips/NeoTooltip.svelte`, `src/lib/floating/tooltips/neo-tooltip.model.ts`, `src/lib/floating/tooltips/NeoPopSelect.svelte`, `src/lib/inputs/NeoRange.svelte`, `src/lib/inputs/neo-range.model.ts`.
- Verified-only (no source change expected): `src/lib/floating/menu/*`, `src/lib/floating/tooltips/NeoPopConfirm.svelte`, `src/lib/floating/tooltips/NeoPopStepper.svelte`, `src/lib/inputs/NeoSelect.svelte`.
- Removed: `@skeletonlabs/floating-ui-svelte` from `package.json` + `pnpm-lock.yaml`.

## What this phase deliberately does NOT do

- No new public abstraction layer or "neo-floating" library — the `use-floating.svelte.ts` primitives stay internal and minimal.
- No refactor of dialog/drawer/notification behavior — they were never on the dead lib.
- No backwards-compat shim for the skeleton API — direct cutover behind the contract suite.
- No migration to Vitest browser-only mode — hybrid setup from Phase 0 stays.

## Done definition

- All Phase 3 verification steps pass.
- The dead lib is fully gone from lockfile and source.
- Phase 1 + Phase 2 added test files all stay green on every commit of the migration PR train.
- Demo app smoke-tested across affected components with no visible regressions.
