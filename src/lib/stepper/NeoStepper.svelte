<script lang="ts">
  import { clamp } from '@dvcol/common-utils/common/math';
  import { fly, scale } from 'svelte/transition';

  import NeoTransitionContainer from '../containers/NeoTransitionContainer.svelte';
  import NeoProgressBar from '../progress/NeoProgressBar.svelte';

  import type { NeoProgressBarMarkContext } from '~/progress/neo-progress-bar.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoProgressMark from '~/progress/NeoProgressMark.svelte';
  import { NeoProgressDirection } from '~/progress/neo-progress.model.js';
  import { type NeoStepperContext, type NeoStepperElevation, NeoStepperPlacement, type NeoStepperProps } from '~/stepper/neo-stepper.model.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { coerce, DefaultShadowShallowElevation, MaxShallowShadowElevation, MinShallowShadowElevation } from '~/utils/shadow.utils.js';
  import { quickDuration, shortDuration } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    children,

    // States
    tag = 'div',
    steps = [],
    active = $bindable(0),

    marks: progressMarks = true,
    progress = true,

    controls = true,
    previous,
    cancel = true,
    next,
    loop = false,

    disabled,

    // Styles
    vertical = false,
    placement = NeoStepperPlacement.Start,
    elevation: _elevation = DefaultShadowShallowElevation,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Methods
    onStep, // current step, & previous step (forward or backward)

    // Other props
    transitionProps,
    controlsProps,
    previousProps,
    cancelProps,
    nextProps,
    progressProps,
    markProps,
    ...rest
  }: NeoStepperProps = $props();
  /* eslint-enable prefer-const */

  const { tag: controlsTag = 'div', ...controlsRest } = $derived(controlsProps ?? {});

  const elevation = $derived(clamp(coerce(_elevation), MinShallowShadowElevation, MaxShallowShadowElevation) as NeoStepperElevation);

  // TODO - compress marks when more than x steps & animate ?

  const stepValue = $derived(100 / (steps.length - 1));
  const marks = $derived(progressMarks ? Array.from({ length: steps.length }, (_, i) => i * stepValue) : undefined);
  const activeValue = $derived(Math.ceil(active * stepValue));

  let last = $state<number>(-1);
  const direction = $derived(active > last ? -1 : 1);
  const orientation = $derived(vertical ? 'y' : 'x');
  const inFn = $derived(toTransition(inAction ?? transitionAction, fly));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction, { [orientation]: `${-100 * direction}%`, duration: 900, delay: 100 }));
  const outFn = $derived(toTransition(outAction ?? transitionAction, fly));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction, { [orientation]: `${100 * direction}%`, duration: 900 }));

  const step = $derived({
    current: steps[active],
    next: steps[active + 1],
    previous: steps[active - 1],
  });

  const canPrevious = $derived(step.current?.previous ?? previous);
  const canCancel = $derived(step.current?.cancel ?? cancel);
  const canNext = $derived(step.current?.next ?? next);

  /**
   * This is imperative navigation, it will not check if next or previous constraints are met.
   * But, it will check if the target step is disabled.
   */
  const goToStep = (index: number, target = steps[index]) => {
    if (!target || target?.disabled) return;
    last = active;
    active = index;
    onStep?.({ previous: last, current: active, step: target });
  };

  const goPrevious = () => {
    if (canPrevious === false) return;
    if (active > 0) return goToStep(active - 1);
    if (loop) return goToStep(steps.length - 1);
  };

  const goNext = () => {
    if (canNext === false) return;
    if (active < steps.length - 1) return goToStep(active + 1);
    if (loop) return goToStep(0);
  };

  const isMarkDisabled = (index: number, target = steps[index]): boolean => {
    if (disabled || target?.disabled) return true;
    if (index < active) {
      if (typeof canPrevious === 'boolean') return canPrevious === false;
      if (typeof canPrevious === 'number') return canPrevious < active - index;
    } else if (index > active) {
      if (typeof canNext === 'boolean') return canNext === false;
      if (typeof canNext === 'number') return canNext < index - active;
    }
    return false;
  };

  const isControlDisabled = (control: 'previous' | 'cancel' | 'next'): boolean => {
    if (disabled || step.current?.disabled) return true;
    if (control === 'cancel') return canCancel === false;
    if (control === 'previous') {
      if (step.previous?.disabled) return true;
      if (canPrevious !== undefined) return !canPrevious;
      if (active === 0 && !loop) return true;
    }
    if (control === 'next') {
      if (step.next?.disabled) return true;
      if (canNext !== undefined) return !canNext;
      if (active === steps.length - 1 && !loop) return true;
    }
    return false;
  };

  const context = $derived<NeoStepperContext>({
    step,
    active,
    last,

    goToStep,
    goPrevious,
    goNext,
  });
