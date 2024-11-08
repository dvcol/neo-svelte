<script lang="ts">
  import type { NeoButtonGroup } from '~/buttons/neo-button-group.model.js';

  import { emptyFn } from '~/utils/transition.utils.js';

  const {
    // Snippets
    children,

    // States
    skeleton,

    // Styles
    start,
    text,
    flat,
    glass,
    rounded,
    pulse,
    coalesce,
    vertical,

    // Transition
    in: inFn,
    inProps,
    out: outFn,
    outProps,
    transition: transitionFn,
    transitionProps,

    // Other props
    ...rest
  }: NeoButtonGroup = $props();

  const _inFn = $derived(inFn ?? transitionFn ?? emptyFn);
  const _outFn = $derived(outFn ?? transitionFn ?? emptyFn);
</script>

<div
  class="neo-button-group"
  class:start
  class:text
  class:flat
  class:glass
  class:rounded
  class:pulse
  class:coalesce
  class:skeleton
  class:vertical
  out:_outFn={outProps ?? transitionProps}
  in:_inFn={inProps ?? transitionProps}
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
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .neo-button-group {
    @include flex.row($flex: 0 1 auto, $center: true, $gap: var(--neo-btn-grp-gap, 0.25rem));

    width: fit-content;
    margin: 0.25rem;
    padding: 0.25rem;
    background-color: var(--neo-btn-bg-color, var(--background-color));
    border: 1px var(--neo-btn-border-color, transparent) solid;
    border-radius: calc(var(--neo-btn-border-radius, var(--border-radius)) + 0.25rem);
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease-out;

    &.flat {
      border-color: var(--neo-btn-border-color, var(--border-color));
    }

    &.text {
      border-color: transparent;
    }

    &:not(.text, .flat, .glass) {
      box-shadow: var(--box-shadow-raised-2);
    }

    &.start {
      @starting-style {
        box-shadow: var(--box-shadow-flat);

        &:not(.text, .glass) {
          border-color: var(--neo-btn-border-color, var(--border-color));
        }
      }
    }

    &.glass {
      background-color: var(--glass-background-color);
      border-top-color: var(--glass-border-color);
      border-left-color: var(--glass-border-color);
      box-shadow: var(--glass-box-shadow-raised-2);
      backdrop-filter: var(--blur-4);

      :global(.neo-button) {
        background-color: transparent;
        backdrop-filter: none;
      }

      :global(.neo-button:not(:active, .pressed)) {
        box-shadow: var(--glass-box-shadow-flat);
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
      box-shadow: var(--box-shadow-flat) !important;
    }

    :global(.neo-button:not(:active, .pressed)) {
      box-shadow: var(--box-shadow-flat);
    }

    :global(.neo-button.loading:active:not(.pressed)),
    :global(.neo-button:not(.flat, .text, :active, .pressed):hover) {
      box-shadow: var(--box-shadow-inset-1);
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
        $box-shadow-reverse: var(--pulse-box-shadow-reverse, var(--box-shadow-raised-2))
      );
    }

    &.coalesce:not(.skeleton) {
      @include mixin.coalesce(
        $scaleX: var(--neo-btn-grp-scale-x, 1.2),
        $scaleY: var(--neo-btn-grp-scale-y, 2),
        $box-shadow-reverse: var(--coalesce-box-shadow-reverse, var(--box-shadow-raised-2))
      );
    }

    &.rounded {
      border-radius: var(--neo-btn-border-radius-rounded, var(--border-radius-lg));

      :global(.neo-button) {
        border-radius: var(--neo-btn-border-radius-rounded, var(--border-radius-lg));
      }
    }

    &.skeleton {
      box-shadow: var(--box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --skeleton-color: var(--glass-skeleton-color);
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
