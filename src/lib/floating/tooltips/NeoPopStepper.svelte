<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
  import type { NeoPopStepperProps } from '~/floating/tooltips/neo-pop-stepper.model.js';
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoFloatingStepper from '~/floating/common/NeoFloatingStepper.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import { type NeoStepperBeforeEvent, type NeoStepperContext } from '~/stepper/neo-stepper.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: trigger,
    tooltip: content,
    header: title,

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

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    target,
    openDelay,
    hoverDelay,
    openOnFocus,
    openOnHover,
    closable = true,

    // Styles
    rounded = false,
    color,
    filled,
    tinted,
    elevation,
    flex,
    width,
    height,

    // Events
    onOpen,
    onClose,
    onCancel,
    onConfirm,

    // Other Props
    tooltipProps,
    closeProps,
    ...rest
  }: NeoPopStepperProps = $props();
  /* eslint-enable prefer-const */

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = () => {
    open = false;
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

{#snippet tooltip(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
  {#snippet header(context: NeoStepperContext)}
    {#if typeof title === 'function'}
      {@render title?.(floating, toggle, context)}
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
    {closeProps}
    header={title ? header : undefined}
    onClose={onCloseButton}
    onCancel={onCancelButton}
    onConfirm={onConfirmButton}
    {...rest}
  >
    {#snippet children(context: NeoStepperContext)}
      {#if typeof content === 'function'}
        {@render content?.(floating, toggle, context)}
      {:else}
        {content}
      {/if}
    {/snippet}
  </NeoFloatingStepper>
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open
  keepOpenOnFocus
  closeOnDismiss={closable}
  {tooltip}
  {target}
  {rounded}
  {flex}
  {width}
  {height}
  {color}
  {filled}
  {tinted}
  {elevation}
  {openDelay}
  {hoverDelay}
  {openOnFocus}
  {openOnHover}
  {onOpen}
  {onClose}
  {...tooltipProps}
>
  {#snippet children(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
    {@render trigger?.(floating, toggle)}
  {/snippet}
</NeoTooltip>
