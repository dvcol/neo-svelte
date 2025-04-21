<script lang="ts">
  import type { NeoLoadingMatrixProps } from '~/loading/neo-loading-matrix.model.js';

  import IconLoadingMatrix from '~/icons/IconLoadingMatrix.svelte';
  import { toSize } from '~/utils/style.utils.js';

  const {
    tag = 'div',
    width: _width,
    height: _height,
    ...rest
  }: NeoLoadingMatrixProps = $props();

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

<svelte:element
  this={tag}
  class:neo-loading-matrix={true}
  style:--neo-loader-width={width?.absolute}
  style:--neo-loader-max-width={width?.max}
  style:--neo-loader-min-width={width?.min}
  style:--neo-loader-height={height?.absolute}
  style:--neo-loader-max-height={height?.max}
  style:--neo-loader-min-height={height?.min}
  {...rest}
>
  <IconLoadingMatrix class="neo-loader" />
</svelte:element>

<style lang="scss">
  .neo-loading-matrix {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 1s ease-in 0.2s;

    :global(> .neo-loader) {
      width: var(--neo-loader-width, 3rem);
      min-width: var(--neo-loader-min-width, 3rem);
      max-width: var(--neo-loader-max-width, 8dvh);
      height: var(--neo-loader-height, 3rem);
      min-height: var(--neo-loader-min-height, 3rem);
      max-height: var(--neo-loader-max-height, 8dvh);
      margin: var(--neo-loader-margin, 2rem);

      /* Adds 0.2s delay and 1s transition to loading indicator to prevent flashing */
      @starting-style {
        opacity: 0;
      }
    }
  }
</style>
