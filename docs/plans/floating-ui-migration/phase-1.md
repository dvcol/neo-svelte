# Phase 1: TNR Coverage of `src/lib/`

> **Sibling plan:** [`phase-2.md`](./phase-2.md) (migration & verification). Read this first; Phase 2 assumes the test suite below is in place.

## Context for this phase (read on a cold start)

`@skeletonlabs/floating-ui-svelte` is dead upstream and used by 5 files in this repo. Before migrating off it, we must lock current behavior as an executable contract — the project ships **zero real tests today** (only a `describe.todo` stub in `test/index.test.ts`).

This phase delivers:

1. **Phase 0** — a hybrid Vitest setup (jsdom + `@vitest/browser` with Playwright provider), test helpers, and conventions.
2. **Phase 1** — TNR (true-and-real) tests for the entire `src/lib/` surface, prioritized so that floating-ui consumers (NeoTooltip, NeoMenu, NeoSelect, NeoRange and friends) are fully locked down first.

**TNR definition.** Tests assert observable behavior — roles, ARIA, text, `data-*` attributes, bindable props, callback args, measured layout deltas — never implementation details (class names, internal store identities, middleware references, line-of-code structure). The same test must pass against today's code (skeleton lib) and against tomorrow's code (`@floating-ui/dom` via `{@attach}`).

**Conventions for every test file:**

- Co-located with the component (`Foo.svelte` → `Foo.test.ts` / `Foo.browser.test.ts`).
- `@testing-library/svelte` + `@testing-library/user-event` over manual events.
- jsdom for behavior; browser project (`*.browser.test.ts`) only when real layout, real pointer/drag, real scroll, real `requestAnimationFrame`, or real focus traversal is required.
- Positioning assertions use `data-placement` / measured rect deltas / transform-origin strings — never absolute pixel coordinates.
- Fake timers for delay-driven behavior in jsdom; real timers (with `vi.waitFor`) in browser.

### Testing rules — apply to ALL subsections, phases, and unit tests

These three rules are non-negotiable. They apply to every `*.test.ts` / `*.browser.test.ts` added in Phase 1, in Phase 2 (verification), and to any future unit test in this repo.

1. **Qualitative, exhaustive, relevant (TNR) coverage.** Tests must pin observable behavior — state transitions, ARIA wiring, callback args/order, derived values, transforms, edge inputs. No tautologies (`expect(Enum.Foo).toBe('foo')`, asserting defaults TS already enforces, asserting an object literal equals itself). When extending an existing file, prune cases that fail this bar.
2. **Exhaustive option matrix — on, off, AND combinations.** For every boolean/enum prop that gates behavior (`openOn{Hover,Focus,Click}`, `modal`, `closable`, `multiple`, `clearable`, `disabled`, `readonly`, `keepOpen*`, placement, etc.) cover the on path, the off path, and at least one composition with another related flag. Use `it.each` for table-driven cases. Only enumerate combinations where flags genuinely interact.
3. **Known bugs → `it.skip` with a TODO + expected behavior.** When implementation behavior is illogical or broken, do NOT pin the broken state. Instead write the **expected** behavior as `it.skip(...)` with an inline comment containing the bug summary, file:line reference, and a grep-able `TODO:` marker. The skipped test is the contract for the fix; unskipping it = the bug is resolved. Also surface the bug in the PR description so it gets triaged.

These rules are mirrored in the user's auto-memory (`feedback_tests_global_rules.md`, `feedback_tests_test_real_behavior.md`, `feedback_tests_cover_option_combinations.md`) — keep them in sync if either is updated.

**Library inventory used to size this plan:** `assets, badge, buttons, cards, collapse, containers, cursor, divider, floating, form, icons, inputs, list, loading, media, nav, pill, progress, providers, skeletons, stepper, styles, text, utils` plus `src/lib/index.ts`. Scope = whole library per the user's decision.

---

## Phase 0 — Test infrastructure (1 PR)

Goal: enable the hybrid runtime and helpers before any test bodies are written.

### Files to add / modify

- **`vite.config.ts`** — replace the single `test` block with Vitest **projects** (workspace inline):
  - Project `unit` (jsdom): `include: ['src/**/*.test.ts', 'test/**/*.test.ts']`, excludes `*.browser.test.ts`.
  - Project `browser`: `include: ['src/**/*.browser.test.ts']`, `browser: { enabled: true, provider: 'playwright', instances: [{ browser: 'chromium' }] }`.
  - Keep current aliases `~/` → `./src/lib`, `src/` → `./src`.
