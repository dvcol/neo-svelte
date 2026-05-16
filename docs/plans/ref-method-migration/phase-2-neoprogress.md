# Phase 2 — NeoProgress / NeoProgressBar

**Status**: ✅ complete

## Files

- `src/lib/progress/NeoProgress.svelte:267-277` — drop `$effect → Object.assign(ref, …)`.
- `src/lib/progress/NeoProgressBar.svelte` — same pattern via internal `instance: NeoProgress`; drop & re-export instance methods.
- `src/lib/progress/neo-progress.model.ts` — drop `NeoProgressHTMLElement<Tag>`.

Methods (`start`, `stop`, `reset`, `cancel`, `change`, `complete`) are already exported (lines 114–193 in NeoProgress).

## Red tests (`NeoProgress.test.ts` + harness)

1. Capture instance; `typeof instance.<each method> === 'function'`.
2. Anti-pattern lock: methods not on DOM ref.
3. End-to-end: `start({pending:false, expire:50})` flips status to Active, `complete()` resolves to Success, `cancel()` resolves to Cancelled.
4. `reset(restart=true)` resumes a previously stopped run (status returns to Active).
5. `change({value, buffer, state})` updates `value`, `buffer`, `status` independently.
6. Matrix: `indeterminate × buffer × pending × defer-on-complete × initial-status × timeout`.
7. Status transitions exhaustive: Idle→Active→Success/Error/Warning/Cancelled, with `reset` returning to Idle.
8. NeoProgressBar harness: instance method calls forward to inner NeoProgress.

## Migration

1. Delete the `$effect` mutation block.
2. Confirm NeoProgressBar's `export function reset(…)` etc. all call `instance.<method>()` (already correct).
3. Drop the model alias.

## Verification

```bash
pnpm vitest run src/lib/progress
rg -n 'NeoProgressHTMLElement' src demo
rg -n 'Object\.assign\s*\(\s*ref' src/lib/progress
```

## Status checklist

- [x] Red tests added & failing
- [x] Mutation removed
- [x] Tests green
- [x] Type-check green
- [x] Grep clean
- [x] Commit pushed
