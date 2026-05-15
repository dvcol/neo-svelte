<script lang="ts">
  import type { NeoBaseInputProps } from '~/inputs/common/neo-input.model.js';

  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';

  type HarnessProps = Partial<NeoBaseInputProps>;

  let {
    ref = $bindable(),
    value = $bindable(),
    files = $bindable(),
    group = $bindable(),
    checked = $bindable(),
    indeterminate = $bindable(),
    initial = $bindable(),
    touched = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    focused = $bindable(false),
    validationMessage = $bindable(),
    ...rest
  }: HarnessProps = $props();
</script>

<NeoBaseInput
  bind:ref
  bind:value
  bind:files
  bind:group
  bind:checked
  bind:indeterminate
  bind:initial
  bind:touched
  bind:valid
  bind:dirty
  bind:focused
  bind:validationMessage
  {...rest}
/>
