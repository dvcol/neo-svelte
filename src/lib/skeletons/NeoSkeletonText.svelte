<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';

  import NeoSkeletonContainer from '~/skeletons/NeoSkeletonContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterTransitionProps, leaveTransitionProps } from '~/utils/transition.utils.js';

  const {
    // Snippets
    children: content,

    // Styles
    alt,
    title,
    justify,
    width,
    height,
    glass,

    // State
    loading = true,
    paragraphs = 1,
    lines = alt ? 26 : 6,

    // Transition
    in: inAction,
    out: outAction,

    // Other props
    titleProps,
    paragraphProps,
    containerProps,
    ...rest
  }: NeoSkeletonTextProps = $props();

  const inFn = $derived(toTransition(inAction, fade));
  const inProps = $derived(toTransitionProps(inAction, leaveTransitionProps));
  const outFn = $derived(toTransition(outAction, fade));
  const outProps = $derived(toTransitionProps(outAction, enterTransitionProps));
</script>

<NeoSkeletonContainer {loading} in={inAction} out={outAction} {width} {height} {containerProps} {content}>
  <div class:neo-skeleton-text={true} class:neo-glass={glass} style:width style:height in:inFn={inProps} out:outFn={outProps} {...rest}>
    {#if title}
      <div class:neo-skeleton-text-line={true} class:neo-title={title} class:neo-alt={alt} {...titleProps}>&nbsp;</div>
    {/if}

    {#if paragraphs && lines}
      {#each Array(Number(paragraphs)) as _}
        <div class:neo-skeleton-text-paragraph={true} class:neo-alt={alt} class:neo-justify={justify} {...paragraphProps}>
          {#each Array(Number(lines)) as __}
            <div class="neo-skeleton-text-line" class:neo-alt={alt}>&nbsp;</div>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</NeoSkeletonContainer>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-skeleton-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--neo-skeleton-gap, var(--neo-gap-lg));

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
    }
  }

  .neo-skeleton-text-line {
    width: 100%;
    height: var(--neo-line-height-xs, 1rem);
    border-radius: var(--neo-skeleton-border-radius, var(--neo-border-radius-lg));

    @include mixin.skeleton;

    &:nth-child(even) {
      animation-delay: 0.5s;
    }

    &:first-child {
      width: 60%;
    }

    &:nth-child(2n) {
      width: 95%;
    }

    &:nth-child(4n) {
      width: 80%;
      animation-delay: 1.15s;
    }

    &:nth-child(6n) {
      width: 70%;
    }

    &:nth-last-child(2) {
      width: 60%;
    }

    &:last-child {
      width: 40%;
    }

    &:only-child {
      width: 100%;
    }

    &.neo-alt {
      width: 20%;

      &:nth-child(even) {
        width: 24%;
      }

      &:nth-child(3n) {
        width: 16%;
        animation-delay: 0.75s;
      }

      &:nth-child(4n) {
        width: 28%;
      }

      &:nth-child(6n) {
        width: 12%;
      }

      &:nth-child(7n) {
        width: 18%;
      }
    }

    &.neo-title {
      width: 70%;
      height: var(--neo-line-height, 1.5rem);
    }
  }

  .neo-skeleton-text-paragraph {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    gap: var(--neo-skeleton-paragraph-gap, var(--neo-gap-xs));

    &.neo-alt {
      flex-flow: row wrap;
    }

    &.neo-justify {
      .neo-skeleton-text-line {
        flex: 1 1 auto;
      }
    }
  }
</style>
