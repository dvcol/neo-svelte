# CSS class-assertion audit (Phase 1 prep)

Scope: all `src/lib/**/*.test.ts` files containing class-querying patterns. Classification rule applied per `phase-1.md` lines 14-32.

- **DELETE** = tautology: static template renders its hardcoded class with no prop driving the assertion. Same string asserted as itself.
- **KEEP** = binding: a prop/state value drives the class on/off. Flipping the prop flips the assertion. The class is the public contract for downstream style overrides.
- **DEFER** = visual proxy: assertion attempts to verify a visual outcome (layout, paint) via class presence. Move to `*.browser.test.ts`.

When in doubt, the entry is KEEP. Conservative bias on DELETE.

---

## Tautologies to delete

Each entry: default-render `it()` blocks that assert a hardcoded template class with no prop pivot.

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cards/NeoCard.test.ts:13-22` — "renders the host with .neo-card …" — default render asserts the bare host class.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/badge/NeoBadge.test.ts:21-27` — "renders the inner pill with .neo-badge-pill class" — static markup; no prop drives the inner pill class.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoButtonRow.test.ts:17-22` — default `.neo-button-group` host assertion with no opposing-prop case.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoVariantButtons.test.ts:50-56` — `.neo-cancel-button` default-render presence.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoVariantButtons.test.ts:74-80` — `.neo-close-button` default-render presence.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/collapse/NeoAccordion.test.ts:18-22` — default `.neo-accordion` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/collapse/NeoCollapse.test.ts:13-17` — default `.neo-collapse` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/containers/NeoTransitionContainer.test.ts:12-18` — default container class assertion (no prop pivot).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/common/NeoFloatingStepper.test.ts:30-33` — default `.neo-floating-stepper` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoNativeSelect.test.ts:16-21` — default `.neo-input-group` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoLabel.test.ts:17-22` — default label render asserts hardcoded class only.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoListBaseSection.test.ts:12-21` — default `.neo-list-section` host assertion (label-text part is a binding; class line is tautology).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoSimpleList.test.ts:18-23` — default `.neo-list` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoVirtualList.test.ts:12-18` — default `.neo-virtual-list` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/loading/NeoLoadingMatrix.test.ts:12-20` — default `.neo-loading-matrix` render with hardcoded class.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/media/NeoMedia.test.ts:14-20` — default `.neo-media` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/pill/NeoPill.test.ts:12-19` — default `.neo-pill` host element + tag assertion (tag pivot is a binding; the tag-default `it` collapses to tautology).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/skeletons/NeoSkeletonMedia.test.ts:12-16` — default `.neo-skeleton-media` host assertion.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/skeletons/NeoSkeletonText.test.ts:12-18` — default `.neo-skeleton-text` + paragraph/line counts (count branch is a binding via `lines`/`paragraphs`; the bare class line is tautology — keep the count subtests).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/text/NeoTypewriter.test.ts:12-19` — default `.neo-typewriter` host assertion.

Total tautology `it()` ranges flagged: **20**.

---

## Bindings to keep

These pin prop/state → class wiring. The class is the public override contract; flipping the prop flips the assertion. Listed by component (representative line ranges, not exhaustive).

### Cards / containers / media

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cards/NeoCard.test.ts` — `rounded`, `glass`, `tinted`, `filled`, `borderless`, `disabled`, `skeleton`, `horizontal`, `start`, `pressed`, `convex`, `elevation` matrix, `hover` matrix.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/media/NeoMedia.test.ts` — `rounded`, `glass`, `filled`, `tinted`, `borderless`, `pressed`, `flat`, `inset`, `start`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/containers/NeoTransitionContainer.test.ts` — `reverse=true → .neo-reverse`.

### Buttons

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoButton.test.ts` — `readonly`, `loading`, `propagation=false`, `toggle=true → .neo-toggle`, `checked → .neo-pressed`, Enter keydown → `.neo-pressed`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoButtonRow.test.ts` — `vertical → .neo-vertical`, `divider` mode, `segmented`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/buttons/NeoVariantButtons.test.ts` — `direction=right → .neo-content.neo-reverse`, `direction=left` absence; `inline=true → .neo-inline`.

