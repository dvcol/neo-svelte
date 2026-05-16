# Plan: drop ref-method mutation, move to native Svelte 5 component-instance exports

**Branch**: `chore/drop-ref-method-mutation`
**Worktree**: `../neo-svelte-ref-migration`
**Started**: 2026-05-16

## Why

12 components mutate their bound DOM ref(s) at mount to expose component-level methods (`Object.assign(ref, …)` and, in NeoDialog's case, `Object.defineProperty(ref, …)` plus monkey-patched native methods). This is a Svelte anti-pattern — methods become available _after_ the effect runs, not at mount; consumers see `Partial<NeoXxxMethods>` and `?.()` everywhere; element identity is polluted; ordering bugs lurk when the ref is reassigned/portalled.

Svelte 5 already supports component-instance exports (`bind:this={instance}` + `export function`/`export const`). Move every method to that idiom; drop the `NeoXxxHTMLElement` aliases entirely (no backwards-compat shims).

## Scope

| #   | Component                    | File                                                | Methods on ref                                                                                                                | Already exported?                                 |
| --- | ---------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | NeoForm                      | `src/lib/form/NeoForm.svelte`                       | `context`, `validate`                                                                                                         | `context` yes; `validate` no                      |
| 2   | NeoProgress / NeoProgressBar | `src/lib/progress/`                                 | `start`, `stop`, `reset`, `cancel`, `change`, `complete`                                                                      | yes                                               |
| 3   | NeoStepper                   | `src/lib/stepper/NeoStepper.svelte`                 | `goTo`, `goPrevious`/`previous`, `goNext`/`next`                                                                              | yes (aliases need promotion)                      |
| 4   | NeoCollapse                  | `src/lib/collapse/NeoCollapse.svelte`               | `toggle`, `trigger`/`section` getters (on `ref` AND `triggerRef`)                                                             | `toggle` yes                                      |
| 5   | NeoSimpleList / NeoList      | `src/lib/list/`                                     | `scrollToTop`, `scrollToBottom`, `selectItem`, `clearItem`, `reSelect`                                                        | scroll yes; rest local                            |
| 6   | NeoTypewriter                | `src/lib/text/NeoTypewriter.svelte`                 | `write`, `abort`, `writing`/`promise` getters                                                                                 | write/abort yes                                   |
| 7   | Input family                 | `NeoBaseInput`, `NeoTextarea`, `NeoPin`, `NeoRange` | `mark`, `clear`, `change`, `validate`, `resize`, `stepUp`, `stepDown`                                                         | most yes; `NeoPin.clear`, `NeoTextarea.resize` no |
| 8   | NeoTooltip                   | `src/lib/floating/tooltips/NeoTooltip.svelte`       | `toggle`, `update` (on `ref` AND `triggerRef`)                                                                                | yes                                               |
| 9   | **NeoDialog**                | `src/lib/floating/dialog/NeoDialog.svelte`          | `Object.defineProperty(ref,'returnValue',…)` + monkey-patches `show`/`showModal`/`close`/`requestClose` + assigns `ref.reset` | none — must add                                   |

NeoNotificationStack's `Object.assign(item, update)` is on a queued-record, not the DOM ref → out of scope.

## Internal consumers to migrate

- `src/lib/floating/menu/NeoMenu.svelte:84-87,104` — `triggerRef?.toggle?.(…)` → `tooltipInstance.toggle(…)`
- `src/lib/floating/tooltips/NeoPopSelect.svelte:86` — `tooltipRef?.update?.()` → `tooltipInstance.update()`
- `src/lib/floating/menu/NeoMenuListItem.svelte:112-115` — uses `tooltipRef` for `getFocusableElement` only; just retype
- `src/lib/form/neo-form-context.svelte.ts:120` — `field.ref?.validate?.()` → register `validate` callback instead of DOM ref
- `src/lib/inputs/NeoNumberStep.svelte:98`, `NeoSelect.svelte:127`, `NeoFilePicker.svelte:129`, `NeoInput.svelte:153` — inner-input `?.validate/clear?.()` → bind input component instance
- `src/lib/inputs/NeoPin.svelte:152,175,187,201,255,268` — 2D `refs[][]` of input methods → 2D `instances[][]`
- `src/lib/inputs/NeoInput.svelte:163`, `NeoNativeSelect.svelte:52`, `NeoDateTime.svelte:38,71,86` — native `showPicker` stays on DOM ref (keep)
- `demo/components/floating/dialog/DemoDialog.svelte:196` — `ref?.reset?.(…)` → `dialogInstance.reset(…)`

## Test rules (per memory)

- **TNR**: theory + narrative + regression in every suite.
- **Real behaviour, not tautologies** — observe DOM, callbacks, returns; never `enum === value`.
- **Option matrix** — every flag tested on/off/combinations.
- **Bugs pinned with `it.skip` + TODO** + expected-behaviour assertion.
- **Anti-pattern lock**: each migrated component gets a test asserting `Object.hasOwn(ref, '<method>') === false` post-migration.

NeoDialog target: ~80 test cases minimum across `tag × modal × open × unmountOnClose × closeOnClickOutside × closedby × movable × full × placement` matrix. See [phase-9-neodialog.md](./phase-9-neodialog.md).

## Phases (leaves first)

| Phase | Component(s)                                          | Status  | File                                                   |
| ----- | ----------------------------------------------------- | ------- | ------------------------------------------------------ |
| 0     | Worktree + plan tracking                              | ✅ done | this README                                            |
| 1     | NeoForm                                               | ✅ done | [phase-1-neoform.md](./phase-1-neoform.md)             |
| 2     | NeoProgress / NeoProgressBar                          | ✅ done | [phase-2-neoprogress.md](./phase-2-neoprogress.md)     |
| 3     | NeoStepper                                            | ✅ done | [phase-3-neostepper.md](./phase-3-neostepper.md)       |
| 4     | NeoCollapse                                           | ✅ done | [phase-4-neocollapse.md](./phase-4-neocollapse.md)     |
| 5     | NeoSimpleList → NeoList                               | ✅ done | [phase-5-neolist.md](./phase-5-neolist.md)             |
| 6     | NeoTypewriter                                         | ✅ done | [phase-6-neotypewriter.md](./phase-6-neotypewriter.md) |
| 7     | Input family + inner consumers                        | ✅ done | [phase-7-input-family.md](./phase-7-input-family.md)   |
| 8     | NeoTooltip + NeoMenu / NeoPopSelect / NeoMenuListItem | ✅ done | [phase-8-neotooltip.md](./phase-8-neotooltip.md)       |
| 9     | NeoDialog + drawer variants + DemoDialog              | ✅ done | [phase-9-neodialog.md](./phase-9-neodialog.md)         |
| 10    | Final sweep + grep gates + public exports             | ✅ done | [phase-10-sweep.md](./phase-10-sweep.md)               |

Each phase doc captures: red-test plan → migration steps → consumer impact → verification commands → status checklist.

## Verification gates (run inside worktree at end of each phase)

```bash
pnpm vitest run --project jsdom            # unit tests green
pnpm vitest run --project browser          # browser tests green
pnpm vitest run --coverage                 # 100% on touched paths
pnpm check                                 # 0 type errors

# Anti-pattern locks (must return 0 in src/lib once a component is migrated):
rg -n 'Object\.(assign|defineProperty)\s*\(\s*(ref|triggerRef|element|tooltipRef|el|target)' src/lib
rg -n 'Neo(Tooltip|List|Form|Progress|Collapse|Typewriter|Input|Textarea|Range|Dialog)HTMLElement' src demo

# Consumer sweep — must return 0 except native showPicker:
rg -n '\?\.(toggle|update|reset|start|stop|cancel|complete|change|goTo|previous|next|scrollToTop|scrollToBottom|selectItem|clearItem|reSelect|write|abort|mark|clear|validate|resize|stepUp|stepDown|writing|promise)\?\.\(' src demo \
  | rg -v 'showPicker|svelte-utils|@floating-ui|popover\.test'
```

## Out of scope

- NeoNotificationStack `Object.assign(item, update)` (queued-record mutation, not DOM ref).
- Native `showPicker` calls (real DOM API, not library mutation).
- Behaviour changes — method semantics stay identical; only access paths change.
