<script lang="ts">
  import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

  import NeoInput from '~/inputs/common/NeoInput.svelte';

  type HarnessProps = Partial<NeoInputProps>;

  let {
    ref = $bindable(),
    value = $bindable(),
    files = $bindable(),
    group = $bindable(),
    checked = $bindable(),
    indeterminate = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    ...rest
  }: HarnessProps = $props();
</script>

<NeoInput
  bind:ref
  bind:value
  bind:files
  bind:group
  bind:checked
  bind:indeterminate
  bind:valid
  bind:dirty
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  {...rest}
/>