</script>

{#snippet mark(ctx: NeoProgressBarMarkContext)}
  {@const _disabled = isMarkDisabled(ctx.index)}
  <NeoProgressMark
    {...ctx}
    disabled={_disabled}
    readonly={_disabled}
    glass={progressProps?.glass}
    onclick={() => goToStep(ctx.index)}
    label={(ctx.index + 1)?.toString()}
    {...markProps}
    {...steps[ctx.index]?.markProps}
  />
{/snippet}

{#snippet progressBar()}
  {#if progress}
    <NeoProgressBar
      aria-label="Stepper progress"
      value={activeValue}
      mark={progressMarks ? mark : undefined}
      {marks}
      {elevation}
      direction={vertical ? NeoProgressDirection.Bottom : NeoProgressDirection.Right}
      {...progressProps}
    />
  {/if}
{/snippet}

{#snippet buttons()}
  {#if controls}
    <svelte:element this={controlsTag} class:neo-stepper-controls={true} {...controlsRest}>
      {#if cancel}
        <NeoButton
          {elevation}
          disabled={isControlDisabled('cancel')}
          label="Cancel"
          aria-label="Cancel stepper"
          title="Cancel stepper"
          onclick={() => goToStep(0)}
          transition={{ use: scale, props: { duration: quickDuration, start: 0.95 } }}
          {...cancelProps}
          {...step.current?.cancelProps}
          class={['neo-stepper-controls-previous', cancelProps?.class, step.current?.cancelProps?.class]}
        />
      {/if}
      <div>
        {#if active > 0 || loop}
          <NeoButton
            {elevation}
            disabled={isControlDisabled('previous')}
            label="Previous"
            aria-label="Go to previous step"
            title="Go to previous step"
            onclick={goPrevious}
            transition={{ use: scale, props: { duration: shortDuration, start: 0.95 } }}
            {...previousProps}
            {...step.current?.previousProps}
            class={['neo-stepper-controls-previous', previousProps?.class, step.current?.previousProps?.class]}
          />
        {/if}
        <NeoButton
          {elevation}
          disabled={isControlDisabled('next')}
          label="Next"
          aria-label="Go to next step"
          title="Go to next step"
          onclick={goNext}
          {...nextProps}
          {...step.current?.nextProps}
          class={['neo-stepper-controls-next', nextProps?.class, step.current?.nextProps?.class]}
        />
      </div>
    </svelte:element>
  {/if}
{/snippet}

{#snippet content()}
  <NeoTransitionContainer overflow="hidden" key={active} {...transitionProps}>
    <div class="neo-stepper-content-step" in:inFn={inProps} out:outFn={outProps}>
      {#if step.current?.render}
        {@render step.current?.render(context)}
      {:else}
        {@render children?.(context)}
      {/if}
    </div>
  </NeoTransitionContainer>
{/snippet}

<svelte:element
  this={tag}
  class:neo-stepper={true}
  class:neo-vertical={vertical}
  class:neo-marks={progressMarks}
  style:--neo-stepper-steps={steps.length}
  {...rest}
>
  {#if placement === NeoStepperPlacement.End}
    <div class:neo-stepper-content={true}>
      {#if vertical}
        {@render content()}
        {@render buttons()}
      {:else}
        {@render buttons()}
        {@render content()}
      {/if}
    </div>
    {@render progressBar()}
  {:else}
    {@render progressBar()}
    <div class:neo-stepper-content={true}>
      {@render content()}
      {@render buttons()}
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-stepper {
    &-content {
      display: flex;
      flex-direction: column;

      &-step {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &-controls {
      display: flex;
      justify-content: space-between;
    }

    &:not(.neo-vertical) {
      :global(> .neo-progress-bar) {
        min-width: calc(4rem * var(--neo-stepper-steps, 1));
      }

      &:not(.neo-marks) :global(> .neo-progress-bar) {
        --neo-progress-margin-inline: var(--neo-shadow-margin, 0.625rem);
      }
    }

    &.neo-vertical {
      display: flex;

      :global(> .neo-progress-bar) {
        min-height: calc(4rem * var(--neo-stepper-steps, 1));
      }

      &:not(.neo-marks) :global(> .neo-progress-bar) {
        --neo-progress-margin-block: var(--neo-shadow-margin, 0.625rem);
      }
    }
  }
</style>
