<script lang="ts">
  import type { NeoRangeProps } from '~/inputs/neo-range.model.js';

  import NeoRange from '~/inputs/NeoRange.svelte';

  let {
    value = $bindable(0),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    hovered = $bindable(false),
    ...rest
  }: Partial<NeoRangeProps> = $props();
</script>

<NeoRange
  bind:value
  bind:valid
  bind:dirty
  bind:touched
  bind:focused
  bind:hovered
  {...rest as NeoRangeProps}
/>
