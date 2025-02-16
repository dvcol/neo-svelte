<script lang="ts">
  import type { NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';

  import NeoProgress from '~/progress/NeoProgress.svelte';
  import { coerce, computeGlassFilter, computeShadowElevation, DefaultShallowMinMaxElevation, type ShadowElevation } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label, // TODO: add label support
    tooltip, // TODO: add tooltip support
    mark, // TODO: progress ticks & custom mark

    // State
    ref = $bindable(),
    state = $bindable(),
    value = $bindable(0),
    buffer = $bindable(0),
    marks, // TODO: progress ticks & custom mark

    // Size
    width: _width,
    height: _height,

    // Styles
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
  const blur = $derived(coerce<ShadowElevation>(_blur ?? elevation));
  const filter = $derived(computeGlassFilter(blur, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }, DefaultShallowMinMaxElevation));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

<svelte:element
  this={containerTag}
  class:neo-progress-bar={true}
  class:neo-borderless={borderless}
  class:neo-flat={!elevation}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-inset={elevation < 0}
  class:neo-rounded={rounded}
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-progress-bar-glass-blur={filter}
  style:--neo-progress-bar-box-shadow={boxShadow}
  {...containerRest}
>
  <NeoProgress bind:ref bind:state bind:value bind:buffer {...rest} />
</svelte:element>

<style lang="scss">
  .neo-progress-bar {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
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

    &.neo-rounded {
      border-radius: var(--neo-pill-border-radius, var(--neo-border-radius-lg));
    }

    &:not(.neo-flat.neo-borderless) :global(.neo-progress) {
      background: var(--neo-progress-track-background, transparent);
    }

    &.neo-flat:not(.neo-borderless) {
      padding: 0.0625rem;
      border-color: var(--neo-progress-bar-border-color, var(--neo-border-color));

      &:focus-within,
      &:hover {
        color: var(--neo-progress-bar-text-color-hover, var(--neo-text-color-highlight));
        border-color: var(--neo-progress-bar-border-color-hover, var(--neo-border-color-highlight));
      }
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
