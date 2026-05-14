<script lang="ts">
  import type { NeoRadioProps } from '~/inputs/neo-radio.model.js';

  import NeoRadio from '~/inputs/NeoRadio.svelte';

  type HarnessProps = Partial<NeoRadioProps>;

  let {
    checked = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    ...rest
  }: HarnessProps = $props();
</script>

<NeoRadio
  bind:checked
  bind:valid
  bind:dirty
  bind:touched
  bind:focused
  {...rest}
/>
