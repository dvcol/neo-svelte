<script lang="ts">
  import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';

  type DialogInstance = ReturnType<typeof NeoDialog>;

  type HarnessProps = Partial<NeoDialogProps> & {
    bodyText?: string;
    onRef?: (ref: HTMLDialogElement | undefined) => void;
    onInstance?: (instance: DialogInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLDialogElement | undefined>(undefined),
    open = $bindable(false),
    modal = $bindable(true),
    returnValue = $bindable<string | undefined>(),
    bodyText = 'dialog body',
    onRef,
    onInstance,
    ...rest
  }: HarnessProps = $props();

  let instance = $state<DialogInstance>();

  $effect(() => {
    onRef?.(ref);
  });

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoDialog bind:this={instance} bind:ref bind:open bind:modal bind:returnValue {...rest}>
  <span data-testid="dialog-body">{bodyText}</span>
  <button data-testid="dialog-button" type="button">click me</button>
</NeoDialog>
