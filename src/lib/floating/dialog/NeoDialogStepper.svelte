<script lang="ts">
  import NeoDialog from './NeoDialog.svelte';

  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
  import type { NeoDialogStepperProps } from '~/floating/dialog/neo-dialog-stepper.model.js';
  import type { NeoDialogContext } from '~/floating/dialog/neo-dialog.model.js';

  import NeoFloatingStepper from '~/floating/common/NeoFloatingStepper.svelte';
  import { type NeoStepperBeforeEvent, type NeoStepperContext } from '~/stepper/neo-stepper.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: content,
    header: title,

    // Dialog Props
    dialogRef = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    returnValue = $bindable(),

    // States
    ref = $bindable(),
    active = $bindable(0),
    loading = $bindable({
      navigate: false,
      previous: false,
      cancel: false,
      next: false,
    }),
    steps = [],
    marks: _marks,
    progress = true,
    closedby,
    closable = closedby === undefined,

    // Styles
    rounded = false,

    // Events
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    dialogProps,
    ...rest
  }: NeoDialogStepperProps = $props();
  /* eslint-enable prefer-const */

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    open = false;
    onClose?.(e);
  };

  const handlePromise = async (result: unknown, button: 'cancel' | 'next') => {
    if (!(result instanceof Promise)) return;
    try {
      loading[button] = true;
      await result;
    } finally {
      loading[button] = false;
    }
  };

  const onCancelButton: NeoFloatingStepperProps['onCancel'] = async (event: NeoStepperBeforeEvent) => {
    await handlePromise(onCancel?.(event), 'cancel');
    open = false;
  };

  const onConfirmButton: NeoFloatingStepperProps['onConfirm'] = async (event: NeoStepperBeforeEvent) => {
    await handlePromise(onConfirm?.(event), 'next');
    open = false;
  };
</script>

{#snippet dialog(dialogContext: NeoDialogContext)}
  {#snippet header(stepperContext: NeoStepperContext)}
    {#if typeof title === 'function'}
      {@render title?.(dialogContext, stepperContext)}
    {:else}
      {title}
    {/if}
  {/snippet}

  <NeoFloatingStepper
    bind:ref
    bind:active
    bind:loading
    {steps}
    {marks}
    {progress}
    {closable}
    {rounded}
    header={title ? header : undefined}
    onClose={onCloseButton}
    onCancel={onCancelButton}
    onConfirm={onConfirmButton}
    {...rest}
  >
    {#snippet children(stepperContext: NeoStepperContext)}
      {#if typeof content === 'function'}
        {@render content?.(dialogContext, stepperContext)}
      {:else}
        {content}
      {/if}
    {/snippet}
  </NeoFloatingStepper>
{/snippet}

<NeoDialog bind:ref={dialogRef} bind:open bind:modal bind:returnValue children={dialog} {closedby} closeOnClickOutside={closable} {...dialogProps} />