- **`package.json`** — add devDeps: `@vitest/browser`, `playwright`. Scripts:
  - `test:unit` → `vitest --project unit --run`
  - `test:browser` → `vitest --project browser --run`
  - `test` → both (sequential).
- **`test/setup.unit.ts`** — keep `@testing-library/jest-dom/vitest`; add minimal jsdom shims for `IntersectionObserver`, `ResizeObserver`, `requestAnimationFrame`, `Element.prototype.scrollIntoView`, `HTMLDialogElement.prototype.show/showModal/close` (jsdom 29 still misses parts), `Element.prototype.animate` (returns a stub `Animation`), `matchMedia`. **No layout shims** — positioning tests live in browser project.
- **`test/setup.browser.ts`** — `@testing-library/jest-dom/vitest` only.
- **`test/helpers/`** (new):
  - `render.ts` — re-export `@testing-library/svelte` `render` + a `renderWithPortalTarget()` that injects `<div id="neo-portal-root">` and cleans up.
  - `floating.ts` — utilities: `waitForFloatingPosition(el)` (rAF + `getComputedStyle`), `getRectAt(el)`, placement-assertion helpers reading `data-placement`.
  - `inputs.ts` — `typeInto(user, input, value)`, `pressKey(user, key)`, `expectValidity(input, expected)` (wraps `checkValidity` / `validationMessage`).
  - `pointer.ts` — drag simulation for browser project (real `pointerdown`/`move`/`up` sequences with movement deltas).
  - `mocks.ts` — `mockMatchMedia`, `mockIsSafari` (NeoMenu Safari branch), `mockLocalStorage`, `fakeNotificationClock`, `mockClipboard`.
- **`tsconfig.test.json`** — include `test/**/*`, `src/**/*.test.ts`, `src/**/*.browser.test.ts`.
- **Co-location convention** — documented as a comment header in `test/helpers/render.ts`. The legacy `test/` folder keeps cross-cutting/index tests only.
- **`.github/workflows/`** — if CI exists, add a job step running both projects. (Skip if no workflow file exists today.)

### Exit criteria

- `pnpm test:unit` and `pnpm test:browser` both run (with empty matching sets is acceptable) and finish green.
- Existing `test/index.test.ts` still picked up by the `unit` project.
- `pnpm test` runs both sequentially.

---

## Phase 1 — TNR coverage

Each subsection is **one PR**. The order below is the recommended landing order: floating-ui consumers (1.1, 1.2, 1.3) gate Phase 2; the rest (1.4 onward) build the broader safety net per the "whole library" decision.

### Priority A — Gates Phase 2 migration

#### 1.1 `floating/tooltips/`

**`NeoTooltip.test.ts` (jsdom) — behavior contract**

- Renders `children` trigger and (when open) `tooltip` snippet/string.
- `open` is `$bindable`; setting from parent toggles visibility, `floating.open` getter matches.
- Exposed `toggle()`, `toggle(true)`, `toggle(false)` work via the bound ref.
- Hover: opens after `openDelay`, stays open during `hoverDelay`, closes on leave (fake timers).
- `keepOpenOnHover` keeps it open while pointer is over the floating element.
- Focus: opens on trigger focus when `openOnFocus`, closes on blur unless `keepOpenOnFocus`.
- Click: only opens when `openOnClick`; toggles on repeat clicks; suppressed when `openOnHover` already opened it.
- Dismiss: Escape closes when `closeOnDismiss`; outside click closes; scroll close path.
- ARIA: `role="tooltip"` on floating, `aria-describedby` linkage.
- Events: `onChange`, `onOpen`, `onClose` fire with correct args/order.
- `target` prop: external element acts as reference (covers manual-listener path at NeoTooltip.svelte:243-267).
- `portal=true` mounts into the portal root, not in-place.
- `unmountOnClose` actually unmounts vs hides; `fade` retains DOM.

**`NeoTooltip.browser.test.ts` — layout contract**

