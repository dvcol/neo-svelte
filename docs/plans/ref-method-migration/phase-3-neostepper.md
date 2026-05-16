# Phase 3 — NeoStepper

**Status**: ✅ complete

## Files

- `src/lib/stepper/NeoStepper.svelte:257-264` — drop `$effect → Object.assign(ref, { goTo, previous: goPrevious, next: goNext })`.
- `src/lib/stepper/neo-stepper.model.ts` — confirm/drop `NeoStepperHTMLElement` if it exists.

`goTo`, `goPrevious`, `goNext` are already `export const` (170, 188, 194). The `previous`/`next` aliases on the ref must be exposed as additional component-instance exports if any consumer used them — check via grep before deleting.

## Red tests

1. Instance API: `goTo`, `goPrevious`, `goNext` exist as functions; calls return promises resolving to `NeoStepperEvent | undefined`.
2. Anti-pattern lock.
3. `goTo(2)` triggers transition to step 2; `beforeStep` async hook is awaited; `loading` flag flips during transition.
4. `goPrevious` / `goNext` respect `linear` mode boundaries.
5. Hidden / disabled steps are skipped by `goNext`.
6. Aborting a transition via `signal` rejects gracefully.
7. Matrix: `linear × loading × beforeStep-promise × validate × disabled steps × hidden steps × initial active`.

## Migration

1. Delete the `$effect` mutation.
2. If `previous`/`next` aliases are used in lib/demo, add `export const previous = goPrevious; export const next = goNext;`.
3. Drop alias type.

## Verification

```bash
pnpm vitest run src/lib/stepper
rg -n '\.previous\?\.\(|\.next\?\.\(' src demo  # find any alias consumers
rg -n 'Object\.assign\s*\(\s*ref' src/lib/stepper
```

## Status checklist

- [x] Red tests added & failing
- [x] Alias consumer audit done — no consumers used `previous`/`next` aliases; safe to drop without re-export
- [x] Mutation removed
- [x] Tests green
- [x] Grep clean
- [x] Commit pushed
