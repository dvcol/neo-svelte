<script lang="ts">
  import type { NeoSkeletonMediaProps } from '~/skeletons/neo-skeleton-media.model.js';

  import { fade } from 'svelte/transition';

  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import NeoIconImage from '~/icons/NeoIconImage.svelte';
  import NeoIconVideo from '~/icons/NeoIconVideo.svelte';
  import NeoSkeletonContainer from '~/skeletons/NeoSkeletonContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickDelayProps, quickDurationProps } from '~/utils/transition.utils.js';

  let {
    // Snippets
    children: content,
    media,

    // State
    ref = $bindable(),
    loading = true,
    type = 'empty',
    size = type === 'avatar' ? '70%' : '20%',
    flex,
    align,
    glass,
    disabled,

    // Styles
    rounded,
    circle,
    ratio = type === 'video' ? '16 / 9' : '4 / 3',

    // Size
    width: _width,
    height: _height,

    // Transition
    in: inAction = { use: fade, props: quickDelayProps },
    out: outAction = { use: fade, props: quickDurationProps },

    // Other props
    containerProps,
    transitionProps,
    ...rest
  }: NeoSkeletonMediaProps = $props();

  const MediaType = $derived.by(() => {
    switch (type) {
      case 'image':
        return NeoIconImage;
      case 'video':
        return NeoIconVideo;
      case 'avatar':
        return NeoIconAccount;
      default:
        return undefined;
    }
  });

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const inFn = $derived(toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));
</script>

<NeoSkeletonContainer
  bind:ref
  {loading}
  {disabled}
  in={inAction}
  out={outAction}
  width={width?.absolute}
  height={height?.absolute}
  {content}
  containerProps={transitionProps}
  {...containerProps}
>
  <div
    class:neo-skeleton-media={true}
    class:neo-rounded={rounded}
    class:neo-circle={circle}
    class:neo-glass={glass}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style:aspect-ratio={ratio}
    style:align-self={align}
    style:flex
    style:--neo-skeleton-border-radius={computeBorderRadius(rounded)}
    in:inFn={inProps}
    out:outFn={outProps}
    {...rest}
  >
    <span class="neo-skeleton-media-icon" style:--neo-skeleton-media-icon-size={size}>
      {#if media}
        {@render media?.()}
      {:else if MediaType}
        <MediaType />
      {/if}
    </span>
  </div>
</NeoSkeletonContainer>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-skeleton-media {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--neo-skeleton-gap, var(--neo-gap-xl));
    width: 100%;
    border-radius: var(--neo-skeleton-border-radius, var(--neo-border-radius));

    @include mixin.skeleton;

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
    }

    &.neo-rounded {
      border-radius: var(--neo-skeleton-border-radius, var(--neo-border-radius-xxl));
    }

    &.neo-circle {
      border-radius: 50%;
      aspect-ratio: 1 / 1;
    }

    &-icon {
      $icon-color: oklch(from var(--neo-skeleton-color) calc(l + 0.1) c h);

      position: absolute;
      top: calc(50% - var(--neo-skeleton-media-icon-size) / 2);
      left: calc(50% - var(--neo-skeleton-media-icon-size) / 2);
      width: var(--neo-skeleton-media-icon-size);
      height: var(--neo-skeleton-media-icon-size);
      color: $icon-color;
      visibility: visible;
      opacity: 0.75;

      :global(> svg:only-child) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
