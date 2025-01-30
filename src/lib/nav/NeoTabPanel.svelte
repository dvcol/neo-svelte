<script lang="ts">
  import { emptyTransition } from '@dvcol/svelte-utils/transition';
  import { untrack } from 'svelte';
  import { fly } from 'svelte/transition';

  import type { NeoTabPanelProps } from '~/nav/neo-tab-panel.model.js';

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
  }: NeoTabPanelProps = $props();
  /* eslint-enable prefer-const */

  const context = getTabContext();
  const active = $derived(context?.active === tabId);
  const orientation = $derived(context?.state?.vertical ? 'y' : 'x');

  const show = $derived(empty ? !context?.active : active);

  const current = $derived(context?.value?.index ?? -1);
  const previous = $derived(context?.previous?.index ?? -1);
  const direction = $derived(current > previous ? 1 : -1);

  const ctx = getTabsCardContext();
  const animated = $derived(animate || (animate !== false && ctx?.animate));

  const transition = $derived(animated ? fly : emptyTransition);
  const inProps = $derived(animated ? { [orientation]: `${-100 * direction}%`, duration: 600, delay: 100 } : undefined);
  const outProps = $derived(animated ? { [orientation]: `${100 * direction}%`, duration: 600 } : undefined);

  const paneId = $derived(tabId ? `neo-tab-panel-${String(tabId)}` : undefined);
  $effect(() => {
    untrack(() => {
      if (!tabId || !paneId) return;
      context?.registerPane(tabId, paneId);
    });
    return () => {
      if (!tabId) return;
      context?.removePane(tabId);
    };
  });
</script>

{#if show}
  <svelte:element
    this={tag}
    role="tabpanel"
    id={paneId}
    aria-labelledby={tabId ? `neo-tab-${String(tabId)}` : undefined}
    data-tab-id={tabId ?? (empty ? 'empty' : undefined)}
    bind:this={ref}
    class:neo-tab-panel={true}
    {...rest}
    in:transition={inProps}
    out:transition={outProps}
  >
    {@render children?.(context?.state)}
  </svelte:element>
{/if}
