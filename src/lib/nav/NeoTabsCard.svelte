<script lang="ts">
  import type { NeoTabsCardProps } from '~/nav/neo-tabs-card.model.js';

  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoTransitionContainer from '~/container/NeoTransitionContainer.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  const {
    // Snippets
    children,

    // Styles
    animate = true,

    // Other props
    containerProps,
    ...rest
  }: NeoTabsCardProps = $props();

  const context = getTabContext();
  const glass = $derived(context?.glass);

  const elevation = $derived.by(() => {
    if (context?.inset) return context?.shallow ? -1 : -2;
    return context?.shallow ? 1 : 2;
  });
</script>

<NeoCard {elevation} {glass} {...rest}>
  {#if animate}
    <NeoTransitionContainer {...containerProps}>
      {@render children?.(context?.state)}
    </NeoTransitionContainer>
  {:else}
    {@render children?.(context?.state)}
  {/if}
</NeoCard>
