# Phase 1 — NeoForm

**Status**: ✅ complete

Scope is limited to the NeoForm component's own ref mutation (truly leaf — no consumer references `NeoFormHTMLElement`). The form-context contract change (`field.ref?.validate?.()` → `field.validate?.()`) is **deferred to Phase 7**, where it lands atomically with the input-family mutations being removed.

## Files

- `src/lib/form/NeoForm.svelte:49-60` — drop the `$effect(() => Object.assign(ref, { context, validate }))` block.
- `src/lib/form/neo-form.model.ts:50` — drop the `NeoFormHTMLElement` type alias.
- `src/lib/form/NeoForm.test.ts:87-98` — rewrite the existing `(form).validate` / `(form).context` assertions to test the component-instance API instead.

## Red tests (`NeoForm.test.ts` + harness)

1. **Component-instance API** — capture instance via `onInstance` harness callback (mirror existing `onRef` pattern). Assert `typeof instance.context === 'object'`, `typeof instance.validate === 'function'`.
2. **Anti-pattern lock** — `Object.hasOwn(form, 'validate') === false`, `Object.hasOwn(form, 'context') === false`, `(form as any).validate === undefined`.
3. **`instance.validate()` returns aggregated `NeoValidationState`** — value/initial/touched/dirty/valid all sourced from registered fields.
4. **`instance.validate()` invokes registered fields' validate hooks** — register two fields with spy refs, call `instance.validate()`, both spies called once. (Form-context still uses `field.ref?.validate?.()` until Phase 7; we test through that path.)
5. **`instance.context` is the same instance** as the bindable `context` prop and as the `setNeoFormContext` symbol.
6. **`onreset` / `onsubmit`** still trigger `context.validate()` (regression from existing tests).

Phase 7 will append: field-deregistration on unmount, mismatched `form` prop ignored, full input-validate matrix.

## Migration

1. Drop the `$effect(() => Object.assign(ref, …))` block.
2. Add `export const validate = () => context.validate();` (or `export function validate()`).
3. `context` is already `export const context = setNeoFormContext(id)` — no change needed.
4. Drop `NeoFormHTMLElement` from `neo-form.model.ts`.
5. Update existing `NeoForm.test.ts:87-98` to read `validate` / `context` from the component instance, not from the DOM `<form>`.

## Verification

```bash
pnpm vitest run src/lib/form
rg -n 'NeoFormHTMLElement' src demo                 # must be 0
rg -n 'Object\.assign\s*\(\s*ref' src/lib/form      # must be 0
```

## Status checklist

- [x] Red tests added & failing
- [x] Mutation removed
- [x] `validate` exported on the component instance
- [x] `NeoFormHTMLElement` alias dropped
- [x] Existing DOM-ref `validate` / `context` assertions rewritten
- [x] Tests green
- [x] Type-check green
- [x] Anti-pattern grep clean
- [x] Commit pushed
