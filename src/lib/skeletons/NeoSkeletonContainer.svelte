<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { resize } from '@dvcol/svelte-utils/resize';
  import { untrack } from 'svelte';
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';

  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { quickScaleDelayProps, quickScaleProps } from '~/utils/transition.utils.js';

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

    // Content
    context = $bindable({}),

    // Transition
    in: inAction = { use: fade, props: quickScaleProps },
    out: outAction = { use: fade, props: quickScaleDelayProps },

    // Other props
    containerProps,
    ...rest
  }: NeoSkeletonContainerProps = $props();
  /* eslint-enable prefer-const */

  const inFn = $derived(toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));

  const updateSize = $derived(
    debounce(
      () =>
        untrack(() => {
          if (!ref) return;
          const rect = ref.getBoundingClientRect();
          if (!width && rect?.width) context.width = `${rect.width}px`;
          if (!height && rect?.height) context.height = `${rect.height}px`;
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
        style:--neo-skeleton-content-width={context?.width}
        style:--neo-skeleton-content-height={context?.height}
        {...rest}
      >
        {@render skeleton?.(context)}
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
  {@render skeleton?.(context)}
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
