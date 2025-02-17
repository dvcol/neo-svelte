<script lang="ts">
  import type { NeoButtonGroupContext, NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    DefaultShadowHoverElevation,
    getDefaultElevation,
    isShadowFlat,
    parseBlur,
  } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    skeleton = false,

    // Styles
    pressed,
    convex,
    borderless,
    start,
    color,
    glass,
    tinted,
    rounded,
    pulse,
    coalesce,
    vertical,
    nowrap,

    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    hover: _hover = 0,
    blur: _blur,
    button,

    // Flex
    justify,
    align,
    flex,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Other props
    ...rest
  }: NeoButtonGroupProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const hoverElevation = $derived(elevation + hover);

  const buttonHover = $derived(coerce(button?.hover ?? DefaultShadowHoverElevation));
  const buttonActive = $derived(coerce(button?.active ?? -3));

  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed, convex }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed, convex }) ?? boxShadow);

  const buttonHoverShadow = $derived(computeHoverShadowElevation(0, buttonHover, { glass }) ?? boxShadow);
  const buttonActiveShadow = $derived(computeShadowElevation(buttonActive, { glass, pressed: button?.pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));

  const context = $derived<NeoButtonGroupContext>({
    // States
    skeleton,

    // styles
    elevation,
    pressed,
    convex,
    borderless,
    rounded,
    color,
    glass,
    tinted,
    pulse,
    coalesce,
    vertical,
    start,
  });
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-button-group={true}
  class:neo-borderless={borderless}
  class:neo-start={start}
  class:neo-inset={elevation < 0}
  class:neo-hover={hover}
  class:neo-inset-hover={hoverElevation < 0}
  class:neo-flat={!elevation}
  class:neo-hover-flat={hoverFlat}
  class:neo-flat-hover={flatHover}
  class:neo-convex={convex}
  class:neo-glass={glass}
  class:neo-tinted={tinted}
  class:neo-rounded={rounded}
  class:neo-pulse={pulse}
  class:neo-coalesce={coalesce}
  class:neo-skeleton={skeleton}
  class:neo-vertical={vertical}
  class:neo-nowrap={nowrap}
  style:--neo-btn-group-text-color={getColorVariable(color)}
  style:--neo-btn-group-box-shadow={boxShadow}
  style:--neo-btn-group-box-shadow-hover={hoverShadow}
  style:--neo-btn-group-box-shadow-btn-hover={buttonHoverShadow}
  style:--neo-btn-group-box-shadow-btn-active={buttonActiveShadow}
  style:--neo-btn-group-glass-blur={filter}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {@render children?.(context)}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-button-group {
    display: inline-flex;
    flex: 0 1 auto;
    flex-flow: row wrap;
    gap: var(--neo-btn-group-gap, 0.375rem);
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: fit-content;
    margin: var(--neo-shadow-margin, 0.625rem);
    padding: 0.25rem;
    color: var(--neo-btn-group-text-color, inherit);
    background-color: var(--neo-btn-group-bg-color, transparent);
    background-clip: padding-box;
    border: var(--neo-border-width, 1px) var(--neo-btn-group-border-color, transparent) solid;
    border-radius: calc(var(--neo-btn-group-border-radius, var(--neo-border-radius)) + 0.25rem);
    box-shadow: var(--neo-btn-group-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
      border-color 0.3s linear,
      background-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;

    &.neo-nowrap {
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow: auto;
      white-space: nowrap;
    }

    &.neo-borderless {
      border-color: transparent !important;
    }

    &.neo-convex:not(.neo-inset),
    &.neo-inset:not(.neo-borderless) {
      padding: 0.375rem;
    }

    &.neo-hover.neo-flat-hover:hover,
    &.neo-hover.neo-flat-hover:global(:has(> *:focus-visible)),
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:global(:has(> *:focus-visible))) {
      border-color: var(--neo-btn-group-border-color, var(--neo-border-color));

      &:global(:has(> *:focus-visible)),
      &:hover {
        border-color: var(--neo-btn-group-border-color-hover, var(--neo-border-color-highlight));
      }
    }

    &:global(:has(> *:focus-visible)),
    &.neo-hover:hover {
      box-shadow: var(--neo-btn-group-box-shadow-hover, var(--neo-btn-group-box-shadow));
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }

    &.neo-glass {
      --neo-box-shadow-flat: var(--neo-glass-box-shadow-flat);
      --neo-box-shadow-inset-1: var(--neo-glass-box-shadow-inset-1);
      --neo-box-shadow-inset-2: var(--neo-glass-box-shadow-inset-2);
      --neo-box-shadow-inset-3: var(--neo-glass-box-shadow-inset-3);
      --neo-box-shadow-raised-3: var(--neo-glass-box-shadow-raised-3);
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);

      background-color: var(--neo-btn-groupbg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-btn-group-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-btn-group-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      :global(.neo-button) {
        background-color: transparent;
        backdrop-filter: none;
      }

      &.neo-convex,
      &.neo-inset,
      &.neo-inset-hover:hover {
        border-color: var(--neo-btn-group-border-color, transparent);
      }

      &.neo-hover.neo-flat-hover:hover,
      &.neo-hover.neo-flat-hover:global(:has(> *:focus-visible)),
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:global(:has(> *:focus-visible))) {
        border-color: var(--neo-btn-group-border-color, var(--neo-glass-border-color-flat));

        &:global(:has(> *:focus-visible)),
        &:hover {
          border-color: var(--neo-btn-group-border-color-hover, var(--neo-border-color-flat-highlight));
        }
      }
    }

    :global(.neo-button) {
      margin: 0;
      border-color: transparent !important;
    }

    :global(.neo-button .neo-content) {
      scale: 1 !important;
    }

    :global(.neo-button:disabled:not(.neo-pressed)),
    :global(.neo-button[disabled]:not([disabled='false'], .neo-pressed)) {
      box-shadow: var(--neo-box-shadow-flat) !important;
    }

    :global(.neo-button:not(:active:not(.neo-loading), .neo-pressed)) {
      box-shadow: var(--neo-box-shadow-flat);
    }

    :global(.neo-button:not(.neo-flat, :active:not(.neo-loading), .neo-pressed):hover) {
      box-shadow: var(--neo-btn-group-box-shadow-btn-hover);
    }

    :global(.neo-button.neo-pressed),
    :global(.neo-button:active:not(.neo-loading)) {
      box-shadow: var(--neo-btn-group-box-shadow-btn-active);
    }

    &.neo-pulse {
      @include mixin.pulse(
        $scaleX: var(--neo-btn-group-scale-x, 1.2),
        $scaleY: var(--neo-btn-group-scale-y, 2),
        $box-shadow: var(--neo-btn-group-box-shadow),
        $box-shadow-reverse: var(--neo-btn-group-box-shadow)
      );
    }

    &.neo-coalesce {
      @include mixin.coalesce(
        $scaleX: var(--neo-btn-group-scale-x, 1.2),
        $scaleY: var(--neo-btn-group-scale-y, 2),
        $box-shadow: var(--neo-btn-group-box-shadow),
        $box-shadow-reverse: var(--neo-btn-group-box-shadow)
      );
    }

    &.neo-rounded {
      padding: 0.25rem 0.3125rem;
      border-radius: var(--neo-btn-groupborder-radius-rounded, var(--neo-border-radius-lg));

      :global(.neo-button) {
        border-radius: var(--neo-btn-groupborder-radius-rounded, var(--neo-border-radius-lg));
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;
    }

    &:not(.neo-vertical) :global(.neo-divider) {
      --neo-divider-margin: 0.125rem;

      max-height: calc(var(--neo-line-height) + 0.125rem * 2);
    }

    &.neo-tinted {
      background-color: var(--neo-btn-group-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-vertical {
      flex-direction: column;

      :global(.neo-divider) {
        max-width: calc(100% - 0.5rem);
      }

      --neo-btn-group-scale-x: 1.75;
      --neo-btn-group-scale-y: 1.5;

      :global(.neo-button) {
        width: 100%;
      }

      &.neo-rounded {
        padding: 0.5rem;
      }
    }
  }
</style>