- `placement="top"` puts floating above reference; `placement="auto"` selects something within viewport.
- `flip` engages when reference is near bottom edge (resize viewport).
- `size` middleware caps width/height; `width="match"|"min"|"max"|"available"` strategies produce expected `width` style.
- `offset` numeric and function forms produce different gaps.
- `transform-origin` matches resolved placement (NeoTooltip.svelte:223-230).
- Window resize triggers `floating.update()` (real resize, assert position changes).

**`NeoPopSelect.test.ts`** (jsdom + a positional smoke in browser): list items render; search input when enabled; `onChange` fires with selected value; closes on select unless `keepOpenOnSelect`; default width `'min'`; manual update fires when items change (NeoPopSelect.svelte:86-91).

**`NeoPopConfirm.test.ts` / `NeoPopStepper.test.ts`** (jsdom): confirm/cancel callbacks; step transitions; Escape behavior; closing returns control of `open`.

#### 1.2 `floating/menu/`

**`NeoMenu.test.ts` (jsdom)** — items render; nested `items` produce nested menus on hover/click; `onSelect` fires for leaves, `onMenu` for branches; derived `open` includes nested children (NeoMenu.svelte:67) — closing the parent closes nested menus.

**`NeoMenu.browser.test.ts`** — keyboard: ArrowDown focuses first item; ArrowRight opens nested + focuses first; ArrowLeft closes nested; Esc closes all; Tab keeps focus inside menu while open. `reversePlacement()` flips nested side near viewport edge. Safari branch: with `mockIsSafari(true)`, flip middleware is disabled.

**`NeoMenuList.test.ts` / `NeoMenuListItem.test.ts`** — role attributes (`role="menu"`, `role="menuitem"`), `keepOpenOnSelect`, `getLastFocusableElement` wiring.

**`neo-menu-context.svelte.ts.test.ts`** — direct unit: parent registers child, child propagates open up, removal cleans up, idempotent register.

#### 1.3 `inputs/NeoRange.*` and `inputs/NeoSelect.*` (other floating-ui consumers)

**`NeoRange.test.ts` (jsdom)** — `value` bindable (number and `[min, max]`); `min`/`max`/`step` clamp; `valid` reflects validity; tooltip snippet renders current value; keyboard: ArrowLeft/Right step, Home/End clamp, PageUp/Down jumps.

**`NeoRange.browser.test.ts`** — pointer drag on thumb updates value; dual-handle drag respects ordering; tooltip floats above thumb; `flip()` engages near top edge; default `offset(6)` produces expected gap.

**`NeoSelect.test.ts` (jsdom)** — opens/closes via `open` bindable; arrow up/down highlights; Enter selects; Escape closes; `selected` and `value` stay in sync; filter input narrows list.

**`NeoSelect.browser.test.ts`** — dropdown placement and flip near viewport edge; focus returns to trigger on close.

### Priority B — Rest of `floating/` (no skeleton dep, still in scope)

#### 1.4 `floating/dialog/`

**`NeoDialog.test.ts` (jsdom)** — `show()`/`showModal()`/`close(returnValue)` sync `open`; `open=true` calls native method, `open=false` calls `close()`; `oncancel`/`onclose` fire; `returnValue` exposed via the monkey-patched property (NeoDialog.svelte:274-319); modal traps focus; `closeOnClickOutside` only effective when modal; `requestClose()` fallback emulated; `placement` resolves to expected position class/style.

**`NeoDialog.browser.test.ts`** — movable: drag handle moves the dialog, `moved` updates, `outside` flips when peeking past edge; snap to corners; `closeThreshold` triggers close when dragged past it; body scroll lock toggles on iOS-emulated viewport.

**`use-movable.svelte.ts.test.ts`** — composable unit: axis constraint, snap math, keyboard arrows + modifiers, `resetOnClose`.

**`NeoDialogConfirm.test.ts` / `NeoDialogStepper.test.ts`** — confirm callbacks, step transitions, Escape behavior.

#### 1.5 `floating/drawer/`

**`NeoDrawer.test.ts` (jsdom)** — inherits NeoDialog contract; `modal` cannot be disabled; placement → axis (right/left = x-only, top/bottom = y-only, NeoDrawer.svelte:40-50); snap limits respect placement (e.g. right drawer: `x >= 0`).

**`NeoDrawer.browser.test.ts`** — swipe-to-close at half-dimension threshold.

**`NeoDrawerConfirm.test.ts` / `NeoDrawerStepper.test.ts`** — wrapper specifics.

