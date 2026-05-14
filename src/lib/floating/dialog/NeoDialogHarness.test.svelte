<script lang="ts">
  import type { NeoDialogHTMLElement, NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';

  type HarnessProps = Partial<NeoDialogProps> & {
    bodyText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  let {
    ref = $bindable<NeoDialogHTMLElement | undefined>(undefined),
    open = $bindable(false),
    modal = $bindable(true),
    returnValue = $bindable<string | undefined>(),
    bodyText = 'dialog body',
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoDialog bind:ref bind:open bind:modal bind:returnValue {...rest}>
  <span data-testid="dialog-body">{bodyText}</span>
  <button data-testid="dialog-button" type="button">click me</button>
</NeoDialog>
