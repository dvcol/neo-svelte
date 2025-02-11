<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { clamp } from '@dvcol/common-utils/common/math';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { flip, offset, useFloating } from '@skeletonlabs/floating-ui-svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import { fade } from 'svelte/transition';

  import type { DragEventHandler, FocusEventHandler, KeyboardEventHandler, PointerEventHandler } from 'svelte/elements';
  import type { NeoRangeContext, NeoRangeHTMLElement, NeoRangeProps, NeoRangeValidationState, NeoRangeValue } from '~/inputs/neo-range.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeShadowElevation, DefaultShadowShallowElevation, DefaultShallowMinMaxElevation } from '~/utils/shadow.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    tooltip,
    message,
    error,
    before,
    after,

    // State
    id = label ? `neo-range-${getUUID()}` : undefined,
    ref = $bindable(),
    value = $bindable(0),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    hovered = $bindable(false),
    disabled,
    readonly,
    loading,
    validation,
    min = 0,
    max = 100,
    step,

    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    tooltips = true,
    skeleton = false,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Other props
    labelRef = $bindable(),
    labelProps,
    messageProps,
    containerProps,
    wrapperRef = $bindable(),
    wrapperProps,
    floatingProps,
    floatingOptions,
    ..._rest
  }: NeoRangeProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});
  const { elevation: _elevation = DefaultShadowShallowElevation, ...rest } = $derived(_rest);

  const elevation = $derived(coerce(_elevation));

  const isArray = $derived(Array.isArray(value));
  const initial = $state<NeoRangeValue>(Array.isArray(value) ? [...value] : value);
  const lower = $derived(typeof value === 'number' ? value : value?.[0]);
  const upper = $derived(typeof value === 'number' ? undefined : value?.[1]);

  // TODO - vertical

  const lowerProgress = $derived(((lower - min) / (max - min)) * 100);
  const upperProgress = $derived(upper ? ((upper - min) / (max - min)) * 100 : undefined);

  const boxShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation));

  const show = $derived(tooltips && (focused || hovered));
  const lowerTooltip = useFloating({
    get open() {
      return show;
    },
    placement: 'bottom',
    middleware: [flip(), offset(6)],
    ...floatingOptions,
  });

  const upperTooltip = useFloating({
    get open() {
      return show;
    },
    placement: 'bottom',
    middleware: [flip(), offset(6)],
    ...floatingOptions,
  });

  const updateTooltips = () => {
    lowerTooltip.update();
    if (isArray) upperTooltip.update();
  };

  const onPointerEnter: PointerEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerRest?.onpointerenter?.(e);
  };

  const onPointerLeave: PointerEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerRest?.onpointerleave?.(e);
  };

  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    focused = true;
    containerRest?.onfocusin?.(e);
  };

  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    focused = false;
    containerRest?.onfocusout?.(e);
  };

  const setValue = (v: number, index = 0) => {
    if (!Array.isArray(value)) value = v;
    else if (index === 0 && v >= value[1]) value = [value[1], value[1]];
    else if (index === 1 && v <= value[0]) value = [value[0], value[0]];
    else value[index] = v;
    updateTooltips();
    return value;
  };

  const stepUp = (index = 0) => {
    if (disabled || readonly) return value;
    return setValue((index ? (upper ?? 0) : lower) - (step || 1), index);
  };
  const stepDown = (index = 0) => {
    if (disabled || readonly) return value;
    return setValue((index ? (upper ?? 0) : lower) + (step || 1), index);
  };

  const validity = $derived<NeoRangeValidationState>({
    touched,
    dirty,
    valid,
    value,
    initial,
  });

  const updateState = (val = value) => {
    touched = true;
    if (Array.isArray(val)) {
      if (Array.isArray(initial)) dirty = val[0] !== initial[0] || val[1] !== initial[1];
      valid = val.every((v: number) => v >= min && v <= max);
      return { ...validity };
    }
    dirty = val !== initial;
    valid = val >= min && val <= max;

    return { ...validity };
  };

  let lastIndex = $state(0);
  let rail = $state<HTMLElement>();
  const updateValue = (event: PointerEvent, index = 0) => {
    if (disabled || readonly || !rail) return;
    const { width, left } = rail.getBoundingClientRect();
    const diff = event.clientX - left;
    const ratio = clamp(diff / width, 0, 1);
    const val = Math.round(min + ratio * (max - min));

    if (step) {
      const stepped = Math.round(val / step) * step;
      setValue(stepped, index);
    } else setValue(val, index);

    updateState();
    lastIndex = index;
  };

  const getDragHandler = (element: HTMLElement, index = 0) => {
    const onMove: PointerEventHandler<HTMLElement> = event => {
      if (!element) return;
      updateValue(event, index);
    };

    const onUp: PointerEventHandler<HTMLElement> = event => {
      if (!element) return;
      element.removeEventListener('pointermove', onMove as EventListener);
      element.removeEventListener('pointerup', onUp as EventListener);
      element.releasePointerCapture(event.pointerId);
    };

    const onDown: PointerEventHandler<HTMLElement> = event => {
      if (disabled || readonly) return;
      if (!element || !rail) return;
      event.stopPropagation();
      element.setPointerCapture(event.pointerId);
      element.addEventListener('pointermove', onMove as EventListener);
      element.addEventListener('pointerup', onUp as EventListener);
    };

    const onDrag: DragEventHandler<HTMLElement> = e => e.preventDefault();

    const onArrow: KeyboardEventHandler<HTMLElement> = e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepUp(index);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepDown(index);
      }
    };

    return {
      onpointercancel: onUp,
      onpointerdown: onDown,
      onpointerup: onUp,
      ondragstart: onDrag,
      onkeydown: onArrow,
    };
  };

  const handler = $derived(getDragHandler(lowerTooltip.elements.reference as HTMLElement));
  const progressHandler = $derived(getDragHandler(upperTooltip.elements.reference as HTMLElement, 1));

  const onClick: PointerEventHandler<HTMLElement> = e => {
    let index = 0;
    if (isArray && lowerTooltip?.elements.reference && upperTooltip?.elements.reference) {
      // select handle closest to the click
      const lowerOffset = Math.abs(e.clientX - lowerTooltip.elements.reference.getBoundingClientRect().left);
      const upperOffset = Math.abs(upperTooltip.elements.reference.getBoundingClientRect().left - e.clientX);
      index = lowerOffset <= upperOffset ? 0 : 1;
    }
    updateValue(e, index);
    if (index === 0) handler.onpointerdown(e);
    else progressHandler.onpointerdown(e);
  };

  $effect(() => {
    if (Array.isArray(value)) {
      value[0] = clamp(value[0], min, max);
      value[1] = clamp(value[1], min, max);
    } else {
      value = clamp(value, min, max);
    }
    updateTooltips();
  });

  $effect(() => {
    if (innerWidth.current) updateTooltips();
  });

  const context = $derived<NeoRangeContext>({
    // Ref
    ref,

    // State
    focused,
    hovered,
    disabled,
    readonly,

    loading,
    min,
    max,
    step,

    value,
    touched,
    dirty,
    valid,

    // Styles
    tooltips,
    rounded,
    glass,
    start,
    skeleton,
    elevation,

    // Methods
    stepUp,
    stepDown,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      get value() {
        return value;
      },
      get initial() {
        return initial;
      },
      get isArray() {
        return isArray;
      },
      get lower() {
        return lower;
      },
      get upper() {
        return upper;
      },
      get validity() {
        return validity;
      },
      stepUp,
      stepDown,
    } satisfies Partial<NeoRangeHTMLElement>);
  });

  let slider = $state<HTMLElement>();
  let rangeHeight = $state<string>();
  const updateSize = () => {
    if (!slider) return;
    const height = slider?.getBoundingClientRect().height;
    if (!height) return;
    rangeHeight = `${height}px`;
  };
  $effect(updateSize);

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<NeoInputValidation
  bind:ref={wrapperRef}
  {valid}
  {validation}
  {error}
  {context}
  {message}
  {messageProps}
  {rounded}
  in={inAction}
  out={outAction}
  transition={transitionAction}
  {...wrapperProps}
  style={toStyle('--neo-validation-padding: 0', wrapperProps?.style)}
