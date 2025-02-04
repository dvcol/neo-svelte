<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';

  import NeoSkeletonContainer from '~/skeletons/NeoSkeletonContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { enterTransitionProps, leaveTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: content,

    // Styles
    alt,
    title,
    justify,
    align,
    glass,
    flex,

    // Size
    width: _width,
    height: _height,

    // State
    ref = $bindable(),
    loading = true,
    paragraphs = 1,
    lines: inputLines,
    fallback = alt ? 26 : 6,

    // Transition
    in: inAction = { use: fade, props: leaveTransitionProps },
    out: outAction = { use: fade, props: enterTransitionProps },

    // Other props
    titleProps,
    paragraphProps,
    containerProps,
    transitionProps,
    ...rest
  }: NeoSkeletonTextProps = $props();
  /* eslint-enable prefer-const */

  let auto = $state<number>();
  $effect(() => {
    if (loading || !ref || inputLines !== 'auto') return;
    const contentHeight = ref.getBoundingClientRect()?.height;
    const lineHeight = Number.parseInt(getComputedStyle(ref).lineHeight, 10);
    if (!contentHeight || Number.isNaN(lineHeight) || !lineHeight) return;
    const _lines = Math.round(contentHeight / lineHeight);
    if (!_lines) return;
    const _paragraphs = Number(paragraphs) || 1;
    if (Number.isNaN(_paragraphs)) return;
    auto = Math.floor(_lines / _paragraphs);
  });

  const lines = $derived.by(() => {
    if (inputLines === 'auto' && auto) return auto;
    if (inputLines !== undefined && inputLines !== 'auto') return inputLines;
    return Number(fallback);
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
  in={inAction}
  out={outAction}
  width={width?.absolute}
  height={height?.absolute}
  {content}
  containerProps={transitionProps}
  {...containerProps}
>
  <div
    class:neo-skeleton-text={true}
    class:neo-glass={glass}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style:align-self={align}
    style:flex
    in:inFn={inProps}
    out:outFn={outProps}
    {...rest}
  >
    {#if title}
      <div class:neo-skeleton-text-line={true} class:neo-title={title} class:neo-alt={alt} {...titleProps}>&nbsp;</div>
    {/if}

    {#if paragraphs && lines}
      {#each Array(Number(paragraphs)) as _, i}
        <div class:neo-skeleton-text-paragraph={true} class:neo-alt={alt} class:neo-justify={justify} {...paragraphProps}>
          {#each Array(Number(Array.isArray(lines) ? lines[i] : lines)) as __}
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
    height: var(--neo-skeleton-text-font-size, var(--neo-font-size, 1rem));
    margin: var(
      --neo-skeleton-text-margin,
      calc(
          (var(--neo-skeleton-text-line-height, var(--neo-line-height, 1.5rem)) - var(--neo-skeleton-text-font-size, var(--neo-font-size, 1rem))) / 2
        )
        0
    );
    border-radius: var(--neo-skeleton-border-radius, var(--neo-border-radius-lg));

    @include mixin.skeleton;

    &:nth-child(even) {
      animation-delay: 0.5s;
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

    &:last-child {
      width: 60%;
    }

    &:only-child {
      width: 100%;
    }

    &:nth-last-child(2):not(:only-child, :first-child) {
      width: 70%;
    }

    &:first-child:not(:only-child, :nth-last-child(2)) {
      width: 75%;
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
      height: var(--neo-skeleton-text-title-font-size, var(--neo-font-size-xl, 1.5rem));
      margin: 0;
    }
  }

  .neo-skeleton-text-paragraph {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;

    &.neo-alt {
      flex-flow: row wrap;
      gap: var(--neo-skeleton-alt-gap, 0 var(--neo-gap-xxxs));
    }

    &.neo-justify {
      .neo-skeleton-text-line {
        flex: 1 1 auto;
      }
    }
  }
</style>
