<script lang="ts">
  import type { SwipeDirections } from '@dvcol/common-utils';
  import type { SwipeOptions } from '@dvcol/svelte-utils/swipe';

  import type { NeoProgressBarMarkContext, NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';
  import type {
    NeoStepperBeforeEvent,
    NeoStepperContext,
    NeoStepperEvent,
    NeoStepperNavigations,
    NeoStepperProps,
  } from '~/stepper/neo-stepper.model.js';
  import type { ShadowElevation } from '~/utils/shadow.utils.js';

  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { SwipeDirection } from '@dvcol/common-utils/common/touch';
  import { swipe } from '@dvcol/svelte-utils/swipe';
  import { fly, scale } from 'svelte/transition';

  import NeoArrowButton from '~/buttons/NeoArrowButton.svelte';
  import NeoCancelButton from '~/buttons/NeoCancelButton.svelte';
  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
  import { NeoProgressDirection } from '~/progress/neo-progress.model.js';
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import NeoProgressMark from '~/progress/NeoProgressMark.svelte';
  import { NeoStepperNavigation, NeoStepperPlacement } from '~/stepper/neo-stepper.model.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { Logger } from '~/utils/logger.utils.js';
  import { coerce, DefaultShadowShallowElevation, DefaultShallowMinMaxElevation } from '~/utils/shadow.utils.js';
  import { toPixel, toSize } from '~/utils/style.utils.js';
  import { quickDuration, shortDuration } from '~/utils/transition.utils.js';

  let {
    children,
    between,
    before,
    inside,
    after,

    // States
    ref = $bindable(),
    tag = 'div',
    steps = [],
    active = $bindable(0),
    loading = $bindable({
      navigate: false,
      previous: false,
      cancel: false,
      next: false,
    }),

    marks: progressMarks = true,
    progress = true,

    controls = true,
    previous,
    cancel = true,
    next,
    loop = false,
    swipe: swipeEnabled = true,

    disabled,

    // Styles
    vertical = false,
    placement = NeoStepperPlacement.Start,
    elevation: _elevation = DefaultShadowShallowElevation,
    borderless,
    rounded,

    // Size
    flex,
    width: _width,
    height: _height,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Methods
    onStep, // On step activation
    onBeforeStep, // Before step activation

    // Other props
    swipeProps,
    transitionProps,
    controlsProps,
    previousProps,
    cancelProps,
    nextProps,
    progressProps,
    markProps,
    buttonProps,
    ...rest
  }: NeoStepperProps = $props();

  const { tag: controlsTag = 'div', ...controlsRest } = $derived(controlsProps ?? {});

  const elevation = $derived(coerce(_elevation, DefaultShallowMinMaxElevation));
  const activeElevation = $derived((elevation > 1 ? -(elevation - 1) : -2) as ShadowElevation);

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

  const setLoading = debounce((reason: NeoStepperNavigations) => {
    loading[reason] = true;
  }, 200);

  const isLoading = $derived(loading && Object.values(loading).some(Boolean));
  const isControlDisabled = (control: 'previous' | 'cancel' | 'next'): boolean => {
    if (disabled || step.current?.disabled) return true;
    if (isLoading && !loading[control]) return true;
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
  const isDisabled = $derived({
    previous: isControlDisabled('previous'),
    cancel: isControlDisabled('cancel'),
    next: isControlDisabled('next'),
  });

  const emitStepEvent = async (
    reason: NeoStepperNavigations = NeoStepperNavigation.Navigate,
    index?: number,
  ): Promise<NeoStepperEvent | undefined> => {
    if (index !== undefined) {
      const event: NeoStepperBeforeEvent = { current: active, next: index, step: steps[active] };
      await Promise.all([step.current?.onBeforeStep?.(event, reason), onBeforeStep?.(event, reason)]);
      return;
    }
    const event: NeoStepperEvent = { previous: last, current: active, step: steps[active] };
    await Promise.all([step.current?.onStep?.(event, reason), onStep?.(event, reason)]);
    return event;
  };

  /**
   * This is imperative navigation, it will not check if next or previous constraints are met.
   * But, it will check if the target step is disabled.
   */
  export const goTo: NeoStepperContext['goToStep'] = async (
    index: number,
    reason: NeoStepperNavigations = NeoStepperNavigation.Navigate,
    target = steps[index],
  ) => {
    if (!target || target?.disabled) return;
    setLoading(reason).catch(Logger.error);
    try {
      await emitStepEvent(reason, index);
      last = active;
      active = index;
      return await emitStepEvent(reason);
    } finally {
      setLoading.cancel();
      loading[reason] = false;
    }
  };

  export const goPrevious: NeoStepperContext['goPrevious'] = async () => {
    if (isDisabled.previous) return;
    if (active > 0) return goTo(active - 1, NeoStepperNavigation.Previous);
    return goTo(steps.length - 1, NeoStepperNavigation.Previous);
  };

  export const goNext: NeoStepperContext['goNext'] = async () => {
    if (isDisabled.next) return;
    if (active < steps.length - 1) return goTo(active + 1, NeoStepperNavigation.Next);
    return goTo(0, NeoStepperNavigation.Next);
  };

  const isMarkDisabled = (index: number, target = steps[index]): boolean => {
    if (disabled || target?.disabled || isLoading) return true;
    if (index < active) {
      if (typeof canPrevious === 'boolean') return canPrevious === false;
      if (typeof canPrevious === 'number') return canPrevious < active - index;
      if (canPrevious !== undefined && canPrevious !== null) return !canPrevious;
    } else if (index > active) {
      if (typeof canNext === 'boolean') return canNext === false;
      if (typeof canNext === 'number') return canNext < index - active;
      if (canNext !== undefined && canNext !== null) return !canNext;
    }
    return false;
  };

  const onSwipe = (swipeDirection: SwipeDirections) => {
    if (!swipeEnabled || isLoading) return;
    if (swipeDirection === SwipeDirection.Left) goNext();
    else if (swipeDirection === SwipeDirection.Right) goPrevious();
    else if (vertical) {
      if (swipeDirection === SwipeDirection.Up) goNext();
      else if (swipeDirection === SwipeDirection.Down) goPrevious();
    }
  };

  const swipeOptions = $derived<SwipeOptions>({
    ...swipeProps,
    tolerances: {
      right: '50%',
      left: '50%',
      up: '50%',
      down: '50%',
      ...swipeProps?.tolerances,
    },
    onSwipe,
  });

  const context = $derived<NeoStepperContext>({
    step,
    active,
    last,

    goToStep: goTo,
    goPrevious,
    goNext,
  });

  let marksRefs = $state<NeoProgressBarProps['refs']>([]);
  let clientWidth = $state<number>(0);
  const markMargin = $derived.by(() => {
    if (!clientWidth) return;
    if (!marksRefs?.length || marksRefs.length < (marks?.length ?? 0)) return;
    return {
      start: toPixel((marksRefs[0]?.offsetWidth ?? 0) / 2),
      end: toPixel((marksRefs[marksRefs.length - 1]?.offsetWidth ?? 0) / 2),
    };
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      goTo,
      previous: goPrevious,
      next: goNext,
    });
  });

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

