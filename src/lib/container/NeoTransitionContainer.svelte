<script lang="ts">
  import type { NeoTransitionContainerProps } from '~/container/neo-transition-container.model.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',

    // Styles
    overflow = 'hidden',

    // Other props
    ...rest
  }: NeoTransitionContainerProps = $props();
</script>

<svelte:element this={tag} class:neo-transition-container={true} style:overflow-x={overflow} {...rest}>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-transition-container {
    display: grid;
    grid-template-areas: 'transition';
    width: 100%;

    :global(> *) {
      grid-area: transition;
    }
  }
</style>
