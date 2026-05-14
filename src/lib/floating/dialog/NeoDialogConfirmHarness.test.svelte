<script lang="ts">
  import type { NeoDialogConfirmProps } from '~/floating/dialog/neo-dialog-confirm.model.js';
  import type { NeoDialogHTMLElement } from '~/floating/dialog/neo-dialog.model.js';

  import NeoDialogConfirm from '~/floating/dialog/NeoDialogConfirm.svelte';

  type HarnessProps = Partial<NeoDialogConfirmProps> & {
    bodyText?: string;
    headerText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  let {
    ref = $bindable<NeoDialogHTMLElement | undefined>(undefined),
    open = $bindable(false),
    modal = $bindable(true),
    bodyText = 'are you sure?',
    headerText,
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoDialogConfirm bind:ref bind:open bind:modal header={headerText} {...rest}>
  <span data-testid="dialog-confirm-body">{bodyText}</span>
</NeoDialogConfirm>
