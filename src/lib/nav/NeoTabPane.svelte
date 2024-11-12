<script lang="ts">
  import { fly } from 'svelte/transition';

  import type { NeoTabPaneProps } from '~/nav/neo-tab-pane.model.js';

  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  const {
    // Snippets
    children,

    // States
    tabId,
    empty,
    tag = 'div',

    // Styles
    animate = true,

    // Other props
    ...rest
  }: NeoTabPaneProps = $props();

  const context = getTabContext();
  const active = $derived(context?.active === tabId);
  const orientation = $derived(context?.vertical ? 'y' : 'x');

  const show = $derived(empty ? !context?.active : active);

  const current = $derived(context?.value?.index ?? -1);
  const previous = $derived(context?.previous?.index ?? -1);
  const direction = $derived(current > previous ? 1 : -1);
</script>

{#if animate && show}
  <svelte:element
    this={tag}
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
