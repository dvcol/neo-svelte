<script lang="ts">
  import type { NeoBadgeProps } from '~/badge/neo-badge.model.js';

  import NeoPill from '~/pill/NeoPill.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    value,

    // States
    offset: _offset,
    placement = 'top-right',

    // Other props
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoBadgeProps = $props();
  /* eslint-enable prefer-const */

  const offset = $derived.by<{ x?: string; y?: string }>(() => {
    if (typeof _offset === 'string') {
      return { x: _offset, y: _offset };
    }
    if (typeof _offset === 'number') {
      return { x: `${_offset}px`, y: `${_offset}px` };
    }
    return {
      x: typeof _offset?.x === 'number' ? `${_offset.x}px` : _offset?.x,
      y: typeof _offset?.y === 'number' ? `${_offset.y}px` : _offset?.y,
    };
  });
</script>

<svelte:element
  this={containerTag}
  class:neo-badge-container={true}
  data-placement={placement}
  style:--neo-badge-offset-x={offset?.x}
  style:--neo-badge-offset-y={offset?.y}
  {...containerProps}
>
  <NeoPill class="neo-badge-pill" size="medium" glass elevation="2" tinted {...rest}>
    {#if typeof value === 'function'}
      {@render value({ placement, offset })}
    {:else}
      {value}
    {/if}
  </NeoPill>

  {@render children?.({ placement, offset })}
</svelte:element>

<style lang="scss">
  .neo-badge {
    &-container {
      position: relative;

      :global(> .neo-badge-pill) {
        position: absolute;
        z-index: var(--neo-badge-pill-z-index, var(--neo-z-index-in-front));
      }

      &[data-placement='top'] {
        :global(> .neo-badge-pill) {
          top: var(--neo-badge-offset-y, 0);
          left: 50%;
          translate: -50%;
        }
      }

      &[data-placement='top-right'] {
        :global(> .neo-badge-pill) {
          top: var(--neo-badge-offset-y, 0);
          right: var(--neo-badge-offset-x, 0);
        }
      }

      &[data-placement='top-left'] {
        :global(> .neo-badge-pill) {
          top: var(--neo-badge-offset-y, 0);
          left: var(--neo-badge-offset-x, 0);
        }
      }

      &[data-placement='bottom'] {
        :global(> .neo-badge-pill) {
          bottom: var(--neo-badge-offset-y, 0);
          left: 50%;
          translate: -50%;
        }
      }

      &[data-placement='bottom-right'] {
        :global(> .neo-badge-pill) {
          right: var(--neo-badge-offset-x, 0);
          bottom: var(--neo-badge-offset-y, 0);
        }
      }

      &[data-placement='bottom-left'] {
        :global(> .neo-badge-pill) {
          bottom: var(--neo-badge-offset-y, 0);
          left: var(--neo-badge-offset-x, 0);
        }
      }

      &[data-placement='right'] {
        :global(> .neo-badge-pill) {
          top: 50%;
          right: var(--neo-badge-offset-x, 0);
          translate: 0 -50%;
        }
      }

      &[data-placement='left'] {
        :global(> .neo-badge-pill) {
          top: 50%;
          left: var(--neo-badge-offset-x, 0);
          translate: 0 -50%;
        }
      }
    }
  }
</style>
