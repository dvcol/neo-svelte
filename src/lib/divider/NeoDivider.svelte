<script lang="ts">
  import type { NeoDivider } from '~/divider/neo-divider.model.js';

  import { computeShadowElevation } from '~/utils/shadow.utils.js';

  const {
    elevation = -1,
    vertical = false,
    height = vertical ? '100%' : `${elevation < 0 ? 6 : 4}px`,
    width = vertical ? `${elevation < 0 ? 6 : 4}px` : '100%',
    ...rest
  }: NeoDivider = $props();

  const boxShadow = $derived.by(() => computeShadowElevation(elevation));
</script>

<div
  class:neo-divider={true}
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
    width: calc(var(--neo-divider-width, 100%) - var(--neo-shadow-margin, 0.25rem) * 2);
    height: var(--neo-divider-height, 4px);
    margin: var(--neo-shadow-margin, 0.25rem);
    border-radius: var(--neo-border-radius-lg, 2rem);
    box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-raised-1));

    &.inset {
      box-shadow: var(--neo-divider-box-shadow, var(--neo-box-shadow-inset-1));
    }

    &.flat {
      background-color: var(--neo-divider-color, var(--neo-border-color));
      box-shadow: none;
    }
  }
</style>