>
  <svelte:element
    this={containerTag}
    bind:this={ref}
    role="none"
    class:neo-range-container={true}
    style:--neo-range-height={rangeHeight}
    use:useFn={useProps}
    out:outFn={outProps}
    in:inFn={inProps}
    {...containerRest}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
  >
    {#if lowerTooltip.open}
      <span
        class:neo-range-value={true}
        class:neo-rounded={rounded}
        style:--neo-range-handler-z-index={lastIndex ? 0 : 1}
        transition:fade={quickDurationProps}
        {...floatingProps}
        bind:this={lowerTooltip.elements.floating}
        style={toStyle(lowerTooltip.floatingStyles, floatingProps?.style)}
      >
        {#if tooltip}
          {@render tooltip({ lower: true, upper: false, value: lower, context })}
        {:else}
          {lower}
        {/if}
      </span>
    {/if}
    {#if isArray && upperTooltip.open}
      <span
        class:neo-range-value={true}
        class:neo-rounded={rounded}
        transition:fade={quickDurationProps}
        {...floatingProps}
        bind:this={upperTooltip.elements.floating}
        style={toStyle(upperTooltip.floatingStyles, floatingProps?.style)}
      >
        {#if tooltip}
          {@render tooltip({ lower: false, upper: true, value: upper, context })}
        {:else}
          {upper}
        {/if}
      </span>
    {/if}
    <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {...labelProps}>
      <span class="neo-range-label-container">
        {#if before !== undefined}
          <span class="neo-range-prefix">
            {@render before(context)}
          </span>
        {/if}
        <span
          bind:this={slider}
          class:neo-range-slider={true}
          class:neo-rounded={rounded}
          class:neo-start={start}
          class:neo-glass={glass}
          class:neo-tinted={tinted}
          class:neo-disabled={disabled}
          class:neo-skeleton={skeleton}
          class:neo-flat={!elevation}
          class:neo-valid={validation && valid}
          class:neo-invalid={validation && !valid}
          style:--neo-range-color={getColorVariable(color)}
          style:--neo-range-box-shadow={boxShadow}
          style:--neo-range-progress="{lowerProgress}%"
          style:--neo-range-array-progress="{upperProgress}%"
          {...rest}
        >
          <span role="region" class="neo-range-rail" bind:this={rail} onpointerdown={onClick}>
            <span class="neo-range-handle-before" class:neo-array={isArray}>
              <!--   handle before   -->
            </span>
            <button
              bind:this={lowerTooltip.elements.reference}
              class="neo-range-handle"
              style:--neo-range-handler-z-index={lastIndex ? 0 : 1}
              aria-label="Drag to set {isArray ? 'lower ' : ''}value"
              {...handler}
            >
              <!--   handle handle   -->
            </button>
            {#if isArray}
              <span class="neo-range-handle-before neo-range">
                <!--   handle before   -->
              </span>
              <button bind:this={upperTooltip.elements.reference} class="neo-range-handle" aria-label="Drag to set upper value" {...progressHandler}>
                <!--   handle handle   -->
              </button>
            {/if}
            <span class="neo-range-handle-after">
              <!--   handle after   -->
            </span>
          </span>
        </span>
        {#if loading !== undefined || after !== undefined}
          <span class="neo-range-suffix">
            {#if after}
              {@render after(context)}
            {/if}
            {#if loading}
              <span class="neo-range-loading" out:fade={quickDurationProps}>
                <IconCircleLoading size="1rem" />
              </span>
            {/if}
          </span>
        {/if}
      </span>
    </NeoLabel>
  </svelte:element>
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-range {
    &-container {
      --neo-range-min-width: calc(var(--neo-range-height) / 2);
      --neo-range-height: var(--neo-line-height-sm, 1.25rem);
      --neo-range-spacing: 0.125rem;
      --neo-label-padding: 0;
      --neo-label-margin: var(--neo-shadow-margin) 0.25rem;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-width: min(calc(var(--neo-range-height) * 12), 20rem);
      margin: 0;
      padding: calc(0.375rem + var(--neo-range-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;
    }

    &-rail {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      margin-right: calc(var(--neo-range-min-width) - var(--neo-range-spacing));
      margin-left: var(--neo-range-min-width);
      background-color: var(--neo-range-rail-background, transparent);
      border-radius: var(--neo-range-border-radius, var(--neo-border-radius-sm));
      transition: background-color 0.3s ease;
    }

    &-handle {
      z-index: calc(var(--neo-z-index-in-front, 1) + var(--neo-range-handler-z-index, 0));
      display: inline-flex;
      align-self: center;
      box-sizing: border-box;
      height: 100%;
      margin: 0 calc(0% - var(--neo-range-height) / 2);
      padding: 0;
      color: inherit;
      background: var(--neo-range-handle-background, var(--neo-background-color));
      border: 1px solid var(--neo-range-handle-border-color, transparent);
      border-radius: var(--neo-border-radius-sm);
      outline: none;
      box-shadow: var(--neo-range-handle-box-shadow, var(--neo-box-shadow-convex-2));
      backface-visibility: hidden;
      cursor: grab;
      transition: scale 0.3s ease;
      appearance: none;
      touch-action: none;
      aspect-ratio: 1 / 1;

      &:active {
        cursor: grabbing;
        scale: 0.95;
      }

      &:focus-visible {
        outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      }

      &-before,
      &-after {
        display: inline-flex;
        box-sizing: border-box;
        height: calc(100% - var(--neo-range-spacing) * 2);
        margin: var(--neo-range-spacing);
        border-radius: var(--neo-border-radius-xs);
      }

      &-before {
        width: calc(var(--neo-range-min-width) - var(--neo-range-spacing) + var(--neo-range-progress, 0%));

        &:not(.neo-range) {
          margin-right: 0;
          margin-left: calc(var(--neo-range-spacing) - var(--neo-range-min-width));
        }

        &.neo-range {
          width: calc(var(--neo-range-min-width) - var(--neo-range-progress, 0%) + var(--neo-range-array-progress, 0%));
          min-width: calc((var(--neo-range-spacing) / 2 + var(--neo-range-min-width)));
          margin-inline: calc((var(--neo-range-spacing) - var(--neo-range-min-width)) / 2);
        }

        &:not(.neo-array) {
          background-color: var(--neo-range-checked-background, color-mix(in srgb, transparent, currentcolor 30%));
        }
      }

      &-after {
        flex: 1 1 auto;
        margin-right: calc(var(--neo-range-spacing) - var(--neo-range-min-width));
        margin-left: 0;
        background-color: var(--neo-range-rail-background, color-mix(in srgb, transparent, currentcolor 1%));
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }

    &-slider {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-width: calc(var(--neo-range-height) * 1.8);
      height: var(--neo-range-height);
      margin: 0;
      padding: 0;
      color: var(--neo-range-color, inherit);
      text-decoration: none;
      background: transparent;
      border: var(--neo-range-border-width, var(--neo-border-width, 1px)) var(--neo-range-border-color, transparent) solid;
      border-radius: var(--neo-range-border-radius, var(--neo-border-radius));
      outline: none;
      box-shadow: var(--neo-range-box-shadow, var(--neo-box-shadow-pressed-2));
      cursor: pointer;
      transition:
        color 0.3s ease,
        box-shadow 0.3s ease,
        border-radius 0.3s ease,
        border-color 0.3s ease,
        background-color 0.3s ease;

      &:hover {
        color: var(--neo-range-color-hover, var(--neo-text-color-highlight));
      }

      &.neo-rounded {
        border-radius: calc(var(--neo-range-height) / 2);

        .neo-range-handle {
          border-radius: 50%;

          &-before,
          &-after {
            border-radius: calc(var(--neo-range-height) / 2);
          }
        }
      }

      &.neo-valid {
        --neo-range-checked-background: color-mix(in srgb, transparent, var(--neo-range-valid-color, var(--neo-color-success)) 30%);
      }

      &.neo-invalid {
        --neo-range-checked-background: color-mix(in srgb, transparent, var(--neo-range-invalid-color, var(--neo-color-error)) 30%);
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        box-shadow: var(--neo-box-shadow-flat);
        cursor: not-allowed;
        opacity: var(--neo-range-opacity-disabled, var(--neo-opacity-disabled));
      }

      &.neo-flat:hover {
        border-color: var(--neo-range-border-color-hover, var(--neo-border-color-highlight));
      }

      &.neo-disabled,
      &.neo-flat {
        --neo-range-min-width: calc(var(--neo-range-height) / 2 - 2px);

        border-color: var(--neo-range-border-color, var(--neo-border-color));

        .neo-range-rail {
          margin-right: calc(var(--neo-range-min-width) + var(--neo-range-spacing));
          margin-left: var(--neo-range-min-width);
        }

        .neo-range-handle {
          background-color: var(--neo-range-border-color, currentcolor);
          box-shadow: var(--neo-box-shadow-flat);

          &:active {
            scale: 1;
          }

          &-after,
          &-before {
            height: 100%;
            border-radius: inherit;
          }

          &-before {
            width: calc(var(--neo-range-min-width) + var(--neo-range-spacing) + var(--neo-range-progress, 0%));

            &.neo-array {
              margin-inline: calc((0% - var(--neo-range-min-width)) / 2);
            }

            &:not(.neo-array) {
              margin-left: calc(0% - var(--neo-range-min-width));
            }

            &.neo-range {
              width: calc(
                var(--neo-range-min-width) * 2 - var(--neo-range-spacing) * 1.5 - var(--neo-range-progress, 0%) + var(--neo-range-array-progress, 0%)
              );
            }
          }
        }
      }

      &:focus-visible {
        border-color: var(--neo-range-border-color-focused, var(--neo-border-color-focused));
      }

      &.neo-glass {
        background-color: var(--neo-range-bg-color, var(--neo-glass-background-color));
        border-color: var(--neo-range-border-color, transparent);
        backdrop-filter: var(--neo-range-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));

        &.neo-flat {
          border-color: var(--neo-range-border-color, var(--neo-glass-border-color-flat));
        }
      }

      &.neo-start {
        @starting-style {
          box-shadow: var(--neo-box-shadow-flat);
        }
      }

      &.neo-tinted {
        background-color: var(--neo-input-bg-color, var(--neo-background-color-tinted));
      }

      &.neo-skeleton {
        box-shadow: var(--neo-box-shadow-flat);
        pointer-events: none;

        @include mixin.skeleton;
      }
    }

    &-label-container {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
    }

    &-prefix {
      display: inline-flex;
      align-items: center;
    }

    &-suffix {
      display: inline-flex;
      align-items: center;
      min-width: 1rem;
      min-height: 1rem;
    }

    &-loading {
      display: inline-flex;
      width: 1rem;
      height: 1rem;
    }

    &-value {
      --neo-tooltip-z-index: calc(var(--neo-z-index-in-front, 1) + var(--neo-range-handler-z-index, 0));
      --neo-tooltip-padding: 0.125rem 0.375rem;

      @include mixin.tooltip;

      &.neo-rounded {
        --neo-tooltip-border-radius: var(--neo-tooltip-border-radius-lg, var(--neo-border-radius-lg));
      }
    }
  }
</style>
