<script lang="ts">
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
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
  const borderless = $derived(context?.state?.borderless);
  const elevation = $derived(context?.state?.elevation);
  const pressed = $derived(context?.state?.pressed);
  const convex = $derived(context?.state?.convex);
  const glass = $derived(context?.state?.glass);
  const start = $derived(context?.state?.start);

  $effect.pre(() => {
    setTabsCardContext({ animate });
  });
</script>

<NeoCard bind:ref {borderless} {elevation} {pressed} {convex} {glass} {start} {...rest}>
  {#if animate}
    <NeoTransitionContainer overflow="hidden" {...containerProps}>
      {@render children?.(context?.state)}
    </NeoTransitionContainer>
  {:else}
    {@render children?.(context?.state)}
  {/if}
</NeoCard>
