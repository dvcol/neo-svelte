<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoDialogConfirmProps } from '~/floating/dialog/neo-dialog-confirm.model.js';
  import type { NeoDialogContext } from '~/floating/dialog/neo-dialog.model.js';

  import NeoConfirm from '~/floating/common/NeoConfirm.svelte';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';
  import { Logger } from '~/utils/logger.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: content,
    header: title,

    // Dialog Props
    ref = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    returnValue = $bindable(),

    // Confirmation Props
    loading = $bindable({
      cancel: false,
      confirm: false,
    }),
    disabled = $bindable({
      cancel: false,
      confirm: false,
    }),
    closedby,
    closable = closedby === undefined,
    rounded,

    // events
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    dialogProps,
    ...rest
  }: NeoDialogConfirmProps = $props();
  /* eslint-enable prefer-const */

  const close = () => {
    if (!ref) return Logger.error('NeoDialogConfirm: ref is not defined');
    if (ref.requestClose) return ref.requestClose();
    ref.close();
  };

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    onClose?.(e);
    close();
  };

  const handlePromise = async (result: unknown, button: 'cancel' | 'confirm') => {
    if (!(result instanceof Promise)) return;
    try {
      loading[button] = true;
      await result;
    } finally {
      loading[button] = false;
    }
  };

  const onCancelButton: MouseEventHandler<HTMLButtonElement> = async e => {
    await handlePromise(onCancel?.(e), 'cancel');
    close();
  };

  const onConfirmButton: MouseEventHandler<HTMLButtonElement> = async e => {
    await handlePromise(onConfirm?.(e), 'confirm');
    close();
  };
</script>

<NeoDialog bind:ref bind:open bind:modal bind:returnValue {closedby} {rounded} closeOnClickOutside={closable} {...dialogProps}>
  {#snippet children(context: NeoDialogContext)}
    {#snippet header()}
      {#if typeof title === 'function'}
        {@render title?.(context)}
      {:else}
        {title}
      {/if}
    {/snippet}
    <NeoConfirm
      bind:loading
      bind:disabled
      {closable}
      {rounded}
      header={title ? header : undefined}
      onClose={onCloseButton}
      onCancel={onCancelButton}
      onConfirm={onConfirmButton}
      {...rest}
    >
      {#if typeof content === 'function'}
        {@render content?.(context)}
      {:else}
        {content}
      {/if}
    </NeoConfirm>
  {/snippet}
</NeoDialog>
