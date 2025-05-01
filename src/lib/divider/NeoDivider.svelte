<script lang="ts">
  import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

  import { coerce, computeShadowElevation } from '~/utils/shadow.utils.js';

  const {
    // State
    vertical = false,
    skeleton = false,

    // Shadow
    elevation: _elevation = 0,

    // Styles
    margin,
    height,
    width,
    flex,
    glass,
    rounded = true,

    // Other props
    ...rest
  }: NeoDividerProps = $props();

  const elevation = $derived(coerce(_elevation));
  const boxShadow = $derived(computeShadowElevation(elevation));

  const minimum = $derived.by(() => {
    if (elevation <= -5) return '24px';
    if (elevation <= -4) return '16px';
    if (elevation <= -3) return '12px';
    if (elevation <= -2) return '10px';
    if (elevation <= -1) return '8px';
    if (elevation <= 1) return '1px';
    if (elevation <= 2) return '4px';
    if (elevation <= 3) return '6px';
    if (elevation <= 4) return '12px';
    return '16px';
  });
</script>

<div
  role="separator"
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  data-elevation={elevation}
  class:neo-divider={true}
  class:neo-vertical={vertical}
  class:neo-flat={!elevation}
  class:neo-glass={glass}
  class:neo-rounded={rounded}
  class:neo-skeleton={skeleton}
  style:flex
  style:--neo-divider-height={height}
  style:--neo-divider-width={width}
  style:--neo-divider-margin={margin}
  style:--neo-divider-minimum={minimum}
  style:--neo-divider-box-shadow={boxShadow}
  {...rest}
>
  &nbsp;
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-divider {
    align-self: center;
    box-sizing: border-box;
    width: calc(var(--neo-divider-width, 100%) - var(--neo-divider-margin-inline, var(--neo-divider-margin, 0px)) * 2);
    height: calc(
      max(var(--neo-divider-minimum), var(--neo-divider-height, 1px) - var(--neo-divider-margin-block, var(--neo-divider-margin, 0px)) * 2)
    );
    margin: var(--neo-divider-margin, 0);
    padding: 0;
    border: none;
    border-radius: var(--neo-divider-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-raised-2));
    transition:
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out,
      background-color 0.3s ease;
    user-select: none;

    &.neo-rounded {
      border-radius: var(--neo-divider-border-radius, var(--neo-border-radius-xxl));
    }

    &.neo-vertical {
      width: max(var(--neo-divider-minimum), var(--neo-divider-width, 1px) - var(--neo-divider-margin-inline, var(--neo-divider-margin, 0px)) * 2);
      height: calc(var(--neo-divider-height, 100%) - var(--neo-divider-margin-block, var(--neo-divider-margin, 0px)) * 2);
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