{#snippet mark(ctx: NeoProgressBarMarkContext)}
  {@const _disabled = isMarkDisabled(ctx.index)}
  <NeoProgressMark
    {...ctx}
    {rounded}
    {borderless}
    disabled={_disabled}
    readonly={_disabled}
    glass={progressProps?.glass}
    onclick={() => goTo(ctx.index)}
    label={(ctx.index + 1)?.toString()}
    {...markProps}
    {...steps[ctx.index]?.markProps}
  />
{/snippet}

{#snippet progressBar()}
  {#if progress}
    <div class="neo-stepper-progress" class:neo-marks={progressMarks}>
      <NeoProgressBar
        aria-label="Stepper progress"
        value={activeValue}
        mark={progressMarks ? mark : undefined}
        {marks}
        {rounded}
        {elevation}
        {borderless}
        direction={vertical ? NeoProgressDirection.Bottom : NeoProgressDirection.Right}
        {...progressProps}
        bind:refs={marksRefs}
      />
    </div>
  {/if}
{/snippet}

{#snippet buttons()}
  {#if controls}
    <svelte:element this={controlsTag} class:neo-stepper-controls={true} {...controlsRest}>
      {#if cancel}
        <NeoCancelButton
          type="reset"
          {rounded}
          {borderless}
          elevation={elevation > 0 ? elevation : 0}
          active={activeElevation}
          disabled={isDisabled.cancel}
          loading={loading.cancel}
          checked={loading.cancel}
          label="Cancel"
          aria-label="Cancel stepper"
          title="Cancel stepper"
          onclick={() => goTo(0, NeoStepperNavigation.Cancel)}
          transition={{ use: scale, props: { duration: quickDuration, start: 0.95 } }}
          {...buttonProps}
          {...cancelProps}
          {...step.current?.cancelProps}
          class={['neo-stepper-controls-previous', cancelProps?.class, step.current?.cancelProps?.class]}
        />
      {/if}
      <div class="neo-stepper-controls-lr">
        {#if active > 0 || loop}
          <NeoArrowButton
            {rounded}
            {borderless}
            elevation={elevation > 0 ? elevation : 0}
            active={activeElevation}
            disabled={isDisabled.previous}
            loading={loading.previous}
            checked={loading.previous}
            label="Previous"
            aria-label="Go to previous step"
            title="Go to previous step"
            onclick={goPrevious}
            transition={{ use: scale, props: { duration: shortDuration, start: 0.95 } }}
            direction={vertical ? 'up' : 'left'}
            {...buttonProps}
            {...previousProps}
            {...step.current?.previousProps}
            class={['neo-stepper-controls-previous', previousProps?.class, step.current?.previousProps?.class]}
          />
        {/if}
        <NeoArrowButton
          {rounded}
          {borderless}
          elevation={elevation > 0 ? elevation : 0}
          active={activeElevation}
          disabled={isDisabled.next}
          loading={loading.next}
          checked={loading.next}
          label="Next"
          aria-label="Go to next step"
          title="Go to next step"
          onclick={goNext}
          direction={vertical ? 'down' : 'right'}
          {...buttonProps}
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
  data-placement={placement}
  class:neo-stepper={true}
  class:neo-vertical={vertical}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-stepper-steps={steps.length}
  style:--neo-stepper-mark-margin-start={markMargin?.start}
  style:--neo-stepper-mark-margin-end={markMargin?.end}
  {...rest}
  use:swipe={swipeOptions}
  bind:clientWidth
>
  {@render before?.(context)}
  {@render progressBar()}
  {@render between?.(context)}
  <div class:neo-stepper-content={true}>
    {@render inside?.(context)}
    {@render content()}
    {@render buttons()}
  </div>
  {@render after?.(context)}
</svelte:element>

<style lang="scss">
  .neo-stepper {
    display: flex;
    flex-direction: column;
    width: 100%;

    &-progress {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      :global(> .neo-progress-bar > .neo-progress-bar-mark) {
        --neo-btn-bg-color: var(--neo-stepper-mark-bg-color);

        white-space: nowrap;
      }
    }

    &-content {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;

      &-step {
        display: flex;
        flex-direction: column;
        padding: var(--neo-shadow-margin, 0.625rem);
      }
    }

    &-controls {
      display: flex;
      justify-content: space-between;

      &-lr {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    &:not(.neo-vertical) {
      &[data-placement='end'],
      &[data-placement='end'] .neo-stepper-content {
        flex-direction: column-reverse;
      }

      .neo-stepper-progress {
        :global(> .neo-progress-bar) {
          min-width: calc(4rem * var(--neo-stepper-steps, 1));

          --neo-progress-margin-inline: var(--neo-stepper-mark-margin-start) var(--neo-stepper-mark-margin-end);
        }

        &:not(.neo-marks) :global(> .neo-progress-bar) {
          --neo-progress-margin-inline: var(--neo-shadow-margin, 0.625rem);
        }
      }
    }

    &.neo-vertical {
      flex-direction: row;

      &[data-placement='end'] {
        flex-direction: row-reverse;
      }

      .neo-stepper-progress {
        :global(> .neo-progress-bar) {
          min-height: calc(4rem * var(--neo-stepper-steps, 1));
        }

        &:not(.neo-marks) :global(> .neo-progress-bar) {
          --neo-progress-margin-block: var(--neo-shadow-margin, 0.625rem);
        }
      }
    }
  }
</style>
