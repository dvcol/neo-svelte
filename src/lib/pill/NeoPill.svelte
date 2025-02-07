<script lang="ts">
  /* eslint-disable prefer-const -- necessary for binding checked */

  import type { NeoPillContext, NeoPillProps } from '~/pill/neo-pill.model.js';

  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    DefaultShallowMinMaxElevation,
    isShadowFlat,
  } from '~/utils/shadow.utils.js';

  let {
    children,

    tag = 'div',
    close,
    color,
    loading,
    disabled,
    skeleton = false,

    borderless,
    rounded = true,
    pressed,
    convex,
    glass,
    start,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    onClose,

    // Other props
    affixProps,
    ...rest
  }: NeoPillProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? 0));
  const hover = $derived(coerce(rest?.hover ?? 0));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed, convex }, DefaultShallowMinMaxElevation));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }, DefaultShallowMinMaxElevation) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const filter = $derived(computeGlassFilter(elevation, glass));

  const context = $derived<NeoPillContext>({
    close,
    color,
    loading,
    disabled,
    skeleton,
    elevation,

    borderless,
    rounded,
    pressed,
    convex,
    glass,
    start,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  class="neo-pill"
  class:neo-borderless={borderless}
  class:neo-rounded={rounded}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-pressed={pressed}
  class:neo-convex={convex}
  class:neo-glass={glass}
  class:neo-start={start}
  class:neo-hover={hover}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-flat={!elevation}
  class:neo-inset={elevation < 0}
  style:--neo-pill-glass-blur={filter}
  style:--neo-pill-box-shadow={boxShadow}
  style:--neo-pill-hover-shadow={hoverShadow}
  style:--neo-pill-text-color={getColorVariable(color)}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {@render children?.(context)}
  {#if close || loading}
    <NeoAffix
      size="1rem"
      {loading}
      {skeleton}
      {disabled}
      {close}
      {...affixProps}
      closeProps={{
        'aria-label': 'close',
        onclick: onClose,
        ...affixProps?.closeProps,
      }}
      class={['neo-pill-affix', affixProps?.class]}
    />
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-pill {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    margin: 0;
    color: var(--neo-pill-text-color, inherit);
    padding-block: 0.125rem;
    padding-inline: 0.5rem;
    border: var(--neo-pill-border-width, var(--neo-border-width, 1px)) var(--neo-pill-border-color, transparent) solid;
    border-radius: var(--neo-pill-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-pill-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
      padding 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &:focus-within,
    &.neo-hover:hover {
      box-shadow: var(--neo-pill-hover-shadow, var(--neo-box-shadow-flat));
    }

    :global(> .neo-pill-affix) {
      margin-inline-start: 0.3125rem;
      padding: 0;
    }

    &.neo-hover.neo-flat-hover:hover,
    &.neo-hover.neo-flat-hover:focus-within,
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-within) {
      border-color: var(--neo-pill-border-color, var(--neo-border-color));
    }

    &.neo-disabled {
      box-shadow: var(--neo-box-shadow-flat);
      opacity: var(--neo-pill-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.neo-borderless) {
        border-color: var(--neo-pill-border-color-disabled, var(--neo-border-color-disabled));
      }
    }

    &.neo-borderless {
      border-color: transparent;
    }

    &.neo-rounded {
      padding-inline: 0.625rem;
      border-radius: var(--neo-pill-border-radius, var(--neo-border-radius-lg));
    }

    &.neo-convex:not(.neo-flat, .neo-inset) {
      padding-block: 0.1875rem;
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-pill-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-pill-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &.neo-convex,
      &.neo-inset {
        border-color: var(--neo-pill-border-color, transparent);
      }

      &:not(.neo-inset, .neo-convex, .neo-borderless, .neo-flat, .neo-disabled) {
        border-color: var(
          --neo-pill-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-flat:not(.neo-borderless) {
        border-color: var(--neo-pill-border-color, var(--neo-glass-border-color-flat));
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.neo-borderless) {
          border-color: var(--neo-pill-border-color, var(--neo-border-color));
        }
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton($text: transparent);
    }
  }
</style>