#### 1.6 `floating/notification/`

**`NeoNotificationStack.test.ts` (jsdom)** — `add()` returns id; `remove(id)`, `update(id, …)`, `restart(id)` mutate queue; `pause()` and per-item `pauseOnHover` halt the timer (fake timers); `max` evicts oldest; `clear()` empties; `onChange`/`onCancel` fire with correct status (`pending` → `dismissed`/`cancelled`/`expired`).

**`NeoNotificationStack.browser.test.ts`** — items stagger by measured height (no overlap); drag-to-dismiss past `threshold.x|y`; wheel swipe dismiss; `pauseOnHover` halts real `setTimeout`; ARIA `aria-posinset`/`aria-setsize` after add/remove.

**`NeoNotificationItem.test.ts`** — type-based rendering (success/error/warning/info/loading), `flyFrom()` direction matches placement.

**`NeoSimpleNotification.test.ts`** — minimal rendering + status.

**`useNotificationService.test.ts`** — registry: same `id` returns same instance; scoping isolates queues.

#### 1.7 `floating/portal/`

**`NeoPortal.test.ts` (jsdom)** — `enabled: false` renders inline; `enabled: true` mounts into provided target (default `document.body`); outro transition runs before unmount when configured; multiple portals do not collide.

**`NeoPortalContainer.test.ts` / `NeoPortalTarget.test.ts`** — context provided; deepest open dialog tracked; `ref` propagation.

**`neo-portal-context.svelte.ts.test.ts`** — direct unit: `register/unregister`, `open` derived count, deepest placement getter.

#### 1.8 `floating/common/`

**`neo-placement.model.test.ts`** — `reversePlacement()`, `invertPlacement()`, every placement enum value.

**`NeoConfirm.test.ts` / `NeoFloatingStepper.test.ts` / `NeoHandle.test.ts`** — props, callbacks, ARIA labels, keyboard activation.

### Priority C — Rest of `src/lib/` (whole-library safety net)

> Per the "whole library" decision. Components below have no relationship to floating-ui-svelte; they're tested for general regression safety. One PR per directory; consumer-group PRs (1.1–1.3) land first.

#### 1.9 `buttons/`

**`NeoButton.test.ts` (jsdom)** — render `children`/`label`/`icon`; click fires `onclick` with native event; `propagation=false` calls `stopPropagation`; toggle mode flips `checked`; `readonly` disables click but not focus; `disabled` sets `disabled`/`aria-disabled`; loading swaps icon for spinner; Enter/Space activates; `hovered`/`focused` bindables update.

**`NeoButton.browser.test.ts`** — elevation/shadow class transitions on hover/active (assert via `data-elevation` or `data-pressed`, not computed shadow).

**`NeoCheckboxButton.test.ts`** — `checked`/`indeterminate`/`touched` bindables; click cycles; `indeterminate` clears on user click but not on programmatic update.

**`NeoRadioButton.test.ts`** — single selection within a group; `group` bindable; arrow keys cycle within radio group when wrapped in a group container.

**`NeoSwitchButton.test.ts`** — toggles `checked`; ARIA `role="switch"` + `aria-checked`.

**`NeoArrowButton.test.ts` / `NeoCancelButton.test.ts` / `NeoCloseButton.test.ts`** — preset variants render expected icons + `aria-label`.

**`NeoButtonGroup.test.ts`** — selection state shared, `value` bindable, exclusive vs multiple modes.

**`NeoButtonRow.test.ts`** — layout-only smoke.

#### 1.10 `inputs/` (the rest, beyond NeoRange/NeoSelect already covered)

**`common/NeoInput.test.ts` (jsdom)** — `value` bindable; `valid`/`dirty`/`touched`/`focused` flip at the right moments; clearable button clears on click; `before`/`after`/`label` snippets render; `aria-describedby` wires to validation message; Escape clears when configured; Enter triggers form submit when inside a form.

**`common/NeoInput.browser.test.ts`** — floating label position transitions on focus/value; `clientWidth`-driven label size update on resize.

**`common/NeoBaseInput.test.ts`** — exposed methods: `mark`, `clear`, `change`, `validate`; `setCustomValidity` round-trips through `validationMessage`; native `checkValidity()` reflected in `valid`; `files` bindable for `type=file`; `group` bindable for radio.

