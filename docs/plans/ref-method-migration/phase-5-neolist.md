# Phase 5 — NeoSimpleList → NeoList

**Status**: ✅ complete

## Files

- `src/lib/list/NeoSimpleList.svelte:158-164` — drop `$effect → Object.assign(ref, { scrollToTop, scrollToBottom })`.
- `src/lib/list/NeoList.svelte:275-281` — drop the larger mutation that adds 5 methods.
- `src/lib/list/neo-list.model.ts` — drop `NeoListHTMLElement<Value, Tag>`.

`scrollToTop`/`scrollToBottom` already exported. `selectItem`, `clearItem`, `reSelect` are local consts in NeoList — promote to `export const`.

## Red tests

NeoSimpleList:

1. Instance API: `scrollToTop`, `scrollToBottom` functions resolving to `HTMLElement | false`.
2. Anti-pattern lock.
3. End-to-end: `scrollToTop()` actually drives `scrollTop = 0` (verify in jsdom via stub or browser project for real).
4. Matrix: `items.length=0/1/many × debounce × ScrollToOptions.behavior`.

NeoList: 5. `selectItem(item)` mutates `selected`; emits `onSelect`. 6. `clearItem(item)` removes from `selected`. 7. `reSelect()` re-runs select for current `selected` value. 8. Matrix: `select × multiple × items.length × highlight × filter × sort × sectioned vs flat × loadingProps`. 9. NeoPopSelect indirect coverage: `instance.update` is now what propagates after select changes (handled in Phase 8).

## Migration

1. Delete `$effect` mutations in both files.
2. Add `export const selectItem`, `export const clearItem`, `export const reSelect` in `NeoList.svelte`.
3. Drop the model alias.

## Verification

```bash
pnpm vitest run src/lib/list
rg -n 'NeoListHTMLElement' src demo
rg -n 'Object\.assign\s*\(\s*ref' src/lib/list
```

## Status checklist

- [x] Red tests added & failing
- [x] Mutations removed
- [x] Local consts promoted to exports (selectItem / clearItem / reSelect)
- [x] Tests green
- [x] Grep clean
- [x] Commit pushed
