<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonMediaProps } from '~/skeleton/neo-skeleton-media.model.js';

  import IconAccount from '~/icons/IconAccount.svelte';
  import IconImage from '~/icons/IconImage.svelte';
  import IconVideo from '~/icons/IconVideo.svelte';
  import NeoSkeletonContainer from '~/skeleton/NeoSkeletonContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterDefaultTransition, leaveDefaultTransition } from '~/utils/transition.utils.js';

  const {
    // Snippets
    children: content,
    media,

    // State
    loading = true,
    type = 'empty',
    size = type === 'avatar' ? '70%' : '20%',
    width,
    height,

    // Styles
    rounded,
    circle,
    ratio = type === 'video' ? '16 / 9' : '4 / 3',

    // Transition
    in: inAction,
    out: outAction,

    // Other props
    containerProps,
    ...rest
  }: NeoSkeletonMediaProps = $props();

  const MediaType = $derived.by(() => {
    switch (type) {
      case 'image':
        return IconImage;
      case 'video':
        return IconVideo;
      case 'avatar':
        return IconAccount;
      default:
        return undefined;
    }
  });

  const inFn = $derived(toTransition(inAction, fade));
  const inProps = $derived(toTransitionProps(inAction, leaveDefaultTransition));
  const outFn = $derived(toTransition(outAction, fade));
  const outProps = $derived(toTransitionProps(outAction, enterDefaultTransition));
</script>

<NeoSkeletonContainer {loading} in={inAction} out={outAction} {width} {height} {containerProps} {content}>
  <div
    class:neo-skeleton-media={true}
    class:rounded
    class:circle
    style:aspect-ratio={ratio}
    style:width
    style:height
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
    gap: var(--neo-gap-lg);
    width: 100%;
    border-radius: var(--neo-border-radius);

    @include mixin.skeleton;

    &.rounded {
      border-radius: var(--neo-border-radius-lg);
    }

    &.circle {
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

      :global(svg:only-child) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
