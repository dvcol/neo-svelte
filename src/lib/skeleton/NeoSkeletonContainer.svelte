<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoSkeletonContainerProps } from '~/skeleton/neo-skeleton-container.model.js';

  import NeoTransitionContainer from '~/container/NeoTransitionContainer.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { enterDefaultTransition, leaveDefaultTransition } from '~/utils/transition.utils.js';

  const {
    // Snippets
    content,
    children: skeleton,

    // State
    loading = true,

    // Styles
    width,
    height,

    // Transition
    in: inAction,
    out: outAction,

    // Other props
    containerProps,
  }: NeoSkeletonContainerProps = $props();

  const inFn = $derived(toTransition(inAction, fade));
  const inProps = $derived(toTransitionProps(inAction, leaveDefaultTransition));
  const outFn = $derived(toTransition(outAction, fade));
  const outProps = $derived(toTransitionProps(outAction, enterDefaultTransition));
</script>

{#if content}
  <NeoTransitionContainer {width} {height} {...containerProps}>
    {#if loading}
      {@render skeleton?.()}
    {:else}
      <div class="neo-skeleton-content-container" in:inFn={inProps} out:outFn={outProps}>
        {@render content?.()}
      </div>
    {/if}
  </NeoTransitionContainer>
{:else if loading}
  {@render skeleton?.()}
{/if}
