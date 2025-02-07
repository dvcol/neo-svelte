<script lang="ts">
  import type { NeoScrollShadowProps } from '~/text/neo-scroll-shadow.model.js';

  import { toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    shadow = true,
    scrollbar = true,
    overflow,

    // Size
    width: _width,
    height: _height,
    shadowSize,
    direction,

    // Other props
    ...rest
  }: NeoScrollShadowProps = $props();
  /* eslint-enable prefer-const */

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-scroll-shadow={true}
  class:neo-scroll={scrollbar}
  class:neo-shadow={shadow}
  class:neo-horizontal={direction === 'right'}
  class:neo-vertical={direction !== 'right'}
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-scroll-overflow={overflow}
  style:--neo-scroll-direction={direction}
  style:--neo-scroll-shadow-size={shadowSize}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-scroll-shadow {
    &.neo-vertical {
      padding-block: calc(var(--neo-scroll-shadow-size, 1rem) / 2);
    }

    &.neo-horizontal {
      padding-inline: calc(var(--neo-scroll-shadow-size, 1rem) / 2);
    }

    &.neo-shadow {
      @include mixin.fade-scroll;
    }

    &.neo-scroll {
      @include mixin.scrollbar($button-height: var(--neo-scrollbar-button-height, calc(var(--neo-scroll-shadow-size, 1rem) / 2.5)));
    }
  }
</style>
