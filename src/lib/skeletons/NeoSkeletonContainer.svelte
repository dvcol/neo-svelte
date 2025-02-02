<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { resize } from '@dvcol/svelte-utils/resize';
  import { untrack } from 'svelte';
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';

  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { scaleEnterProps, scaleLeaveProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    content,
    children: skeleton,

    // State
    tag = 'div',
    ref = $bindable(),
    loading = true,

    // Styles
    width,
    height,

    // Transition
    in: inAction = { use: fade, props: scaleEnterProps },
    out: outAction = { use: fade, props: scaleLeaveProps },

    // Other props
    containerProps,
    ...rest
  }: NeoSkeletonContainerProps = $props();
  /* eslint-enable prefer-const */

  const inFn = $derived(toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));

  let skeletonWidth = $state(width);
  let skeletonHeight = $state(height);
  let skeletonLines = $state<number>();

  const updateSize = $derived(
    debounce(
      () =>
        untrack(() => {
          if (!ref) return;
          const rect = ref.getBoundingClientRect();
          if (!width && rect?.width) skeletonWidth = `${rect.width}px`;
          if (!height && rect?.height) skeletonHeight = `${rect.height}px`;

          if (!rect?.height) return;
          const lineHeight = Number.parseInt(getComputedStyle(ref).lineHeight, 10);
          if (Number.isNaN(lineHeight) || !lineHeight) return;
          skeletonLines = Math.round(rect.height / lineHeight);
        }),
      inProps?.delay,
    ),
  );

  $effect.pre(() => {
    if (!ref || loading) return;
    updateSize();
  });
</script>

{#if content}
  <NeoTransitionContainer {width} {height} {...containerProps}>
    {#if loading}
      <svelte:element
        this={tag}
        class:neo-skeleton-container={true}
        style:--neo-skeleton-content-width={skeletonWidth}
        style:--neo-skeleton-content-height={skeletonHeight}
        style:--neo-skeleton-content-lines={skeletonLines}
        {...rest}
      >
        {@render skeleton?.()}
      </svelte:element>
    {:else}
      <svelte:element
        this={tag}
        class:neo-skeleton-content-container={true}
        bind:this={ref}
        style:--neo-skeleton-content-lines={skeletonLines}
        in:inFn={inProps}
        out:outFn={outProps}
        use:resize={updateSize}
        {...rest}
      >
        {@render content?.()}
      </svelte:element>
    {/if}
  </NeoTransitionContainer>
{:else if loading}
  {@render skeleton?.()}
{/if}

<style lang="scss">
  .neo-skeleton-container {
    display: flex;
    width: var(--neo-skeleton-content-width);
    min-height: var(--neo-skeleton-content-height);
  }

  .neo-skeleton-content-container {
    width: fit-content;
    height: fit-content;
  }
</style>
