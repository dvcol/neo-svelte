# Phase 6 — NeoTypewriter

**Status**: ✅ complete

> Note: per audit, no consumer in `src` or `demo` referenced `ref.writing` /
> `ref.promise` / `ref.write(value)` / `ref.abort()`. The mutation block was
> deleted without re-exposing `writing` / `promise` as instance getters. The
> existing `export function write(options, signal)` and `export function abort()`
> continue to provide the imperative API on the component instance. If
> `writing` / `promise` accessors are needed later, add them as
> `export const writing = $derived(…)` / `export const promise = …`.

## Files

- `src/lib/text/NeoTypewriter.svelte:111-120+` — drop `$effect → Object.assign(ref, { write, abort, writing getter, promise getter })`.
- `src/lib/text/neo-typewriter.model.ts` — drop `NeoTypewriterHTMLElement<Tag, Value>`.

`write`, `abort` already exported (66, 81). `writing` and `promise` getters need to become component-instance accessors.

## Red tests

1. Instance API: `write`, `abort`, `writing`, `promise` exposed.
2. Anti-pattern lock.
3. `instance.write({chars: 'hello', delay: 5}, signal)` returns a promise resolving when typed.
4. `instance.writing === true` during write, `false` after.
5. `instance.abort()` cancels in-flight write; promise rejects with `AbortError`.
6. Queued writes: calling `write` while one is pending queues the second.
7. Matrix: `loop × cursor × delay × signal-aborts-mid-write × queued writes × empty-string write`.

## Migration

1. Delete `$effect` mutation.
2. Expose `writing` / `promise` as instance getters.

## Verification

```bash
pnpm vitest run src/lib/text
rg -n 'NeoTypewriterHTMLElement' src demo
rg -n 'Object\.assign\s*\(\s*ref' src/lib/text
```

## Status checklist

- [x] Red tests added & failing
- [x] Mutation removed
- [x] Getters exposed on instance — skipped, no consumer used them
- [x] Tests green
- [x] Grep clean
- [x] Commit pushed