**`common/NeoLabel.test.ts`** — clicking label focuses associated input via `for`; `required` adds asterisk; `disabled` greys.

**`common/NeoAffix.test.ts`** — renders `loading`/`close`/`valid` states; close button fires callback.

**`common/NeoInputValidation.test.ts` / `NeoValidation.test.ts`** — validation/message/error precedence.

**`NeoCheckbox.test.ts`** — `checked`/`indeterminate`/`group`; Space toggles; `required` blocks form submission.

**`NeoRadio.test.ts`** — `group` shared; only one checked.

**`NeoSwitch.test.ts`** — `checked` toggles on click and Space; ARIA correct.

**`NeoNativeSelect.test.ts`** — value bind; `change` event fires; option list renders.

**`NeoColorPicker.test.ts`** — value bindable; valid hex/rgb accepted.

**`NeoColorPickerSelector.test.ts`** — palette click selects.

**`NeoDateTime.test.ts`** — value bind for date/time/datetime-local types; `min`/`max` enforced; `showPicker()` callable when supported.

**`NeoPassword.test.ts`** — toggle visibility flips `type` between `password`/`text`.

**`NeoPin.test.ts` (jsdom)** — `count` × `groups` digit cells; auto-advance on digit; Backspace moves to previous; ArrowLeft/Right navigation; paste fills cells; `value` bindable string.

**`NeoNumberStep.test.ts`** — +/− buttons increment by `step`; clamp at `min`/`max`; keyboard ArrowUp/Down.

**`NeoFilePicker.test.ts` (jsdom)** — `files` bindable; clear removes entries; `expanded` toggles preview area.

**`NeoFilePicker.browser.test.ts`** — drag-drop: `dragover` adds `dragging` class, `drop` populates `files`; multiple file drop; rejected types not added.

**`NeoFilePickerCard.test.ts`** — file metadata renders; remove button fires callback.

#### 1.11 `list/`

**`NeoList.test.ts` (jsdom)** — items render via `item` snippet; `selected` bindable (single + multiple); arrow keys move highlight; Enter/Space selects; `nullable` allows deselect; `multiple` adds toggle; `disabled` items skip in keyboard nav; sections/dividers render; `empty` snippet shows when items empty.

**`NeoList.browser.test.ts`** — `onScrollTop`/`onScrollBottom` fire when crossing tolerance with real scroll; flip animations on add/remove run (assert `data-state` markers, not frame timings).

**`NeoVirtualList.test.ts` / `.browser.test.ts`** — only visible items rendered; scrolling brings new ones in; total height correct.

**`NeoSimpleList.test.ts`** — minimal render.

**`NeoListSearch.test.ts`** — typing updates `filter`; clearing restores list.

**`NeoListBaseItem.test.ts` / `NeoListBaseSection.test.ts` / `NeoListBaseLoader.test.ts`** — props pass-through, dividers, loader visibility.

**`neo-list.model.test.ts`** — pure helpers `isSection`, `findByIdInList`, `findByValuesInList`, `showDivider` (table-driven inputs).

#### 1.12 `nav/`

**`NeoTabs.test.ts` (jsdom)** — `active` bindable; clicking a `NeoTab` activates it; `panes` snippet renders only the active pane's `NeoTabPanel`; ArrowLeft/Right moves active; Home/End jump; `closeable` tabs fire close callback; `add` button fires.

**`NeoTabs.browser.test.ts`** — slide indicator follows active tab (compare `transform: translateX` direction, not exact px); ResizeObserver-driven recompute on container resize.

**`NeoTab.test.ts` / `NeoTabPanel.test.ts`** — `active` derives from parent context; `id` linkage; `disabled` blocks click.

**`NeoTabsCard.test.ts` / `NeoTabsRow.test.ts` / `NeoTabDivider.test.ts`** — layout variants.

**`neo-tabs-context.svelte.ts.test.ts`** — registration, position tracking, active switching.

#### 1.13 `collapse/`

**`NeoCollapse.test.ts` (jsdom)** — `open` bindable; trigger Space/Enter toggles; `disabled`/`readonly` block toggle; group-context integration.

**`NeoCollapse.browser.test.ts`** — height transitions actually run (assert non-zero `height` mid-transition); `horizontal` uses width; `unmountOnClose` removes children from DOM.

