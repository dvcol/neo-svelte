<script lang="ts">
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoTransitionContainer from '~/container/NeoTransitionContainer.svelte';
  import { type NeoTabsCardProps, setTabsCardContext } from '~/nav/neo-tabs-card.model.js';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),

    // Styles
    animate = true,

    // Other props
    containerProps,
    ...rest
  }: NeoTabsCardProps = $props();
  /* eslint-enable prefer-const */

  const context = getTabContext();
  const glass = $derived(context?.glass);
  const borderless = $derived(context?.text);

  const elevation = $derived.by(() => {
    if (context?.flat) return 0;
    if (context?.inset) return context?.shallow ? -1 : -2;
    return context?.shallow ? 1 : 2;
  });

  $effect.pre(() => {
    setTabsCardContext({ animate });
  });
</script>

<NeoCard bind:ref {elevation} {borderless} {glass} {...rest}>
  {#if animate}
    <NeoTransitionContainer {...containerProps}>
      {@render children?.(context?.state)}
    </NeoTransitionContainer>
  {:else}
    {@render children?.(context?.state)}
  {/if}
</NeoCard>
