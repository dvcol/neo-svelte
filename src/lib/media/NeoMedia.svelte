<script lang="ts">
  import type { NeoMediaContext, NeoMediaProps } from '~/media/neo-media.model.js';

  import { NeoMediaType } from '~/media/neo-media.model.js';
  import NeoImage from '~/media/NeoImage.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { coerce, computeGlassFilter, computeShadowElevation, getDefaultElevation, parseBlur } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // Snippet
    children,
    caption,

    // State
    ref = $bindable(),
    tag = 'figure',
    type: _type,
    loading,

    // Media,
    image,

    // Styles
    borderless,
    pressed,
    rounded,
    glass,
    color,
    tinted,
    filled,
    start,

    // Size
    flex,
    width: _width,
    height: _height,
    ratio,

    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    blur: _blur,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    captionProps: _captionProps = {},
    textProps,
    mediaProps,
    ...rest
  }: NeoMediaProps = $props();

  const { tag: captionTag = 'figcaption', ...captionProps } = $derived(_captionProps);
  const type = $derived.by(() => {
    if (_type) return _type;
    if (image?.src) return NeoMediaType.Image;
  });

  const elevation = $derived(coerce(_elevation));
  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const context = $derived<NeoMediaContext>({
    // State
    loading,
    type,

    // Styles
    borderless,
    pressed,
    rounded,
    glass,
    color,
    tinted,
    filled,

    // shadow
    elevation,
    blur,
  });
</script>

<svelte:element
  bind:this={ref}
  this={tag}
  class:neo-media={true}
  class:neo-glass={glass}
  class:neo-filled={filled}
  class:neo-tinted={tinted}
  class:neo-rounded={rounded}
  class:neo-pressed={pressed}
  class:neo-borderless={borderless}
  class:neo-start={start}
  class:neo-inset={elevation < 0}
  class:neo-flat={!elevation}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  style:--neo-media-color={getColorVariable(color)}
  style:--neo-media-glass-blur={filter}
  style:--neo-media-box-shadow={boxShadow}
  style:--neo-media-border-radius={computeBorderRadius(rounded)}
  out:outFn={outProps}
  in:inFn={inProps}
  {...rest}
>
  <NeoSkeletonMedia {loading} {glass} {rounded} {type} {ratio} {...mediaProps} containerProps={{ width: '100%', height: '100%' }}>
    {#if type === NeoMediaType.Image}
      <NeoImage {rounded} {ratio} {...image} />
    {:else}
      {@render children?.(context)}
    {/if}

  </NeoSkeletonMedia>
  {#if caption}
    <NeoSkeletonText lines="1" {loading} {glass} {...textProps}>
      <svelte:element this={captionTag} class:neo-media-caption={true} {...captionProps}>
        {#if typeof caption === 'function'}
          {@render caption(context)}
        {:else}
          {caption}
        {/if}
      </svelte:element>
    </NeoSkeletonText>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-media {
    display: flex;
    flex-direction: column;
    gap: var(--neo-media-gap, var(--neo-gap-xs, 0.625rem));
    margin: var(--neo-media-margin, var(--neo-shadow-margin, 0.625rem));
    padding: var(--neo-media-padding, var(--neo-gap, 1rem));
    color: var(--neo-media-color, inherit);
    background-clip: padding-box;
    border: var(--neo-media-border-width, var(--neo-border-width, 1px)) var(--neo-media-border-color, transparent) solid;
    border-radius: var(--neo-media-border-radius, var(--neo-border-radius-lg));
    box-shadow: var(--neo-media-box-shadow, var(--neo-box-shadow-flat));
    transition:
            color 0.15s ease,
            padding 0.3s ease,
            margin 0.3s ease,
            border-color 0.3s ease,
            border-radius 0.3s ease,
            backdrop-filter 0.3s ease,
            background-color 0.3s ease,
            box-shadow 0.3s ease-out;

    :global(> .neo-transition-container:first-child > .neo-skeleton-content-container) {
      width: 100%;
      height: 100%;
    }

    .neo-media-caption {
      transition: margin 0.3s ease;
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);
      }
    }

    &.neo-flat:not(.neo-borderless) {
      border-color: var(--neo-media-border-color, var(--neo-border-color));
    }

    &.neo-borderless {
      border-color: transparent;
    }

    &.neo-rounded {
      border-radius: var(--neo-media-border-radius, var(--neo-border-radius-3xl));

      .neo-media-caption {
        margin-inline: 0.75rem;
      }
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);

      background-color: var(--neo-media-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-media-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &:not(.neo-borderless,.neo-inset, .neo-flat .neo-filled) {
        border-color: var(
                        --neo-media-border-color,
                        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
                        var(--neo-glass-left-border-color)
        );
      }

      &.neo-flat:not(.neo-borderless) {
        border-color: var(--neo-media-border-color, var(--neo-glass-border-color-flat));
      }
    }

    &.neo-tinted {
      background-color: var(--neo-media-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-filled {
      background-color: var(--neo-media-bg-color, var(--neo-background-color));

      &.neo-glass {
        border-color: var(
                        --neo-media-border-color,
                        var(--neo-filled-top-border-color)
                        var(--neo-filled-right-border-color)
                        var(--neo-filled-bottom-border-color)
                        var(--neo-filled-left-border-color)
        );
      }
    }
  }
</style>
