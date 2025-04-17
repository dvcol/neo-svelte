<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
  import type { NeoDialogStepperProps } from '~/floating/dialog/neo-dialog-stepper.model.js';
  import type { NeoDialogContext } from '~/floating/dialog/neo-dialog.model.js';
  import type { NeoStepperBeforeEvent, NeoStepperContext } from '~/stepper/neo-stepper.model.js';

  import { NeoDialogPlacements } from '~/floating/common/neo-placement.model.js';
  import NeoFloatingStepper from '~/floating/common/NeoFloatingStepper.svelte';

  import NeoDialog from './NeoDialog.svelte';

  let {
    // Snippets
    children: content,
    header: title,

    // Dialog Props
    dialogRef = $bindable(),
    open = $bindable(false),
    modal = $bindable(true),
    moved = $bindable({ x: 0, y: 0 }),
    returnValue = $bindable(),
    closedby,
    unmountOnClose,

    // Position
    placement = $bindable(NeoDialogPlacements.Center),
    outside = $bindable(false),
    movable,

    // Style
    elevation,
    blur,
    color,
    filled,
    tinted,
    backdrop,
    borderless,

    // Sizing
    flex,
    align,
    justify,
    width,
    height,
    padding,

    // Actions
    in: inAction,
    out: outAction,
    transition,

    // Actions
    use,

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
    closable = closedby === undefined,
    progressPlacement,

    // Styles
    rounded,

    // Events
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    dialogProps,
    backdropProps,
    ...rest
  }: NeoDialogStepperProps = $props();

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = (e) => {
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
    placement={progressPlacement}
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

<NeoDialog
  bind:ref={dialogRef}
  bind:open
  bind:modal
  bind:moved
  bind:outside
  bind:placement
  bind:returnValue
  children={dialog}
  {closedby}
  {unmountOnClose}
  closeOnClickOutside={closable}
  {movable}
  {elevation}
  {blur}
  {color}
  {filled}
  {tinted}
  {backdrop}
  {borderless}
  {rounded}
  {flex}
  {align}
  {justify}
  {width}
  {height}
  {padding}
  in={inAction}
  out={outAction}
  {transition}
  {use}
  {backdropProps}
  {...dialogProps}
/>
