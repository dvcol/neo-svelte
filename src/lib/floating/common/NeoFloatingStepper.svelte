<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
  import type { NeoStepperBeforeEvent, NeoStepperContext, NeoStepperNavigations } from '~/stepper/neo-stepper.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoCloseButton from '~/buttons/NeoCloseButton.svelte';
  import {

    NeoStepperNavigation,

  } from '~/stepper/neo-stepper.model.js';
  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import { Colors } from '~/utils/colors.utils.js';

  let {
    // Snippets
    header,

    // States
    id = `neo-floating-steper-${getUUID()}`,
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

  const { tag: headerTag = 'h6', ...headerRest } = $derived(headerProps ?? {});

  const marks = $derived<boolean>(_marks ?? steps?.some(s => s?.markProps) ?? !!rest?.markProps);
  const last = $derived<boolean>(active === steps.length - 1);

  const onBeforeStepHandler: NeoFloatingStepperProps['onBeforeStep'] = async (event: NeoStepperBeforeEvent, reason?: NeoStepperNavigations) => {
    await onBeforeStep?.(event, reason);
    if (reason === NeoStepperNavigation.Cancel) {
      await onCancel?.(event, reason);
    } else if (reason === NeoStepperNavigation.Next && steps?.length === event.current + 1) {
      await onConfirm?.(event, reason);
    }
  };

  const onCloseButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    closeProps?.onclick?.(e);
    onClose?.(e);
  };
</script>

{#snippet closeButton()}
  <div class="neo-floating-stepper-close" class:neo-rounded={rounded} class:neo-inside={!header && !progress}>
    <NeoCloseButton rounded text aria-label="Close confirmation tooltip" title="Close" {...buttonProps} {...closeProps} onclick={onCloseButton} />
  </div>
{/snippet}

{#snippet headerContent(context: NeoStepperContext)}
  {#if header}
    <div class="neo-floating-stepper-header" id={`${id}-header`} class:neo-progress={progress}>
      <svelte:element this={headerTag} class:neo-floating-stepper-title={true} {...headerRest}>
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

<div class="neo-floating-stepper" {id}>
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
    progressProps={{ elevation: rest.elevation ?? -1, after: header || !closable ? undefined : closeButton, ...progressProps }}
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
  .neo-floating-stepper {
    display: contents;

    --neo-stepper-mark-bg-color: var(--neo-background-color-backdrop-filled);

    &-close {
      --neo-btn-padding-empty: var(--neo-gap-3xs);
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
      margin-inline: var(--neo-floating-stepper-margin-inline, var(--neo-shadow-margin, 0.625rem));
      margin-block: var(--neo-gap-xxs);

      .neo-floating-stepper-title {
        flex: 1 1 auto;
        margin: 0;
      }

      .neo-floating-stepper-close {
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
      .neo-floating-stepper-close {
        opacity: 1;
      }
    }
  }
</style>
