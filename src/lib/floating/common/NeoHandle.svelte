<script lang="ts">
  import { circOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { NeoHandlePlacement, type NeoHandlePlacements, type NeoHandleProps } from '~/floating/common/neo-handle.model.js';

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
  const margin = $derived(`${height.top || minSize}px ${width.right || minSize}px ${height.bottom || minSize}px ${width.left || minSize}px`);

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
  <div class:neo-handle-group={true} style:--neo-handle-group-computed-margin={margin} {...groupProps}>
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
    cursor: move;
    transition: opacity 0.3s ease-in;
    appearance: none;

    &-group {
      position: relative;
      margin: var(--neo-handle-group-margin, var(--neo-handle-group-computed-margin, 0));
    }

    :global(> .neo-divider) {
      margin-inline: auto;
    }

    &:focus-visible :global(> .neo-divider) {
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      outline-offset: 1px;
    }

    &[data-axis='x'] {
      cursor: ew-resize;
    }

    &[data-axis='y'] {
      cursor: ns-resize;
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

    &[data-placement^='top'] {
      padding-bottom: var(--neo-handle-padding, var(--neo-gap-xxs));
    }

    &[data-placement^='bottom'] {
      padding-top: var(--neo-handle-padding, var(--neo-gap-xxs));
    }

    &[data-placement^='right'] {
      padding-left: var(--neo-handle-padding, var(--neo-gap-xxs));
    }

    &[data-placement^='left'] {
      padding-right: var(--neo-handle-padding, var(--neo-gap-xxs));
    }

    &:not([data-position='outside']) {
      $height: calc(0% - var(--neo-handle-offset-height, 1rem));
      $width: calc(0% - var(--neo-handle-offset-width, 1rem));

      &[data-placement^='top'] {
        top: var(--neo-handle-height, $height);
        left: 0;
      }

      &[data-placement^='bottom'] {
        top: auto;
        bottom: var(--neo-handle-height, $height);
      }

      &[data-placement^='right'] {
        right: var(--neo-handle-width, $width);
        left: auto;
      }

      &[data-placement^='left'] {
        right: auto;
        left: var(--neo-handle-width, $width);
      }
    }

    &[data-position='outside'] {
      $height: calc(0% - var(--neo-border-width, 1px) - var(--neo-handle-offset-height, 1rem));
      $width: calc(0% - var(--neo-border-width, 1px) - var(--neo-handle-offset-width, 1rem));

      &[data-placement^='top'] {
        top: var(--neo-handle-height, $height);
        left: 0;
      }

      &[data-placement^='bottom'] {
        top: auto;
        bottom: var(--neo-handle-height, $height);
      }

      &[data-placement^='right'] {
        right: var(--neo-handle-width, $width);
        left: auto;
      }

      &[data-placement^='left'] {
        right: auto;
        left: var(--neo-handle-width, $width);
      }
    }
  }
</style>