**`NeoCollapseGroup.test.ts`** — accordion strategy: opening one closes others; multiple strategy: respects `min`/`max` count; `disabled` propagates.

**`NeoAccordion.test.ts`** — preset wrapper around group + collapse.

**`neo-collapse-context.svelte.ts.test.ts`** — registration, strategy enforcement.

#### 1.14 `progress/`

**`NeoProgress.test.ts` (jsdom)** — `value` bindable; `min`/`max` clamp; status transitions (Idle → Active → Finished); exposed `start`/`stop`/`pause`/`resume`/`reset` on ref; `autoStart`/`autoComplete`.

**`NeoProgress.browser.test.ts`** — indeterminate animation actually advances frames (use `vi.waitFor` for value change with real rAF); `tick` interval fires `step` increments.

**`NeoProgressBar.test.ts`** — `direction` rendering (LTR/RTL/TTB/BTT); `track` shows background.

**`NeoProgressMark.test.ts`** — milestone position renders at correct `value`.

**`neo-progress-service.svelte.ts.test.ts`** — service unit: state transitions, idempotent `start`/`stop`.

#### 1.15 `stepper/`

**`NeoStepper.test.ts` (jsdom)** — `active` bindable; ArrowLeft/Right navigate; `onBeforeStep` can veto by returning false; `onStep` fires after change; `loop` wraps around; `loading[i]` shows spinner on step i; controls (next/prev/cancel) work; `vertical` layout.

**`NeoStepper.browser.test.ts`** — swipe gesture triggers step change at threshold; partial swipe snaps back.

#### 1.16 `loading/`

**`NeoSuspense.test.ts` (jsdom)** — pending: shows nothing before `delay`, shows `loading` snippet after; resolved: renders `result`/`children` with value; rejected: renders `error` with reason.

**`NeoLazy.browser.test.ts`** — IntersectionObserver triggers visibility callback when scrolled into view; `threshold` honored.

**`NeoLoadingMatrix.test.ts`** — renders SVG.

#### 1.17 `media/`

**`NeoImage.test.ts` (jsdom)** — `src` renders `<img>`; `alt` set; `onload` flips `loaded`; `onerror` flips `error` and swaps to `fallback`; `delay` defers `src` assignment; `showAltText` shows alt as fallback content.

**`NeoMedia.test.ts`** — image/video/audio rendering branches.

#### 1.18 `providers/`

**`NeoThemeProvider.test.ts` (jsdom + `mockLocalStorage`)** — applies theme class to `target`; persists when `remember`; reads stored value on mount; `reset` clears storage; context propagates `theme` to consumers.

**`NeoThemeSelector.test.ts` / `NeoThemeSelectors.test.ts` / `NeoThemePicker.test.ts`** — selecting an option updates the provider's `theme`.

**`NeoSourceSelector.test.ts` / `NeoRememberSelector.test.ts` / `NeoResetSelector.test.ts` / `NeoTransitionSelector.test.ts`** — bindable updates fire correct provider methods.

**`neo-theme-provider-context.svelte.ts.test.ts`** — direct: theme switching, persistence read/write paths.

#### 1.19 `text/`

**`NeoEllipsis.test.ts`** — `lines` produces `-webkit-line-clamp` style.

**`NeoHtml.test.ts`** — renders provided HTML; sanitizer is invoked when supplied; XSS payload is stripped.

**`NeoMark.test.ts`** — text matching `marks` is wrapped in `<mark>`; case-insensitive flag.

**`NeoScrollShadow.browser.test.ts`** — top/bottom shadows toggle as scroll position changes.

**`NeoTypewriter.test.ts` (jsdom + fake timers)** — `write({ value })` resolves after expected character count × speed; `abort()` aborts via `AbortSignal`; events fire (`onStart`, `onType`, `onComplete`).

**`NeoTypewriter.browser.test.ts`** — real-frame timing smoke (assert progress, not exact ms).

**`typewriter.utils.test.ts`** — pure logic: character splitting, typo simulation, abort handling.

#### 1.20 `cards/` / `pill/` / `badge/` / `divider/` / `cursor/` / `containers/` / `skeletons/`

Smoke + prop tests (jsdom). One file per component:

