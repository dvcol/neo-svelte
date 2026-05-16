# Phase 7 — Input family

**Status**: ✅ complete

Migrating 4 producers + 4 consumers in one phase to keep the input tree compilable end-to-end.

## Producer files

- `src/lib/inputs/common/NeoBaseInput.svelte:200-203` — drop `Object.assign(ref, { mark, clear, change, validate })`.
- `src/lib/inputs/common/NeoTextarea.svelte:313-316` — drop `Object.assign(ref, { …, resize: resizeHeight })`. Promote `resize` to `export const resize = resizeHeight`.
- `src/lib/inputs/NeoPin.svelte:335-338` — drop `Object.assign(ref, { clear, validate })`. Promote `clear` to `export const`.
- `src/lib/inputs/NeoRange.svelte:345-351` — drop `Object.assign(ref, { stepUp, stepDown })`.
- Models — drop `NeoInputHTMLElement<T>`, `NeoTextareaHTMLElement<T>`, `NeoRangeHTMLElement<T>`.

## Consumer files

- `src/lib/inputs/common/NeoInput.svelte:153` — `ref?.clear?.()` → bind `baseInputInstance`, call `.clear()`. Line 163's `ref?.showPicker?.()` stays (native API on DOM ref).
- `src/lib/inputs/NeoSelect.svelte:127` — `next: () => ref?.validate?.()` → `instance.validate()`.
- `src/lib/inputs/NeoNumberStep.svelte:98` — `ref?.validate?.()` → `instance.validate()`.
- `src/lib/inputs/NeoFilePicker.svelte:129` — `ref?.clear?.()` → `instance.clear()`.
- `src/lib/inputs/NeoPin.svelte:152,175,187,201,255,268` — `refs[g][c]?.{change,clear,mark}?.(…)` → `instances[g][c].<method>(…)`.
- NeoNativeSelect / NeoDateTime native `showPicker` — keep on DOM ref.

## Red tests

Producer suites (`NeoBaseInput.test.ts`, `NeoTextarea.test.ts`, `NeoPin.test.ts`, `NeoRange.test.ts`):

1. Each method on instance. Anti-pattern lock per method.
2. `validate()` returns `NeoInputState`; reflects `dirty`, `touched`, `valid`, custom `validators`.
3. `clear()` clears value, fires input event.
4. `change(value, event)` updates value, calls `oninput`, returns updated state.
5. `mark({touched})`, `mark({dirty})` set state without value change.
6. NeoTextarea `resize()` adjusts `style.height` based on content.
7. NeoRange `stepUp(index)`/`stepDown(index)` for both single and dual-thumb modes.
8. NeoPin `clear()` cascades through every cell of grid.
9. NeoPin `change('1234')` fills cells in order (cross-cell propagation).
10. Matrix per input: `disabled × readonly × required × minlength/maxlength × pattern × initial value × dirty × touched × validate-on-input/blur/change`.

Consumer suites:

11. NeoInput: clear button click drives `baseInputInstance.clear()`; native `showPicker` still hits DOM input.
12. NeoSelect: `next` callback drives `instance.validate()`.
13. NeoNumberStep: step buttons drive `instance.validate()`.
14. NeoFilePicker: clear button drives `instance.clear()`.
15. NeoPin: `instance.clear()` cascades through grid (spy on each `instances[i][j].clear`).

## Migration

1. Drop all 4 `Object.assign(ref, …)` mutations.
2. Add `export const clear` in NeoPin, `export const resize` in NeoTextarea.
3. Update consumers to bind `instance` alongside DOM `ref`.
4. Convert NeoPin's `refs: NeoInputHTMLElement[][]` to `instances: NeoBaseInput[][]`.
5. Drop models' alias types.

## Verification

```bash
pnpm vitest run src/lib/inputs
rg -n 'Neo(Input|Textarea|Range)HTMLElement' src demo
rg -n 'Object\.assign\s*\(\s*ref' src/lib/inputs
```

## Status checklist

- [x] Red tests for all 4 producers
- [x] Red tests for 4 consumers
- [x] All 4 mutations removed
- [x] Promotions added (clear, resize)
- [x] Consumer bindings migrated (5 files)
- [x] NeoPin grid migrated
- [x] Tests green
- [x] Grep clean
- [x] Commit pushed
