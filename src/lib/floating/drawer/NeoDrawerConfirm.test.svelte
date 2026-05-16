<script lang="ts">
  import type { NeoDrawerConfirmProps } from '~/floating/drawer/neo-drawer.model.js';

  import NeoDrawerConfirm from '~/floating/drawer/NeoDrawerConfirm.svelte';

  type HarnessProps = Partial<NeoDrawerConfirmProps> & {
    bodyText?: string;
    headerText?: string;
    onRef?: (ref: HTMLDialogElement | undefined) => void;
  };

  let {
    ref = $bindable<HTMLDialogElement | undefined>(undefined),
    open = $bindable(false),
    bodyText = 'are you sure?',
    headerText,
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoDrawerConfirm bind:ref bind:open header={headerText} {...rest}>
  <span data-testid="drawer-confirm-body">{bodyText}</span>
</NeoDrawerConfirm>