- **`NeoCard.test.ts`** — elevation/glass/tinted props apply expected `data-*`/class.
- **`NeoPill.test.ts`** — same for pill variants.
- **`NeoBadge.test.ts`** — placement positioning class set; `value` snippet renders; `offset` `{x,y}` flows to inline style.
- **`NeoDivider.test.ts`** — `vertical` swaps orientation; `margin` style applied; label content rendered between bars.
- **`NeoCursor.test.ts` / `NeoCursorPointer.test.ts`** — visual cursor element renders; tracks pointer position via `pointermove` events (jsdom-friendly because we set the position ourselves).
- **`NeoTransitionContainer.test.ts`** — wrapper passes children through; transition functions invoked on mount/unmount.
- **`NeoSkeletonContainer.test.ts` / `NeoSkeletonText.test.ts` / `NeoSkeletonMedia.test.ts`** — line count, ratio, animation class presence.

#### 1.21 `icons/`

One catch-all `icons/icons.test.ts` that:

- Iterates all named exports from `icons/index.ts`.
- For each, renders with default props and asserts an `<svg>` is produced with sane `viewBox`, `aria-hidden` (or `role="img"` + label when `title` prop is given).
- Spot-tests two animated icons (`NeoIconCircleLoading`, `NeoIconBouncingDots`) for animation-class presence.

Avoid one test file per icon — it's repetitive and gives no extra signal.

#### 1.22 `form/`

**`NeoForm.test.ts` (jsdom)** — `onsubmit`/`onreset` fire; `validate()` exposed on ref aggregates field validity; `context` bindable surfaces field registry; submit blocked when any field invalid.

**`NeoFieldSet.test.ts`** — `legend` rendered; `borderless` removes border style.

**`neo-form-context.svelte.ts.test.ts`** — register/unregister, validity aggregation.

#### 1.23 `utils/`

Pure-function tests, one file per util module. All in jsdom (none need a DOM):

- **`shadow.utils.test.ts`** — `coerce`, `computeShadowElevation`, `computeHoverShadowElevation`, `computeGlassFilter`, `isShadowFlat`, `parseBlur`, `getDefaultElevation` — table-driven with the documented constants (`DefaultShadowElevation` etc.) covered explicitly.
- **`style.utils.test.ts`** — `toSize` parses `px`/`%`/`em`/`rem`/min/max forms; `toPixel` numeric conversion; round-trip cases.
- **`border.utils.test.ts`** — `computeBorderRadius` accepts number/string/object inputs.
- **`colors.utils.test.ts`** — `getColorVariable` mapping for known color tokens; falls back to raw color for unknown.
- **`transition.utils.test.ts`** — exported preset shape (duration, easing) is stable.
- **`action.utils.test.ts`** — `toAction`/`toActionProps`/`toTransition`/`toTransitionProps` normalize various inputs (function, tuple, object).
- **`logger.utils.test.ts`** — calls underlying console methods; respects log-level toggle.
- **`error.utils.test.ts`** — error constants are stable identifiers.
- **`regex.utils.test.ts`** — `ArrowPrefix` matches expected strings (and rejects others).

Skip: `html-element.utils.ts` (types only).

#### 1.24 `src/lib/index.ts`

Replace the existing `describe.todo` with a real test: re-import `* as lib`, snapshot the **set of exported names** (not their values) so accidental removal/rename is caught. This is the only place a snapshot is appropriate — public API surface.

---

## Phase 1 exit criteria

- All test files green on **current** code (skeleton lib still installed).
- CI runs both `unit` and `browser` projects on PR.
- For every directory listed in 1.1–1.24, at least one `.test.ts` exists and asserts on observable behavior (not just imports/smoke).
- Floating-ui consumer files (1.1, 1.2, 1.3) have full coverage of the interaction matrix (hover/focus/click × keep-open variants × placement × ARIA × dismiss). This is the gate for Phase 2.
- `pnpm test` is green; total runtime is monitored but not gated.

## Critical files added in this phase

- `vite.config.ts`, `package.json`, `tsconfig.test.json`
- `test/setup.unit.ts`, `test/setup.browser.ts`
- `test/helpers/{render,floating,inputs,pointer,mocks}.ts`
- ~120 `*.test.ts` and ~25 `*.browser.test.ts` files co-located with components in `src/lib/**`

## Decision log: CSS class assertions in jsdom (added 2026-05-15)

