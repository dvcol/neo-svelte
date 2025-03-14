<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
  import type { NeoPopStepperProps } from '~/floating/tooltips/neo-pop-stepper.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import {
    type NeoStepperBeforeEvent,
    type NeoStepperContext,
    NeoStepperNavigation,
    type NeoStepperNavigations,
  } from '~/stepper/neo-stepper.model.js';
  import { Colors } from '~/utils/colors.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    header,

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
    closable = true,

    // Styles
    rounded = false,

    // Events
    onClose,
    onCancel,
    onConfirm,
    onBeforeStep,

    // Other Props
    progressProps,
    headerProps,
    cancelProps,
    nextProps,
    closeProps,
    buttonProps,
    ...rest
  }: NeoFloatingStepperProps = $props();
  /* eslint-enable prefer-const */

  const { tag: headerTag = 'h6', ...headerRest } = $derived(headerProps ?? {});

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);
  const last = $derived<boolean>(active === steps.length - 1);

  const onBeforeStepHandler: NeoPopStepperProps['onBeforeStep'] = async (event: NeoStepperBeforeEvent, reason?: NeoStepperNavigations) => {
    await onBeforeStep?.(event, reason);
    if (reason === NeoStepperNavigation.Cancel) {
      await onCancel?.(event, reason);
    } else if (reason === NeoStepperNavigation.Next && steps?.length === event.current + 1) {
      await onConfirm?.(event, reason);
    }
  };

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = e => {
    closeProps?.onclick?.(e);
    onClose?.(e);
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
      {...buttonProps}
      {...closeProps}
      onclick={onCloseButton}
    />
  </div>
{/snippet}

{#snippet headerContent(context: NeoStepperContext)}
  {#if header}
    <div class="neo-pop-stepper-header" class:neo-progress={progress}>
      <svelte:element this={headerTag} class="neo-pop-stepper-title" {...headerRest}>
        {#if typeof header === 'function'}
          {@render header?.(context)}
        {:else}
          {header}
        {/if}
      </svelte:element>
      {#if closable}
        {@render closeButton()}
      {/if}
    </div>
  {/if}
{/snippet}

<div class="neo-pop-stepper">
  <NeoStepper
    bind:ref
    bind:active
    bind:loading
    {steps}
    {marks}
    {progress}
    {rounded}
    {buttonProps}
    next
    elevation="0"
    before={header ? headerContent : undefined}
    inside={header || progress || !closable ? undefined : closeButton}
    onBeforeStep={onBeforeStepHandler}
    progressProps={{ elevation: -1, after: header || !closable ? undefined : closeButton, ...progressProps }}
    cancelProps={{ color: Colors.Error, ...cancelProps }}
    nextProps={{
      color: last ? Colors.Success : undefined,
      label: last ? 'Confirm' : 'Next',
      ...nextProps,
    }}
    {...rest}
  />
</div>

<style lang="scss">
  .neo-pop-stepper {
    display: contents;

    &-close {
      --neo-btn-text-color-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
      --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));
      --neo-btn-padding-empty: 0.375rem;
      --neo-btn-margin: 0;

      opacity: 0.8;
      transition: opacity 0.3s ease;

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

    :global(.neo-stepper-controls) {
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }

    &:focus-within,
    &:focus,
    &:hover {
      :global(.neo-stepper-controls),
      .neo-pop-stepper-close {
        opacity: 1;
      }
    }
  }
</style>
