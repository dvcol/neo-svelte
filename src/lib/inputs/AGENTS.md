# `@dvcol/neo-svelte/inputs`

```ts
import {
  NeoCheckbox,
  NeoColorPicker,
  NeoColorPickerSelector,
  NeoDateTime,
  NeoFilePicker,
  NeoFilePickerCard,
  NeoInput,
  NeoNativeSelect,
  NeoNumberStep,
  NeoPassword,
  NeoPin,
  NeoRadio,
  NeoRange,
  NeoSelect,
  NeoSwitch,
  NeoTextArea,
} from '@dvcol/neo-svelte/inputs';
```

## Components

- **Text** — `NeoInput` (base), `NeoTextArea`, `NeoPassword`, `NeoPin`.
- **Toggles** — `NeoCheckbox`, `NeoRadio`, `NeoSwitch`.
- **Selection** — `NeoSelect` (custom popover), `NeoNativeSelect` (native `<select>`).
- **Numeric** — `NeoNumberStep` (steppers), `NeoRange` (slider).
- **Specialised** — `NeoDateTime`, `NeoFilePicker` / `NeoFilePickerCard`, `NeoColorPicker` / `NeoColorPickerSelector`.

## Concepts

- **Bindable triplet** — every input exposes `bind:value` plus `bind:touched` and `bind:dirty` for state surfacing. Use them to drive validation UI without re-deriving.
- **Form context auto-registration** — inside `NeoForm` / `NeoFieldSet`, inputs register themselves; their state contributes to the form's aggregate validity / dirty / touched.
- **Native semantics preserved** — `name`, `required`, `pattern`, `min/max`, `disabled`, `readonly` work as expected.
- **Snippet customization** — `label`, `prefix`, `suffix`, `error`, `helper` snippets are available on most inputs for in-line ornaments.

## Common pattern

```svelte
<NeoInput
  bind:value={email}
  bind:touched
  type="email"
  name="email"
  required
>
  {#snippet label()}Email{/snippet}
  {#snippet error({ message })}{message}{/snippet}
</NeoInput>
```

## Gotchas

- `NeoSelect` is a custom popover (full snippet control); `NeoNativeSelect` wraps `<select>` (no popover, native mobile UI). Pick based on whether you need custom item rendering.
- Validation runs on the native `ValidityState` API — if you need custom rules, use `setCustomValidity` from a callback / effect.
- For bindable inputs always use `bind:value` (not `value={...}`); the latter is one-way and the input becomes read-only.

See also: [form](../form/AGENTS.md), [buttons](../buttons/AGENTS.md) (input-shaped buttons).
