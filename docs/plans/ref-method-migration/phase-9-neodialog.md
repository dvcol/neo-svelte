# Phase 9 — NeoDialog (highest-risk migration)

**Status**: ✅ done

NeoDialog is the only component whose migration changes runtime semantics (event-listener replacement of monkey-patches). Test target: **~80 cases minimum**.

## Files

- `src/lib/floating/dialog/NeoDialog.svelte:274-319` — `$effect.pre` block that:
  - `Object.defineProperty(ref, 'returnValue', { get/set })`
  - `ref.reset = moving.reset`
  - Monkey-patches `ref.show`, `ref.showModal`, `ref.close`, `ref.requestClose` to sync `open` / `modal` / `returnValue`.
- `src/lib/floating/dialog/neo-dialog.model.ts:18` — drop `NeoDialogHTMLElement = HTMLDialogElement & { requestClose?, reset? }`. Replace `NeoDialogContext.ref` and `NeoDialogProps.ref` types with `HTMLDialogElement`.
- `src/lib/floating/dialog/neo-dialog-stepper.model.ts:29` — `dialogRef` retypes.
- 4 test harnesses already importing `NeoDialogHTMLElement`:
  - `NeoDialog.test.svelte`, `NeoDialogConfirm.test.svelte`, `NeoDialogStepper.test.svelte`
  - `NeoDrawer.test.svelte`, `NeoDrawerConfirm.test.svelte`, `NeoDrawerStepper.test.svelte`
- `demo/components/floating/dialog/DemoDialog.svelte:196` — `refs.map(ref => ref?.reset?.({translate:true}))` → bind `dialogInstances[]`, call `.reset(…)`.

## Replacement strategy

1. **Listen to native events** on the dialog element to sync `open` (and `returnValue`):
   ```text
   onCloseSync(e):
     if (open) open = false
     if (ref?.returnValue !== undefined) returnValue = ref.returnValue
     onclose?.(e)
   onCancelSync(e):
     if (open) open = false
     oncancel?.(e)
   ```
   Native `<dialog>` fires `'close'` and `'cancel'` whenever anyone calls `ref.close()` / `requestClose()` — script or browser.
2. **Component-instance exports**:
   ```ts
   export const reset = moving.reset;
   export function requestClose(value?: string) {
     if (value !== undefined) returnValue = value;
     if (ref?.requestClose) return ref.requestClose(value);
     ref?.dispatchEvent(new Event('cancel', { bubbles: false, cancelable: true }));
     return ref?.close?.(value);
   }
   // returnValue accessor — match repo idiom (e.g. accessor object)
   ```
3. **Drop the monkey-patch effect** (lines 274–319) entirely.

## Red tests (~80 minimum, partitioned by axis)

### Open/close drive paths (each tested for `tag='dialog'` AND `tag='div'`, `modal=true` AND `modal=false`)

1. `bind:open=true` calls native `showModal()` when modal, `show()` when non-modal.
2. `bind:open=false` calls native `requestClose()` if available, else `close()`.
3. `instance.requestClose()` flips `open=false` AND fires `cancel` then `close`.
4. **Regression-critical**: `ref.close('value')` directly → `open=false`, `returnValue='value'`, `close` event fires. Validates the event-listener replacement.
5. `ref.close()` no-args → `open=false`, `returnValue` unchanged.
6. `ref.showModal()` direct → `open=true`, `modal=true`.
7. `ref.show()` direct → `open=true`, `modal=false`.
8. Native dialog Escape → fires `cancel`+`close`; `open` flips once (no double-flip).
9. Non-native dialog Escape → window `keydown` listener fires `oncancel`; `open=false`.
10. Outside `pointerdown` with `closeOnClickOutside=true` AND `modal=true` AND non-native → closes.
11. Same with `closedby='none'` → does NOT close.
12. `closedby='any'` / `'closerequest'` reflected in `data-clicked-outside`.

