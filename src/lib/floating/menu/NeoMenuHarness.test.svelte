<script lang="ts">
  import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';

  import NeoMenu from '~/floating/menu/NeoMenu.svelte';

  type HarnessProps = Partial<NeoMenuProps> & {
    triggerLabel?: string;
  };

  let {
    open = $bindable(false),
    items = [],
    triggerLabel = 'open',
    ...rest
  }: HarnessProps = $props();
</script>

<NeoMenu bind:open {items} {...rest}>
  <button type="button" data-testid="trigger-button">{triggerLabel}</button>
</NeoMenu>
