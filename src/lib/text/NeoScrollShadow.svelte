<script lang="ts">
  import type { NeoScollShadowProps } from '~/text/neo-scroll-shadow.model.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',
    shadow = true,
    scrollbar = true,
    overflow,

    size,
    direction,

    // Other props
    ...rest
  }: NeoScollShadowProps = $props();
</script>

<svelte:element
  this={tag}
  class:neo-scroll-shadow={true}
  class:neo-scroll={scrollbar}
  class:neo-shadow={shadow}
  style:--neo-scroll-overflow={overflow}
  style:--neo-scroll-direction={direction}
  style:--neo-scroll-shadow-size={size}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-scroll-shadow {
    &.neo-shadow {
      @include mixin.fade-scroll;
    }

    &.neo-scroll {
      @include mixin.scrollbar;
    }
  }
</style>