Question raised mid-Phase-1: are jsdom assertions like `expect(...).toHaveClass('neo-horizontal')` real tests, or should they be deferred to browser/visual-regression coverage?

**Decision:** keep prop→class binding assertions in jsdom; delete tautologies; defer paint/layout outcomes to browser tests.

Three categories, three policies:

1. **KEEP — prop/state → class bindings.** When a public prop, enum, or state value drives the class (`direction="horizontal"` flips `.neo-horizontal` ↔ `.neo-vertical`, `disabled={true}` toggles `.neo-disabled`, an `it.each` matrix over `variant`), the class IS the contract. Class names are part of the public API of a Svelte component library — downstream consumers target `.neo-button` to override styles, so renaming silently breaks them. jsdom is also the only place where the prop-to-DOM wiring is tested at all; VR can't isolate "prop binding broke" from "SCSS edit changed pixels". Cost of these tests: ~5ms each, deterministic.
2. **DELETE — tautologies.** A test that calls `render(NeoCard)` with no props and asserts `.neo-card` exists in the DOM is the same string asserted as itself. It catches nothing — neither a prop regression (no prop drives it) nor a visual regression (jsdom can't paint). Deciding question: _"Does this test fail if I change a prop default, or only if I rename a class string in the template?"_ If only the latter, it's a tautology.
3. **DEFER — visual-outcome assertions.** Anywhere a class is being asserted as a proxy for "looks correct" (real shadow elevation, real flex-row layout, transition timing, glass blur, real flip behavior at viewport edges). Move to `*.browser.test.ts` and assert the visual outcome directly (rect deltas, computed styles, screenshots).

**Audit results:** see [`css-assertion-audit.md`](./css-assertion-audit.md).

- 20 tautological `it()` blocks flagged for deletion (default-render "asserts hardcoded host class" patterns across 20 files).
- ~225 binding `it()` blocks confirmed as KEEP — they form the documented public override contract.
- 0 visual-defer cases at the `it()` level: this codebase's existing convention (line 21 above) already excludes visual proxies from jsdom.

**Action items added by this decision:**

- **§1.25 (NEW) — Tautology cleanup pass.** Delete the 20 `it()` ranges listed in `css-assertion-audit.md` "Tautologies to delete". Land as a single commit `test(cleanup): drop tautological class-presence assertions`. Conservative: when in doubt, keep.
- **Browser test backlog expansion.** The audit surfaced additional browser-test candidates beyond the §1.1/§1.2 entries already captured. They belong in §1.25b below, not in core Phase 1, because they exercise visual/paint contracts (not the floating-ui swap surface) — Phase 2 doesn't depend on them being green.

### §1.25b — Additional browser-test candidates (deferred backlog)

Not a Phase 2 gate. Land opportunistically once the browser project (set up for §1.1's NeoTooltip browser test) exists. Each entry: component → what specifically requires browser-mode.

- `NeoCursorPointer` — real `PointerEvent.pressure`/`tiltX` traversal; jsdom can't fire these reliably.
- `NeoTabsRow` — overflow/collapse computation depends on real container width via `ResizeObserver`.
- `NeoBadge` — anchor-relative placement, requires real layout boxes.
- `NeoCard` / `NeoMedia` / `NeoPill` — elevation/shadow visual regression on hover/active/pressed transitions.
- `NeoSkeletonText` / `NeoSkeletonMedia` — shimmer animation visual regression (paint timing, gradient).
- `NeoPortalContainer` — real `dialog.showModal()` focus-trap and backdrop hit-testing.
- `NeoHandle` — real pointer-drag move/release for sheet/drawer resize.
- `NeoIconArrow` — SMIL `<animate>` actually running; jsdom only confirms element presence.
- `NeoFilePickerCard` — `dragenter`/`dragleave`/`drop` swap visuals.
- `NeoLoadingMatrix` — keyframe paint regression.

These are visual contracts; if a future change breaks them silently, VR catches it. They are not a substitute for the binding tests in jsdom — they complement them.

## Handoff into Phase 2

When this phase is done, the suite serves as the executable contract for Phase 2's swap. Read [`phase-2.md`](./phase-2.md) next — it assumes:

- Both Vitest projects exist and are green.
- Co-location convention is in effect.
- Helpers in `test/helpers/` are available (especially `floating.ts` and `pointer.ts`).
