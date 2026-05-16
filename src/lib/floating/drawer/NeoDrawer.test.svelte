<script lang="ts">
  import type { NeoDrawerProps } from '~/floating/drawer/neo-drawer.model.js';

  import NeoDrawer from '~/floating/drawer/NeoDrawer.svelte';

  type HarnessProps = Partial<NeoDrawerProps> & {
    bodyText?: string;
    onRef?: (ref: HTMLDialogElement | undefined) => void;
  };

  let {
    ref = $bindable<HTMLDialogElement | undefined>(undefined),
    open = $bindable(false),
    returnValue = $bindable<string | undefined>(),
    bodyText = 'drawer body',
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoDrawer bind:ref bind:open bind:returnValue {...rest}>
  <span data-testid="drawer-body">{bodyText}</span>
</NeoDrawer>
