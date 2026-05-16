# Phase 4 — NeoCollapse

**Status**: ✅ complete

> Note: per audit, no consumer in `src` or `demo` referenced `ref.trigger` /
> `triggerRef.section` getters. The mutation block was deleted without
> re-exposing them on the component instance. If needed later, they can be
> added as `export const refs = { get section() {…}, get trigger() {…} }`.

## Files

- `src/lib/collapse/NeoCollapse.svelte:69-87` — drop **two** `$effect` mutations: one on `ref` (assigns `trigger` getter + `toggle`), one on `triggerRef` (assigns `section` getter + `toggle`).
- `src/lib/collapse/neo-collapse.model.ts` — drop `NeoCollapseHTMLElement<Tag>`.

`toggle` already exported (line 62). Need to expose `trigger` and `section` accessors as component-instance properties (e.g. `export const refs = { get section() {…}, get trigger() {…} }` or two `export const` getter helpers — match existing repo idiom).

## Red tests

1. Instance API: `toggle` is a function; `instance.section` returns the content element when mounted, `instance.trigger` returns the trigger button. Also assert `Object.hasOwn(ref, 'toggle') === false` and same for `triggerRef`.
2. `toggle()` flips `open`; `toggle(true)` opens, `toggle(false)` closes.
3. `disabled=true` blocks `toggle`.
4. `readonly=true` blocks `toggle`.
5. Group exclusivity: `standalone=false` + group context with `canOpen=true` makes opening one collapse close siblings.
6. `group.canOpen=false` prevents opening; `group.canClose=false` prevents closing.
7. `horizontal` swaps width/height transition.
8. `unmountOnClose=true` removes content from DOM when closed; `false` keeps it with `aria-hidden="true"`.
9. Matrix: `disabled × readonly × standalone × group × canOpen × canClose × horizontal × unmountOnClose`.
10. Group consumer test (`NeoCollapseGroup.test.ts`): opening one closes siblings; respects `canClose=false`.

## Migration

1. Delete both `$effect` blocks.
2. Add component-instance getters for `trigger` and `section` (return `triggerRef` and `ref` respectively).
3. Update any consumer importing `NeoCollapseHTMLElement` (likely none in lib).

## Verification

```bash
pnpm vitest run src/lib/collapse
rg -n 'NeoCollapseHTMLElement' src demo
rg -n 'Object\.assign\s*\(\s*(ref|triggerRef)' src/lib/collapse
```

## Status checklist

- [x] Red tests added & failing
- [x] Both mutations removed
- [x] Getters exposed on instance — skipped, no consumer used them
- [x] Tests green
- [x] Grep clean
- [x] Commit pushed
