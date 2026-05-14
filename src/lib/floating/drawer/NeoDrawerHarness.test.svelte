<script lang="ts">
  import type { NeoDialogHTMLElement } from '~/floating/dialog/neo-dialog.model.js';
  import type { NeoDrawerProps } from '~/floating/drawer/neo-drawer.model.js';

  import NeoDrawer from '~/floating/drawer/NeoDrawer.svelte';

  type HarnessProps = Partial<NeoDrawerProps> & {
    bodyText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  let {
    ref = $bindable<NeoDialogHTMLElement | undefined>(undefined),
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
