<script lang="ts">
  import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

  import { computeShadowElevation } from '~/utils/shadow.utils.js';

  const { elevation = -1, vertical = false, height, width, ...rest }: NeoDividerProps = $props();

  const boxShadow = $derived(computeShadowElevation(elevation));
</script>

<div
  role="separator"
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  class:neo-divider={true}
  class:neo-vertical={vertical}
  class:neo-inset={elevation < 0}
  class:neo-flat={!elevation}
  style:--neo-divider-height={height}
  style:--neo-divider-width={width}
  style:--neo-divider-box-shadow={boxShadow}
  {...rest}
>
  &nbsp;
</div>

<style lang="scss">
  .neo-divider {
    width: calc(var(--neo-divider-width, 100%) - var(--neo-shadow-margin, 0.625rem) * 2);
    height: max(4px, var(--neo-divider-height, 4px));
    margin: var(--neo-shadow-margin, 0.625rem);
    border-radius: var(--neo-divider-border-radius, var(--neo-border-radius-lg));
    box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-raised-2));

    &.neo-inset {
      height: max(6px, var(--neo-divider-height, 6px));
      box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-inset-2));
    }

    &.neo-vertical {
      width: var(--neo-divider-height, 4px);
      height: calc(var(--neo-divider-height, 100%) - var(--neo-shadow-margin, 0.625rem) * 2);

      &.neo-inset {
        width: max(6px, var(--neo-divider-width, 6px));
      }
    }

    &.neo-flat {
      background-color: var(--neo-divider-color, var(--neo-border-color));
      box-shadow: none;
    }
  }
</style>