### Collapse / Tabs / Nav

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/collapse/NeoAccordion.test.ts` — `horizontal`, `segmented`, `borderless`, `rounded`, `glass`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/collapse/NeoCollapse.test.ts` — `horizontal`, `disabled`, `readonly`, `fade=true/false`, `divider`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/nav/NeoTabs.test.ts` — `line`, `pill`, `slide`, `vertical`.

### Cursor

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cursor/NeoCursor.test.ts` — `target` undefined produces wrapper, defined skips it.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cursor/NeoCursorPointer.test.ts` — `show=false/true` gating, `pressure + touching` matrix, `data-cursor`/`data-transition`/`data-snapping` reflections, x/y/width/height CSS-var forwarding.

### Divider

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/divider/NeoDivider.test.ts` — `vertical`, `rounded=true/false`, `elevation=0 → .neo-flat`, `skeleton`, `glass`.

### Floating

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/common/NeoConfirm.test.ts` — `closable` matrix, `rounded=true/false`, `loading.cancel/confirm` matrix.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/common/NeoFloatingStepper.test.ts` — `header`, `closable` matrix, `progress=false` hides `.neo-stepper-progress`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/common/NeoHandle.test.ts` — `visible=true/false` divider rendering.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/notification/NeoSimpleNotification.test.ts` — `title`/`subtitle`/`content` rendering, `close=false` omits `.neo-notification-close-button`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/portal/NeoPortalContainer.test.ts` — `scale=true/false → .neo-scale`, `openDialog → data-open + .neo-open`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/tooltips/NeoPopSelect.test.ts` — `search=true/false → .neo-list-search`, items.length empty-state.

### Icons

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/icons/NeoIconArrow.test.ts` — `direction` matrix, `expanded=true/false`, `chevron`, `enter=true/false`.

### Inputs

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoCheckbox.test.ts` — `rounded`, `loading → .neo-checkbox-loading + .neo-checkbox-suffix`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoColorPickerSelector.test.ts` — `rounded → .neo-rounded`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoFilePicker.test.ts` — `expanded=true → .neo-file-picker-card`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoFilePickerCard.test.ts` — empty placeholder, dragging swap, edit/add buttons.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoPin.test.ts` — `groups>1 → .neo-vertical`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoRadio.test.ts` — `disabled → .neo-disabled`, `loading → .neo-radio-loading` (line 66-73 retain the `it.skip` bug pin per global rule).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoRange.test.ts` — `tooltips=false/true` element gating.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoSelect.test.ts` — `search=true/false`, `clearable=true + selection → .neo-affix-clear`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoSwitch.test.ts` — `loading → .neo-switch-loading`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoAffix.test.ts` — `skeleton → .neo-skeleton`, `loading → .neo-affix-loading`, `valid → data-valid`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoBaseInput.test.ts` — `hide → .neo-hide`, `before/after → .neo-before/.neo-after`, `display="text" → .neo-input-display-input`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoInput.test.ts` — floating label state, `disabled`, `readonly`, `rounded`, `glass`, `tinted`, `skeleton`, `borderless`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoInputValidation.test.ts` — visibility/error gating.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoLabel.test.ts` — `required`, `disabled`, `valid`/`invalid`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/common/NeoValidation.test.ts` — disabled gating, error/message precedence.

### List

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoList.test.ts` — empty placeholder when `items=[]`, loader when `loading=true`, sections with title.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoListBaseItem.test.ts` — `onclick → .neo-button`, `select=true → .neo-list-item-checkmark`, `disabled → .neo-disabled`, `reverse → .neo-reverse`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoListBaseLoader.test.ts` — `description=true/false → .neo-description`, `before`, `after`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoListBaseSection.test.ts` — `sticky=true → .neo-sticky`, `reverse → .neo-reverse`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoSimpleList.test.ts` — empty/loader/flip branches.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/list/NeoVirtualList.test.ts` — scrollbar/shadow/dim flags.

