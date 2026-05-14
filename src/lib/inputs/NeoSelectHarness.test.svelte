<script lang="ts">
  import type { NeoSelectProps } from '~/inputs/neo-select.model.js';

  import NeoSelect from '~/inputs/NeoSelect.svelte';

  let {
    open = $bindable(false),
    selected = $bindable(),
    value = $bindable(),
    highlight = $bindable(),
    ...rest
  }: Partial<NeoSelectProps> = $props();
</script>

<NeoSelect
  bind:open
  bind:selected
  bind:value
  bind:highlight
  {...rest}
/>
