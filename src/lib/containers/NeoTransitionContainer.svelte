<script lang="ts">
  import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';

  const {
    // Snippets
    children,

    // States
    tag = 'div',

    // Styles
    overflow = 'hidden',
    width,
    height,

    // Other props
    ...rest
  }: NeoTransitionContainerProps = $props();
</script>

<svelte:element this={tag} class:neo-transition-container={true} style:overflow-x={overflow} style:width style:height {...rest}>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-transition-container {
    display: grid;
    flex-grow: 1;
    grid-template-areas: 'transition';
    width: 100%;
    height: 100%;

    :global(> *) {
      grid-area: transition;
    }
  }
</style>
