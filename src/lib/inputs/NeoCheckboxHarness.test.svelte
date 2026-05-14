<script lang="ts">
  import type { NeoCheckboxProps } from '~/inputs/neo-checkbox.model.js';

  import NeoCheckbox from '~/inputs/NeoCheckbox.svelte';

  type HarnessProps = Partial<NeoCheckboxProps>;

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    ...rest
  }: HarnessProps = $props();
</script>

<NeoCheckbox
  bind:checked
  bind:indeterminate
  bind:valid
  bind:dirty
  bind:touched
  bind:focused
  {...rest}
/>
