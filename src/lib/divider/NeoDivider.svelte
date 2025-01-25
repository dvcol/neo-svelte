<script lang="ts">
  import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

  import { coerce, computeShadowElevation, DefaultShadowPressedElevation } from '~/utils/shadow.utils.js';

  const {
    // State
    vertical = false,
    skeleton,

    // Styles
    height,
    width,
    glass,
    rounded,

    // Other props
    ...rest
  }: NeoDividerProps = $props();

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowPressedElevation));
  const boxShadow = $derived(computeShadowElevation(elevation));
</script>

<div
  role="separator"
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  class:neo-divider={true}
  class:neo-vertical={vertical}
  class:neo-inset={elevation < 0}
  class:neo-flat={!elevation}
  class:neo-glass={glass}
  class:neo-rounded={rounded}
  class:neo-skeleton={skeleton}
  style:--neo-divider-height={height}
  style:--neo-divider-width={width}
  style:--neo-divider-box-shadow={boxShadow}
  {...rest}
>
  &nbsp;
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-divider {
    box-sizing: border-box;
    width: calc(var(--neo-divider-width, 100%) - var(--neo-shadow-margin, 0.625rem) * 2);
    height: max(4px, var(--neo-divider-height, 4px));
    margin: var(--neo-shadow-margin, 0.625rem);
    border: var(--neo-border-width, 1px) solid var(--neo-divider-color, transparent);
    border-radius: var(--neo-divider-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-raised-2));
    transition:
      border-radius 0.3s ease,
      box-shadow 0.3s ease,
      background-color 0.3s ease;

    &.neo-rounded {
      border-radius: var(--neo-divider-border-radius, var(--neo-border-radius-lg));
    }

    &.neo-inset {
      height: max(6px, var(--neo-divider-height, 6px));
      box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-inset-2));
    }

    &.neo-vertical {
      width: var(--neo-divider-width, 4px);
      height: calc(var(--neo-divider-height, 100%) - var(--neo-shadow-margin, 0.625rem) * 2);

      &.neo-inset {
        width: max(6px, var(--neo-divider-width, 6px));
      }
    }

    &.neo-flat {
      background-color: var(--neo-divider-color, var(--neo-border-color));
      box-shadow: none;
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      backdrop-filter: var(--neo-input-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));
    }
  }
</style>
