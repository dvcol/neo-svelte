<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonTextProps } from '~/skeleton/neo-skeleton-text.model.js';

  import NeoSkeletonContainer from '~/skeleton/NeoSkeletonContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  const {
    // Snippets
    children: content,

    // Styles
    alt,
    title,
    justify,
    width,
    height,

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
  const inProps = $derived(toTransitionProps(inAction, { delay: 200, duration: 200 }));
  const outFn = $derived(toTransition(outAction, fade));
  const outProps = $derived(toTransitionProps(outAction, { duration: 200 }));
</script>

<NeoSkeletonContainer {loading} in={inAction} out={outAction} {width} {height} {containerProps} {content}>
  <div class:neo-skeleton-text={true} style:width style:height in:inFn={inProps} out:outFn={outProps} {...rest}>
    {#if title}
      <div class:neo-skeleton-text-line={true} class:title class:alt {...titleProps}>&nbsp;</div>
    {/if}

    {#each Array(Number(paragraphs)) as _}
      <div class:neo-skeleton-text-paragraph={true} class:alt class:justify {...paragraphProps}>
        {#each Array(Number(lines)) as __}
          <div class="neo-skeleton-text-line" class:alt>&nbsp;</div>
        {/each}
      </div>
    {/each}
  </div>
</NeoSkeletonContainer>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-skeleton-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--neo-gap-lg);
  }

  .neo-skeleton-text-line {
    width: 100%;
    height: var(--neo-line-height-xs, 1rem);
    border-radius: var(--neo-border-radius-lg);

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

    &.alt {
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

    &.title {
      width: 70%;
      height: var(--neo-line-height, 1.5rem);
    }
  }

  .neo-skeleton-text-paragraph {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    gap: var(--neo-gap-xs);

    &.alt {
      flex-flow: row wrap;
    }

    &.justify {
      .neo-skeleton-text-line {
        flex: 1 1 auto;
      }
    }
  }
</style>