### Loading

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/loading/NeoLazy.test.ts` — pending → `.neo-loading-matrix`, resolved → null.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/loading/NeoSuspense.test.ts` — `delay`/`showLoading` state-driven gating.

### Pill / Badge

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/pill/NeoPill.test.ts` — `tag` override, `size` data-type matrix, `close + onClose`, `close + disabled`, `loading`, `rounded=true/false`, `borderless`, `text → borderless+flat`, `disabled`, `skeleton`, `pressed → inset`, `reverse`, `glass`, `tinted`, `filled`, `start`, `elevation` matrix, `hover>0 → .neo-hover`, icon-only → `.neo-empty`/`.neo-only`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/badge/NeoBadge.test.ts` — `containerProps.tag`, children rendering.

### Skeletons

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/skeletons/NeoSkeletonMedia.test.ts` — `rounded → .neo-rounded`, `circle → .neo-circle`, `glass → .neo-glass`, `type → icon` matrix, default aspect-ratio per `type`, `disabled` bypass.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/skeletons/NeoSkeletonText.test.ts` — `lines` / `paragraphs` / `lines:[]` count wiring, `alt=true` 26-line fallback, `title=true/false`, `justify`, `alt`, `glass`, `disabled` bypass.

### Text

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/text/NeoScrollShadow.test.ts` — `direction=vertical/horizontal`, `shadow=true/false`, `scrollbar=true/false`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/text/NeoTypewriter.test.ts` — `caret=true/false → .neo-caret`.

Total binding `it()` blocks across the suite (rough): **~225**.

---

## Visual-outcome assertions (defer to browser tests)

The team's existing convention (see `phase-1.md` line 21) explicitly forbids using class presence as a layout/visual proxy in jsdom — positioning uses `data-placement` and measured rect deltas in browser tests. As a result, virtually every class assertion in the suite already pins a contract, not a visual outcome. Sweep yields effectively **zero** clear DEFER cases at the `it()` level. Adjacent visual concerns (elevation/shadow paint, layout collapse, animation frames) are listed under "Proposed browser tests" below rather than re-tagged here.

Total visual-defer `it()` blocks: **0**.

---

## Proposed browser tests (beyond NeoTooltip + NeoMenu)

`phase-1.md` lines 96-115 already proposes browser coverage for `NeoTooltip`, `NeoMenu`, `NeoRange`, `NeoSelect`, `NeoButton`, `NeoFilePicker`, `NeoCollapse`, `NeoTabs`, `NeoStepper`, `NeoNotificationStack`, `NeoList`, `NeoVirtualList`, `NeoLazy`, `NeoScrollShadow`, `NeoTypewriter`, `NeoDialog`, `NeoDrawer`, `NeoProgress`, `NeoInput`. Additional candidates surfaced by this audit:

- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cursor/NeoCursorPointer.svelte` → real `pointermove` / contact pressure / tilt traversal; jsdom cannot fire `PointerEvent.pressure`/`tiltX` reliably.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/nav/NeoTabsRow.svelte` → overflow/collapse computation depends on real container width via `ResizeObserver`.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/skeletons/NeoSkeletonText.svelte` and `NeoSkeletonMedia.svelte` → shimmer animation visual regression (paint timing, gradient).
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/badge/NeoBadge.svelte` → anchor-relative placement, requires real layout boxes.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/cards/NeoCard.svelte` (and `NeoMedia`, `NeoPill`) → elevation/shadow visual regression on hover/active/pressed transitions.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/portal/NeoPortalContainer.svelte` → real `dialog.showModal()` focus-trap and backdrop hit-testing.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/floating/common/NeoHandle.svelte` → real pointer-drag move/release for sheet/drawer resize.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/icons/NeoIconArrow.svelte` → SMIL `<animate>` actually running; jsdom only confirms element presence.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/inputs/NeoFilePickerCard.svelte` → `dragenter`/`dragleave`/`drop` swap visuals.
- `/Users/dinh-van.colomban/Workspace/private/neo-svelte/src/lib/loading/NeoLoadingMatrix.svelte` → keyframe paint regression.
