# `@dvcol/neo-svelte/form`

```ts
import { NeoFieldSet, NeoForm } from '@dvcol/neo-svelte/form';
```

## Components

- `NeoForm` — `<form>` wrapper that provides form context (validity, dirty, touched, submitting state) to descendant inputs.
- `NeoFieldSet` — grouped fields with a legend; participates in form context for nested validation rollup.

## Concepts

- Inputs in `@dvcol/neo-svelte/inputs` and the input-shaped buttons in `@dvcol/neo-svelte/buttons` (`NeoCheckboxButton`, `NeoRadioButton`, `NeoSwitchButton`) auto-register with the nearest form context. Outside a form, they remain standalone.
- The form context is reactive (`$state`-backed) — derive `disabled`/`pristine` indicators from it without prop-drilling.
- Native form semantics still apply: `name`, `required`, `pattern`, `<button type="submit">`. The library augments rather than replaces them.

## Common pattern

```svelte
<NeoForm
  onsubmit={(e) => {
    e.preventDefault();
    save();
  }}
>
  <NeoFieldSet legend="Profile">
    <NeoInput name="email" type="email" required bind:value={email} />
    <NeoCheckbox name="newsletter" bind:checked={subscribed}>
      {#snippet label()}Send me updates{/snippet}
    </NeoCheckbox>
  </NeoFieldSet>
  <NeoButton type="submit">Save</NeoButton>
</NeoForm>
```

## Gotchas

- Don't wrap form-shaped buttons (`NeoCheckboxButton`, etc.) in your own `<label>` — the component is already labelled via its `label` snippet and registers itself with form context.
- If you portal an input out of the form's DOM subtree, context is lost. Either render it in-tree or pass form state explicitly.

See also: [inputs](../inputs/AGENTS.md), [buttons](../buttons/AGENTS.md).
