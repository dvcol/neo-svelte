<script lang="ts">
  import { resize } from '@dvcol/svelte-utils/resize';
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';

  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterTransitionProps, leaveTransitionProps } from '~/utils/transition.utils.js';

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
    in: inAction,
    out: outAction,

    // Other props
    containerProps,
    ...rest
  }: NeoSkeletonContainerProps = $props();
  /* eslint-enable prefer-const */

  const inFn = $derived(toTransition(inAction, fade));
  const inProps = $derived(toTransitionProps(inAction, leaveTransitionProps));
  const outFn = $derived(toTransition(outAction, fade));
  const outProps = $derived(toTransitionProps(outAction, enterTransitionProps));

  let skeletonWidth = $state(width);
  let skeletonHeight = $state(height);

  const updateSize = () => {
    const rect = ref?.getBoundingClientRect();
    if (rect?.width) skeletonWidth = `${rect.width}px`;
    if (rect?.height) skeletonHeight = `${rect.height}px`;
  };

  $effect(() => {
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
        {...rest}
      >
        {@render skeleton?.()}
      </svelte:element>
    {:else}
      <svelte:element
        this={tag}
        class:neo-skeleton-content-container={true}
        bind:this={ref}
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
    height: var(--neo-skeleton-content-height);
  }

  .neo-skeleton-content-container {
    width: fit-content;
  }
</style>
