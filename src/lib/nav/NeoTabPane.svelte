<script lang="ts">
  import { fly } from 'svelte/transition';

  import type { NeoTabPaneProps } from '~/nav/neo-tab-pane.model.js';

  import { getTabsCardContext } from '~/nav/neo-tabs-card.model.js';
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

  const ctx = getTabsCardContext();
  const transition = $derived(animate || (animate !== false && ctx?.animate));
</script>

{#if transition && show}
  <svelte:element
    this={tag}
    role="tabpanel"
    data-tab-id={tabId ?? (empty ? 'empty' : undefined)}
    bind:this={ref}
    class:neo-tab-pane={true}
    {...rest}
    in:fly={{ [orientation]: `${-100 * direction}%`, duration: 600, delay: 100 }}
    out:fly={{ [orientation]: `${100 * direction}%`, duration: 600 }}
  >
    {@render children?.(context?.state)}
  </svelte:element>
{:else if show}
  {@render children?.(context?.state)}
{/if}
