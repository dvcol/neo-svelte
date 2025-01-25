<script lang="ts">
  import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    skeleton,

    // Styles
    pressed,
    convex,
    borderless,
    start,
    glass,
    rounded,
    pulse,
    coalesce,
    vertical,
    nowrap,

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

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(pressed)));

  const filter = $derived(computeGlassFilter(elevation, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed, convex }));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-button-group={true}
  class:neo-borderless={borderless}
  class:neo-start={start}
  class:neo-flat={!elevation}
  class:neo-convex={convex}
  class:neo-inset={elevation < 0}
  class:neo-glass={glass}
  class:neo-rounded={rounded}
  class:neo-pulse={pulse}
  class:neo-coalesce={coalesce}
  class:neo-skeleton={skeleton}
  class:neo-vertical={vertical}
  class:neo-nowrap={nowrap}
  style:--neo-btn-group-box-shadow={boxShadow}
  style:--neo-btn-group-glass-blur={filter}
  style:justify-content={justify}
  style:align-items={align}
  style:flex
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  {@render children?.({
    // States
    skeleton,

    // styles
    elevation,
    pressed,
    convex,
    borderless,
    rounded,
    glass,
    pulse,
    coalesce,
    vertical,
    start,
  })}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-button-group {
    display: inline-flex;
    flex: 0 1 auto;
    flex-flow: row wrap;
    gap: var(--neo-btn-grp-gap, 0.25rem);
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: fit-content;
    margin: var(--neo-shadow-margin, 0.625rem);
    padding: 0.25rem;
    background-color: var(--neo-btn-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-btn-border-color, transparent) solid;
    border-radius: calc(var(--neo-btn-border-radius, var(--neo-border-radius)) + 0.25rem);
    box-shadow: var(--neo-btn-group-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
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

    &.neo-flat:not(.neo-borderless) {
      border-color: var(--neo-btn-border-color, var(--neo-border-color));
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.neo-glass, .neo-borderless) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &.neo-glass {
      @include mixin.glass;

      background-color: var(--neo-btn-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-btn-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-btn-group-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      :global(.neo-button) {
        background-color: transparent;
        backdrop-filter: none;
      }

      &.neo-convex,
      &.neo-inset {
        border-color: var(--neo-btn-border-color, transparent);
      }

      &.neo-flat {
        border-color: var(--neo-btn-border-color, var(--neo-glass-border-color-flat));
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
      box-shadow: var(--neo-box-shadow-inset-1);
    }

    :global(.neo-button.neo-pressed),
    :global(.neo-button:active:not(.neo-loading)) {
      --neo-box-shadow-pressed-2: var(--neo-box-shadow-inset-3);
      --neo-glass-box-shadow-pressed-2: var(--neo-glass-box-shadow-inset-3);
    }

    &.neo-pulse {
      @include mixin.pulse(
        $scaleX: var(--neo-btn-grp-scale-x, 1.2),
        $scaleY: var(--neo-btn-grp-scale-y, 2),
        $box-shadow-reverse: var(--neo-pulse-box-shadow-reverse, var(--neo-box-shadow-raised-3))
      );
    }

    &.neo-coalesce {
      @include mixin.coalesce(
        $scaleX: var(--neo-btn-grp-scale-x, 1.2),
        $scaleY: var(--neo-btn-grp-scale-y, 2),
        $box-shadow-reverse: var(--neo-coalesce-box-shadow-reverse, var(--neo-box-shadow-raised-3))
      );
    }

    &.neo-rounded {
      padding: 0.25rem 0.3125rem;
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));

      :global(.neo-button) {
        border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));
      }
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;
    }

    &.neo-vertical {
      flex-direction: column;

      --neo-btn-grp-scale-x: 1.75;
      --neo-btn-grp-scale-y: 1.5;

      :global(.neo-button) {
        width: 100%;
      }

      &.neo-rounded {
        padding: 0.5rem;
      }
    }
  }
</style>
