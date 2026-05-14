<script lang="ts">
  import type { NeoSwitchProps } from '~/inputs/neo-switch.model.js';

  import NeoSwitch from '~/inputs/NeoSwitch.svelte';

  type HarnessProps = Partial<NeoSwitchProps>;

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

<NeoSwitch
  bind:checked
  bind:indeterminate
  bind:valid
  bind:dirty
  bind:touched
  bind:focused
  {...rest}
/>
