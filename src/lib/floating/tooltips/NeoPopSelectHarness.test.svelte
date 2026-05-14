<script lang="ts">
  import type { NeoPopSelectProps } from '~/floating/tooltips/neo-pop-select.model.js';

  import NeoPopSelect from '~/floating/tooltips/NeoPopSelect.svelte';

  type HarnessProps<Value = unknown> = NeoPopSelectProps<Value> & {
    triggerLabel?: string;
  };

  let {
    open = $bindable(false),
    selected = $bindable(),
    highlight = $bindable(),
    focused = $bindable(false),
    triggerLabel = 'open select',
    ...rest
  }: HarnessProps = $props();
</script>

<NeoPopSelect bind:open bind:selected bind:highlight bind:focused {...rest}>
  <button type="button" data-testid="trigger-button">{triggerLabel}</button>
</NeoPopSelect>
