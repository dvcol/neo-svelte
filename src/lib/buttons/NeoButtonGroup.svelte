<script lang="ts">
  import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    skeleton,

    // Styles
    class: classNames,
    start,
    text,
    flat,
    glass,
    inset,
    shallow,
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
  class={['neo-button-group', classNames].filter(Boolean).join(' ')}
  class:start
  class:text
  class:flat
  class:glass
  class:shallow
  class:inset
  class:rounded
  class:pulse
  class:coalesce
  class:skeleton
  class:vertical
  class:nowrap
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
    start,
    text,
    flat,
    glass,
    rounded,
    pulse,
    coalesce,
    vertical,
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
    margin: var(--neo-shadow-margin, 0.25rem);
    padding: 0.25rem;
    background-color: var(--neo-btn-bg-color, transparent);
    border: var(--neo-border-width, 1px) var(--neo-btn-border-color, transparent) solid;
    border-radius: calc(var(--neo-btn-border-radius, var(--neo-border-radius)) + 0.25rem);
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease-out;

    &.nowrap {
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow: auto;
      white-space: nowrap;
    }

    &.flat {
      border-color: var(--neo-btn-border-color, var(--neo-border-color));
    }

    &.text {
      border-color: transparent !important;
    }

    &:not(.text, .flat, .glass) {
      box-shadow: var(--neo-box-shadow-raised-2);
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.text, .glass) {
          border-color: var(--neo-btn-border-color, var(--neo-border-color));
        }
      }
    }

    &.glass {
      background-color: var(--neo-glass-background-color);
      border-top-color: var(--neo-glass-border-color);
      border-left-color: var(--neo-glass-border-color);
      backdrop-filter: var(--neo-blur-4);

      &:not(.text, .flat) {
        box-shadow: var(--neo-glass-box-shadow-raised-2);
      }

      :global(.neo-button) {
        background-color: transparent;
        backdrop-filter: none;
      }

      :global(.neo-button:not(:active, .pressed)) {
        box-shadow: var(--neo-glass-box-shadow-flat);
      }
    }

    :global(.neo-button) {
      margin: 0;
      border-color: transparent !important;
    }

    :global(.neo-button[disabled]:not([disabled='false'], .skeleton)) {
      border-color: transparent !important;
    }

    :global(.neo-button[disabled]:not([disabled='false'], .skeleton, .pressed)) {
      box-shadow: var(--neo-box-shadow-flat) !important;
    }

    :global(.neo-button:not(:active, .pressed)) {
      box-shadow: var(--neo-box-shadow-flat);
    }

    :global(.neo-button.loading:active:not(.pressed)),
    :global(.neo-button:not(.flat, .text, :active, .pressed):hover) {
      box-shadow: var(--neo-box-shadow-inset-1);
    }

    :global(.neo-button.pulse::after),
    :global(.neo-button.pulse::before),
    :global(.neo-button.coalesce::after),
    :global(.neo-button.coalesce::before) {
      animation: none;
    }

    &.pulse:not(.skeleton) {
      @include mixin.pulse(
        $scaleX: var(--neo-btn-grp-scale-x, 1.2),
        $scaleY: var(--neo-btn-grp-scale-y, 2),
        $box-shadow-reverse: var(--neo-pulse-box-shadow-reverse, var(--neo-box-shadow-raised-2))
      );
    }

    &.coalesce:not(.skeleton) {
      @include mixin.coalesce(
        $scaleX: var(--neo-btn-grp-scale-x, 1.2),
        $scaleY: var(--neo-btn-grp-scale-y, 2),
        $box-shadow-reverse: var(--neo-coalesce-box-shadow-reverse, var(--neo-box-shadow-raised-2))
      );
    }

    &.shallow:not(.inset) {
      --neo-coalesce-box-shadow: var(--neo-box-shadow-raised-1);
      --neo-pulse-box-shadow: var(--neo-box-shadow-raised-1);
      --neo-coalesce-box-shadow-reverse: var(--neo-box-shadow-inset-0);
      --neo-pulse-box-shadow-reverse: var(--neo-box-shadow-inset-0);

      &:not(.text, .flat, .glass) {
        box-shadow: var(--neo-box-shadow-raised-1);
      }

      &.glass {
        box-shadow: var(--neo-glass-box-shadow-raised-1);
      }

      :global(.neo-button.loading:active:not(.pressed)),
      :global(.neo-button:not(.flat, .text, :active, .pressed):hover) {
        box-shadow: var(--neo-box-shadow-inset-0);
      }

      :global(.neo-button:active),
      :global(.neo-button.pressed) {
        box-shadow: var(--neo-box-shadow-inset-1);
      }
    }

    &.inset {
      box-shadow: var(--neo-box-shadow-inset-2);
    }

    &.rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));

      :global(.neo-button) {
        border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-lg));
      }
    }

    &.skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
      }
    }

    &.vertical {
      flex-direction: column;

      --neo-btn-grp-scale-x: 1.75;
      --neo-btn-grp-scale-y: 1.5;

      :global(.neo-button) {
        width: 100%;
      }

      &.rounded {
        padding: 0.5rem;
      }
    }
  }
</style>
