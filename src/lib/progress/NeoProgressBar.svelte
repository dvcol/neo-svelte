<script lang="ts">
  import type { NeoProgressBarContext, NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';

  import NeoProgress from '~/progress/NeoProgress.svelte';
  import { NeoProgressDirection } from '~/progress/neo-progress.model.js';
  import { coerce, computeGlassFilter, computeShadowElevation, DefaultShallowMinMaxElevation, parseBlur } from '~/utils/shadow.utils.js';
  import { toPixel, toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    before,
    after,
    mark,

    // State
    ref = $bindable(),
    refs = $bindable([]),
    state = $bindable(),
    value = $bindable(0),
    buffer = $bindable(0),
    marks = [],

    // Size
    flex,
    width: _width,
    height: _height,

    // Styles
    direction = NeoProgressDirection.Right,
    borderless,
    rounded,
    pressed,
    glass,
    start,

    // Shadow
    elevation: _elevation = pressed ? -1 : 1,
    blur: _blur,

    // Other Props
    containerProps,
    ...rest
  }: NeoProgressBarProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const elevation = $derived(coerce(_elevation));
  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }, DefaultShallowMinMaxElevation));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const margin = $derived.by(() => {
    if (!refs?.length) return;
    const size = { height: 0, width: 0 };
    refs.forEach(r => {
      if (!r) return;
      const { offsetWidth, offsetHeight } = r;
      if (offsetHeight && offsetHeight > size.height) size.height = offsetHeight;
      if (offsetWidth && offsetWidth > size.width) size.width = offsetWidth;
    });
    return {
      height: toPixel((size.height - (ref?.offsetHeight ?? 0)) / 2),
      width: toPixel(size.width / 2),
    };
  });

  const context = $derived<NeoProgressBarContext>({
    state,

    value,
    buffer,
    min: rest?.min ?? 0,
    max: rest?.max ?? 100,
    indeterminate: rest?.indeterminate,

    step: rest?.step ?? 1,
    tick: rest?.tick ?? 500,
    timeout: rest?.timeout,

    color: rest?.color,
    direction,

    // Styles
    borderless,
    rounded,
    pressed,
    glass,
    start,

    // Shadow
    elevation,
    blur,
  });
</script>

{#if typeof before === 'function'}
  {@render before(context)}
{:else if before !== undefined}
  {before}
{/if}

<svelte:element
  this={containerTag}
  data-direction={direction}
  class:neo-progress-bar={true}
  class:neo-borderless={borderless}
  class:neo-flat={!elevation}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-inset={elevation < 0}
  class:neo-rounded={rounded}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-progress-mark-margin-block={margin?.height}
  style:--neo-progress-mark-margin-inline={margin?.width}
  style:--neo-progress-bar-glass-blur={filter}
  style:--neo-progress-bar-box-shadow={boxShadow}
  {...containerRest}
>
  <NeoProgress bind:ref bind:state bind:value bind:buffer {direction} {...rest} />
  {#each marks as position, index}
    {#if position !== undefined}
      <span bind:this={refs[index]} class="neo-progress-bar-mark" style:--neo-progress-bar-mark-position="{position}%">
        {#if typeof mark === 'function'}
          {@render mark({ index, position, context })}
        {:else if mark !== undefined}
          {mark}
        {:else}
          {position}
        {/if}
      </span>
    {/if}
  {/each}

  {@render children?.(context)}
</svelte:element>

{#if typeof after === 'function'}
  {@render after(context)}
{:else if after !== undefined}
  {after}
{/if}

<style lang="scss">
  .neo-progress-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin-block: var(--neo-progress-margin-block, var(--neo-progress-mark-margin-block, 0));
    margin-inline: var(--neo-progress-margin-inline, var(--neo-progress-mark-margin-inline, 0));
    padding: 0;
    color: var(--neo-progress-bar-text-color, inherit);
    border: var(--neo-progress-bar-border-width, var(--neo-border-width, 1px)) var(--neo-progress-bar-border-color, transparent) solid;
    border-radius: var(--neo-progress-bar-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-progress-bar-box-shadow, var(--neo-box-shadow-flat));
    transition:
      color 0.3s ease,
      padding 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      backdrop-filter 0.3s ease,
      box-shadow 0.3s ease-out;

    &-mark {
      position: absolute;
    }

    &[data-direction='right'],
    &[data-direction='left'] {
      width: calc(100% - (var(--neo-progress-margin-inline, var(--neo-progress-mark-margin-inline, 0px)) * 2));
      height: 0.5rem;
    }

    &[data-direction='right'] .neo-progress-bar-mark {
      left: var(--neo-progress-bar-mark-position, 0%);
      translate: -50%;
    }

    &[data-direction='left'] .neo-progress-bar-mark {
      right: var(--neo-progress-bar-mark-position, 0%);
      translate: 50%;
    }

    &[data-direction='top'],
    &[data-direction='bottom'] {
      flex: 1 1 100%;
      width: 0.5rem;
    }

    &[data-direction='top'] .neo-progress-bar-mark {
      bottom: var(--neo-progress-bar-mark-position, 0%);
      translate: 0 50%;
    }

    &[data-direction='bottom'] .neo-progress-bar-mark {
      top: var(--neo-progress-bar-mark-position, 0%);
      translate: 0 -50%;
    }

    &:not(.neo-flat.neo-borderless) :global(> .neo-progress) {
      background: var(--neo-progress-track-background, transparent);
    }

    &.neo-flat:not(.neo-borderless) {
      border-color: var(--neo-progress-bar-border-color, var(--neo-border-color));

      &:focus-within,
      &:hover {
        color: var(--neo-progress-bar-text-color-hover, var(--neo-text-color-highlight));
        border-color: var(--neo-progress-bar-border-color-hover, var(--neo-border-color-highlight));
      }
    }

    &.neo-rounded {
      border-radius: var(--neo-pill-border-radius, var(--neo-border-radius-lg));
    }

    &.neo-glass {
      --neo-border-color: var(--neo-glass-border-color);

      backdrop-filter: var(--neo-progress-bar-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &:not(.neo-inset, .neo-borderless, .neo-flat) {
        border-color: var(
          --neo-pill-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-flat:not(.neo-borderless) {
        border-color: var(--neo-pill-border-color, var(--neo-glass-border-color-flat));

        &:focus-within,
        &:hover {
          border-color: var(--neo-pill-border-color-hover, var(--neo-border-color-flat-highlight));
        }
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }
  }
</style>
