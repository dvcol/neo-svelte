<script lang="ts">
  import type { NeoDivider } from '~/divider/neo-divider.model.js';

  import { computeShadowElevation } from '~/utils/shadow.utils.js';

  const { elevation = -1, vertical = false, height, width, ...rest }: NeoDivider = $props();

  const boxShadow = $derived.by(() => computeShadowElevation(elevation));
</script>

<div
  role="separator"
  aria-orientation={vertical ? 'vertical' : 'horizontal'}
  class:neo-divider={true}
  class:vertical
  class:inset={elevation < 0}
  class:flat={!elevation}
  style:--neo-divider-height={height}
  style:--neo-divider-width={width}
  style:--neo-divider-box-shadow={boxShadow}
  {...rest}
>
  &nbsp;
</div>

<style lang="scss">
  .neo-divider {
    width: calc(var(--neo-divider-width, 100%) - var(--neo-shadow-margin, 0.5rem) * 2);
    height: max(4px, var(--neo-divider-height, 4px));
    margin: var(--neo-shadow-margin, 0.5rem);
    border-radius: var(--neo-border-radius-lg, 2rem);
    box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-raised-1));

    &.inset {
      height: max(6px, var(--neo-divider-height, 6px));
      box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-inset-1));
    }

    &.vertical {
      width: var(--neo-divider-height, 4px);
      height: calc(var(--neo-divider-height, 100%) - var(--neo-shadow-margin, 0.5rem) * 2);

      &.inset {
        width: max(6px, var(--neo-divider-width, 6px));
      }
    }

    &.flat {
      background-color: var(--neo-divider-color, var(--neo-border-color));
      box-shadow: none;
    }
  }
</style>
