<script lang="ts">
  import { getContext } from 'svelte';
  import { fly } from 'svelte/transition';

  import type { NeoTabPaneProps } from '~/nav/neo-tab-pane.model.js';

  import { NeoTabsCardContextSymbol } from '~/nav/neo-tabs-card.model.js';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tabId,
    empty,
    tag = 'div',

    // Styles
    animate,

    // Other props
    ...rest
  }: NeoTabPaneProps = $props();
  /* eslint-enable prefer-const */

  const context = getTabContext();
  const active = $derived(context?.active === tabId);
  const orientation = $derived(context?.vertical ? 'y' : 'x');

  const show = $derived(empty ? !context?.active : active);

  const current = $derived(context?.value?.index ?? -1);
  const previous = $derived(context?.previous?.index ?? -1);
  const direction = $derived(current > previous ? 1 : -1);

  const ctx = getContext(NeoTabsCardContextSymbol);
  const transition = $derived(animate || (animate !== false && ctx?.animate));
</script>

{#if transition && show}
  <svelte:element
    this={tag}
    bind:this={ref}
    {...rest}
    class={['neo-tab-pane', rest.class].filter(Boolean).join(' ')}
    in:fly={{ [orientation]: `${-100 * direction}%`, duration: 500, delay: 100 }}
    out:fly={{ [orientation]: `${100 * direction}%`, duration: 500 }}
  >
    {@render children?.(context?.state)}
  </svelte:element>
{:else if show}
  {@render children?.(context?.state)}
{/if}