### Return value plumbing

13. `bind:returnValue={x}`: `ref.close('foo')` sets `x='foo'`.
14. `instance.requestClose('bar')` sets `returnValue='bar'` and propagates to `ref.returnValue`.
15. Default `returnValue=''` when not bound.
16. Parent mutating `returnValue='baz'` flows into `ref.returnValue`; subsequent native `close()` returns `'baz'`.
17. Anti-pattern lock: `Object.getOwnPropertyDescriptor(ref, 'returnValue')` is the native one (not redefined).

### Reset (movable) plumbing

18. `instance.reset()` no-args resolves to boolean.
19. `instance.reset({translate: true})` propagates.
20. `instance.reset({placement: true})` propagates.
21. `instance.reset({translate: false, placement: true})` permutation.
22. `resetOnClose=true`: closing triggers `moving.reset()` once.
23. DemoDialog batch path: `Promise.all(dialogInstances.map(d => d.reset({translate:true})))` resolves with expected length array.

### Lifecycle & cleanup

24. `unmountOnClose=true`: re-mounting on each open re-attaches listeners; spy on `addEventListener('close')` count.
25. Component unmount cleans up `pointerdown` / `keydown` window listeners.
26. Re-binding `bind:this` to a different instance keeps listeners scoped.

### Anti-pattern locks

27. `Object.hasOwn(ref, 'reset') === false` (no longer mutated).
28. Native `ref.show`, `ref.showModal`, `ref.close`, `ref.requestClose` are the prototype methods, not own-properties.
29. `Object.hasOwn(ref, 'requestClose') === false` (was mutated when polyfilled).

### Matrix (each axis crossed minimum once)

30–60. `tag('dialog'|'div') × modal × unmountOnClose × closeOnClickOutside × closedby × movable.enabled × full × placement(8 values)`. Stratified to keep test count ≤ ~80 — pick representative combinations (e.g. modal-native + non-modal-non-native + edge cases for closedby).

### Drawer variants (smaller smoke suite each)

61–70. NeoDrawer, NeoDrawerStepper, NeoDrawerConfirm: open/close, requestClose, returnValue propagation, reset.

### Browser project

71–80. Real focus-trap, modal stacking, body-scroll-lock, snap-to-corner movable — already covered; assert post-migration parity.

## Migration steps

1. Add red tests above; run → expect failures on the new instance-API tests.
2. Replace monkey-patch `$effect.pre` with native `'close'` / `'cancel'` listeners on the `<svelte:element>`.
3. Add `export const reset`, `export function requestClose`, `returnValue` accessor.
4. Drop `NeoDialogHTMLElement` from model.
5. Update `dialogRef` typing in NeoDialogStepper / NeoDrawer / NeoDrawerStepper / NeoDrawerConfirm + their test harnesses.
6. DemoDialog: bind `dialogInstances[]`, swap reset call.
7. Run all tests including browser project; confirm parity.

## Verification

```bash
pnpm vitest run src/lib/floating/dialog src/lib/floating/drawer
pnpm vitest run --project browser
rg -n 'NeoDialogHTMLElement' src demo                     # 0
rg -n 'Object\.(defineProperty|assign)\s*\(\s*ref' src/lib/floating/dialog  # 0
rg -n 'ref\.(show|showModal|close|requestClose|reset)\s*=' src/lib/floating/dialog  # 0
```

## Status checklist

- [x] Red tests written (~80 cases)
- [x] Red tests failing as expected
- [x] Monkey-patch block removed
- [x] Native event listeners wired
- [x] reset / requestClose / returnValue accessor exposed
- [x] Model alias dropped
- [x] 6 consumer files retyped
- [x] DemoDialog migrated
- [x] All tests green (jsdom dialog + drawer suites; pre-existing NeoPopConfirm flake on `dev` is out of scope)
- [x] Grep clean
- [x] Commit pushed
