# Phase 8 — NeoTooltip + consumers

**Status**: ✅ complete

## Files

- `src/lib/floating/tooltips/NeoTooltip.svelte:257-269` — drop `addMethods` helper + both `$effect` calls (on `ref` and `triggerRef`).
- `src/lib/floating/tooltips/neo-tooltip.model.ts` — drop `NeoTooltipMethods` interface and `NeoTooltipHTMLElement<T>` alias. Update `NeoTooltipProps.triggerRef` to plain `HTMLElement`.
- Consumer 1: `src/lib/floating/menu/NeoMenu.svelte:84-87,104` — replace `triggerRef?.toggle?.(…)` with `tooltipInstance.toggle(…)`. Add `let tooltipInstance = $state<NeoTooltip>()` + `bind:this={tooltipInstance}`.
- Consumer 2: `src/lib/floating/tooltips/NeoPopSelect.svelte:86` — replace `tooltipRef?.update?.()` with `tooltipInstance.update()`.
- Consumer 3: `src/lib/floating/menu/NeoMenuListItem.svelte:112-115` — `tooltipRef` continues to be the DOM HTMLElement (used by `getFocusableElement`); only retype.

`toggle`, `update` already exported (NeoTooltip:248, 253).

## Red tests

NeoTooltip (`NeoTooltip.test.ts`):

1. Instance API: `instance.toggle`, `instance.update`, `instance.floating` exposed.
2. Anti-pattern lock: `Object.hasOwn(domRef, 'toggle') === false` for both ref AND triggerRef.
3. **Rewrite existing assertions** at lines 107, 110, 128 (`tooltip.toggle?.(…)`) — the captured DOM element no longer has `.toggle`. Move them to instance-API tests.
4. `instance.toggle(true)` opens (DOM `[hidden]` cleared); `instance.toggle(false)` closes; return value is the resulting `open` state.
5. `instance.update()` returns the Popover's update promise; updates floating placement after viewport change.
6. Matrix: `openOnHover × openOnFocus × openOnClick × keepOpenOnHover × keepOpenOnFocus × keepOpenOnClick × closeOnDismiss × unmountOnClose × portal × placement('auto'|fixed)`.

Consumer suites:

7. `NeoMenu.test.ts`: keyboard `ArrowDown/Up/Left/Right` at every `position` (8 directions) drives `tooltipInstance.toggle(…)` — observed via `open` flip + `onChange`. `Tab` (with/without `shiftKey`) closes via `tooltipInstance.toggle(false)`.
8. `NeoPopSelect.test.ts`: changing `items` triggers `instance.update()` (spy); changing `selected` likewise. Verify floating reposition via `data-position`.
9. `NeoMenuListItem.test.ts`: keyboard `ArrowRight`/`ArrowLeft` opens/closes nested submenu; focus moves correctly via `getFocusableElement(tooltipRef)` (DOM-only path, unchanged).

## Migration

1. Delete `addMethods` + both `$effect` calls.
2. Drop `NeoTooltipMethods` interface and `NeoTooltipHTMLElement<T>` alias from model.
3. Update `triggerRef` typing in NeoTooltip + consumers to plain `HTMLElement`.
4. NeoMenu: add `let tooltipInstance = $state<NeoTooltip>()`, `bind:this={tooltipInstance}` on `<NeoTooltip>`, swap call sites.
5. NeoPopSelect: same.
6. NeoMenuListItem: keep `tooltipRef`, retype.

## Verification

```bash
pnpm vitest run src/lib/floating/tooltips src/lib/floating/menu
pnpm vitest run --project browser  # tooltip visual contract suite
rg -n 'NeoTooltipHTMLElement|NeoTooltipMethods' src demo
rg -n 'addMethods|Object\.assign\s*\(\s*element' src/lib/floating/tooltips
rg -n '\.toggle\?\.\(' src/lib/floating  # must be 0 inside lib code
```

## Status checklist

- [x] Red tests added & failing
- [x] addMethods deleted
- [x] Type aliases deleted
- [x] NeoMenu migrated
- [x] NeoPopSelect migrated
- [x] NeoMenuListItem retyped (alias removal cascades)
- [x] Existing tooltip.toggle?.() assertions rewritten
- [x] All tests green (jsdom)
- [x] Grep clean
- [x] Commit pushed
