<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoPopStepperProps } from '~/tooltips/neo-pop-stepper.model.js';
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/tooltips/neo-tooltip.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import {
    type NeoStepperBeforeEvent,
    type NeoStepperContext,
    NeoStepperNavigation,
    type NeoStepperNavigations,
  } from '~/stepper/neo-stepper.model.js';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: trigger,
    tooltip: content,
    header,

    // States
    ref = $bindable(),
    steps = [],
    active = $bindable(0),
    loading = $bindable({
      navigate: false,
      previous: false,
      cancel: false,
      next: false,
    }),
    progress = true,
    marks: _marks,

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    target,
    openDelay,
    hoverDelay,
    openOnFocus,
    openOnHover,

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
    onBeforeStep,

    // Other Props
    progressProps,
    tooltipProps,
    headerProps,
    cancelProps,
    closeProps,
    ...rest
  }: NeoPopStepperProps = $props();
  /* eslint-enable prefer-const */

  const { tag: headerTag = 'h6', ...headerRest } = $derived(headerProps ?? {});

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    open = false;
    closeProps?.onclick?.(e);
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

  const onBeforeStepHandler: NeoPopStepperProps['onBeforeStep'] = async (event: NeoStepperBeforeEvent, reason?: NeoStepperNavigations) => {
    await onBeforeStep?.(event, reason);
    if (reason === NeoStepperNavigation.Cancel) {
      await handlePromise(onCancel?.(event), 'cancel');
      open = false;
    } else if (reason === NeoStepperNavigation.Next && steps?.length === event.current + 1) {
      await handlePromise(onConfirm?.(event), 'next');
      open = false;
    }
  };
</script>

{#snippet icon()}
  <IconClose size="0.9375rem" />
{/snippet}

{#snippet closeButton()}
  <div class="neo-pop-stepper-close" class:neo-rounded={rounded} class:neo-inside={!header && !progress}>
    <NeoButton
      rounded
      text
      class="neo-pop-stepper-control-close-button"
      aria-label="Close confirmation tooltip"
      title="Close"
      {icon}
      {...closeProps}
      onclick={onCloseButton}
    />
  </div>
{/snippet}

{#snippet tooltip(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
  {#snippet stepperContent(context: NeoStepperContext)}
    {#if typeof content === 'function'}
      {@render content?.(floating, toggle, context)}
    {:else}
      {content}
    {/if}
  {/snippet}

  {#snippet headerContent(context: NeoStepperContext)}
    {#if header}
      <div class="neo-pop-stepper-header" class:neo-progress={progress}>
        <svelte:element this={headerTag} class="neo-pop-stepper-title" {...headerRest}>
          {#if typeof header === 'function'}
            {@render header?.(floating, toggle, context)}
          {:else}
            {header}
          {/if}
        </svelte:element>
        {@render closeButton()}
      </div>
    {/if}
  {/snippet}

  <NeoStepper
    bind:ref
    bind:active
    bind:loading
    {steps}
    {marks}
    {progress}
    {rounded}
    next
    elevation="0"
    children={stepperContent}
    before={headerContent}
    inside={header || progress ? undefined : closeButton}
    onBeforeStep={onBeforeStepHandler}
    progressProps={{ elevation: -1, after: header ? undefined : closeButton, ...progressProps }}
    cancelProps={{ color: 'error', ...cancelProps }}
    {...rest}
  />
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open
  keepOpenOnFocus
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

<style lang="scss">
  .neo-pop-stepper {
    &-close {
      :global(> .neo-pop-stepper-control-close-button) {
        margin: 0;
        padding: 0.375rem;

        --neo-btn-text-color-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
        --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));
      }

      &.neo-inside {
        align-self: flex-end;
        margin-bottom: -1.5rem;

        &:not(.neo-rounded) {
          margin-top: 0.25rem;
        }
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-inline: var(--neo-pop-stepper-margin-inline, var(--neo-shadow-margin, 0.625rem));
      margin-block: 0.325rem;

      .neo-pop-stepper-title {
        flex: 1 1 auto;
        margin: 0;
      }

      .neo-pop-stepper-close {
        margin-right: -0.375rem;
      }
    }
  }
</style>
