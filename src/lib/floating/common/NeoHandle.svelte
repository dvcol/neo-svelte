<script lang="ts">
  import type { NeoHandlePlacements, NeoHandleProps } from '~/floating/common/neo-handle.model.js';

  import { circOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { NeoHandlePlacement } from '~/floating/common/neo-handle.model.js';

  const {
    // Snippets
    children,
    handle,

    // State
    refs = $bindable({}),
    enabled = true,
    visible = true,
    placement = 'top',
    position = 'inside',
    elevation = 0,
    outside,
    axis,
    minSize = 16,

    // Other Props
    dividerProps,
    groupProps,
    ...rest
  }: NeoHandleProps = $props();

  const invertMap: Record<NeoHandlePlacements, NeoHandlePlacements> = {
    [NeoHandlePlacement.Top]: NeoHandlePlacement.Bottom,
    [NeoHandlePlacement.Right]: NeoHandlePlacement.Left,
    [NeoHandlePlacement.Bottom]: NeoHandlePlacement.Top,
    [NeoHandlePlacement.Left]: NeoHandlePlacement.Right,
  };
  const getOpposite = (p: NeoHandlePlacements): NeoHandlePlacements => invertMap[p] ?? p;

  const placements = $derived.by<NeoHandlePlacements[]>(() => {
    const _placements = typeof placement === 'string' ? { [placement]: true } : { ...placement };
    if (outside) _placements[getOpposite(outside)] = true;
    return Object.entries(_placements)
      .filter(([k, v]) => typeof k === 'string' && v)
      .map(([k]) => k as NeoHandlePlacements);
  });

  const width = $state<Record<NeoHandlePlacements, number>>({ top: 0, right: 0, bottom: 0, left: 0 });
  const height = $state<Record<NeoHandlePlacements, number>>({ top: 0, right: 0, bottom: 0, left: 0 });
  const margin = $derived.by<{ top: number; right: number; bottom: number; left: number }>(() => {
    if (position === 'outside') return { top: minSize, right: minSize, bottom: minSize, left: minSize };
    return {
      top: height.top || minSize,
      right: width.right || minSize,
      bottom: height.bottom || minSize,
      left: width.left || minSize,
    };
  });

  $effect(() => {
    const _refs = Object.values(refs).filter(Boolean);
    if (!_refs.length) return;
    _refs?.at(0)?.focus();
  });
</script>

{#snippet handleButton(_placement: NeoHandlePlacements)}
  <button
    bind:this={refs[_placement]}
    bind:offsetWidth={width[_placement]}
    bind:offsetHeight={height[_placement]}
    class:neo-handle={true}
    data-placement={_placement}
    data-position={position}
    data-axis={axis}
    aria-label="Drag handle ({_placement})"
    title="Draggable"
    transition:scale={{ duration: 600, start: 0.5, easing: circOut }}
    style:--neo-handle-offset-width="{width[_placement]}px"
    style:--neo-handle-offset-height="{height[_placement]}px"
    style:--neo-handle-offset-elevation="{elevation}px"
    {...rest}
  >
    {#if handle}
      {@render handle(_placement)}
    {:else if visible}
      <NeoDivider role="presentation" vertical={['right', 'left'].includes(_placement)} {...dividerProps} />
    {/if}
  </button>
{/snippet}

{#if enabled}
  <div
    data-position={position}
    class:neo-handle-group={true}
    style:--neo-handle-group-computed-padding-top="{margin.top}px"
    style:--neo-handle-group-computed-padding-right="{margin.right}px"
    style:--neo-handle-group-computed-padding-bottom="{margin.bottom}px"
    style:--neo-handle-group-computed-padding-left="{margin.left}px"
    {...groupProps}
  >
    {#each placements as _placement (_placement)}
      {@render handleButton(_placement)}
    {/each}
    {@render children?.({ enabled, placements, axis, outside })}
  </div>
{:else}
  {@render children?.({ enabled, placements, axis, outside })}
{/if}

<style lang="scss">
  .neo-handle {
    --neo-divider-height: 0.25rem;
    --neo-divider-width: clamp(2rem, 10%, 50%);

    position: absolute;
    display: flex;
    width: var(--neo-handle-width, 100%);
    height: var(--neo-handle-height, fit-content);
    margin: 0;
    padding: var(--neo-handle-padding, var(--neo-gap-sm));
    color: inherit;
    background: none;
    border: none;
    outline: none;
    cursor: grab;
    transition: opacity 0.3s ease-in;
    appearance: none;

    &:active {
      cursor: grabbing;

      &[data-axis='x'] {
        cursor: ew-resize;
      }

      &[data-axis='y'] {
        cursor: ns-resize;
      }
    }

    &-group {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      width: 100%;
      padding: var(--neo-handle-group-margin-top, var(--neo-handle-group-computed-padding-top, 0))
        var(--neo-handle-group-margin-right, var(--neo-handle-group-computed-padding-right, 0))
        var(--neo-handle-group-margin-bottom, var(--neo-handle-group-computed-padding-bottom, 0))
        var(--neo-handle-group-margin-left, var(--neo-handle-group-computed-padding-left, 0));
    }

    :global(> .neo-divider) {
      margin-inline: auto;
    }

    &:focus-visible :global(> .neo-divider) {
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      outline-offset: 1px;
    }

    &[data-placement^='right'],
    &[data-placement^='left'] {
      --neo-divider-height: clamp(2rem, 10%, 50%);
      --neo-divider-width: 0.25rem;

      align-items: center;
      justify-content: center;
      width: var(--neo-handle-width, fit-content);
      height: var(--neo-handle-height, 100%);
    }

    &:not([data-position='outside']) {
      &[data-placement^='top'] {
        top: 0;
        bottom: auto;
        left: 0;
        padding-bottom: var(--neo-handle-padding, var(--neo-gap-xxs));
      }

      &[data-placement^='bottom'] {
        top: auto;
        bottom: 0;
        left: 0;
        padding-top: var(--neo-handle-padding, var(--neo-gap-xxs));
      }

      &[data-placement^='right'] {
        top: 0;
        right: 0;
        left: auto;
      }

      &[data-placement^='left'] {
        top: 0;
        right: auto;
        left: 0;
      }
    }

    &[data-position='outside'] {
      $height: calc(0% - var(--neo-border-width, 1px) - var(--neo-handle-offset-height, 1rem) - var(--neo-handle-offset-elevation, 0px));
      $width: calc(0% - var(--neo-border-width, 1px) - var(--neo-handle-offset-width, 1rem) - var(--neo-handle-offset-elevation, 0px));

      &[data-placement^='top'] {
        top: var(--neo-handle-height, $height);
        bottom: auto;
        left: 0;
      }

      &[data-placement^='bottom'] {
        top: auto;
        bottom: var(--neo-handle-height, $height);
        left: 0;
      }

      &[data-placement^='right'] {
        top: 0;
        right: var(--neo-handle-width, $width);
        left: auto;
      }

      &[data-placement^='left'] {
        top: 0;
        right: auto;
        left: var(--neo-handle-width, $width);
      }
    }
  }
</style>
