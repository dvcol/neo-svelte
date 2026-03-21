<script lang="ts" generics="Id extends TabId, Value = any">
  import type { TabId } from 'src/lib/index.js';

  import type { NeoTabPanelProps } from '~/nav/neo-tab-panel.model.js';

  import { emptyTransition } from '@dvcol/svelte-utils/transition';
  import { untrack } from 'svelte';
  import { fly } from 'svelte/transition';

  import { getTabsCardContext } from '~/nav/neo-tabs-card.model.js';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

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

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    ...rest
  }: NeoTabPanelProps<Id, Value> = $props();

  const context = getTabContext<Id, Value>();
  const active = $derived(context?.active === tabId);
  const orientation = $derived(context?.state?.vertical ? 'y' : 'x');

  const show = $derived(empty ? !context?.active : active);

  const current = $derived(context?.value?.index ?? -1);
  const previous = $derived(context?.previous?.index ?? -1);
  const direction = $derived(current > previous ? 1 : -1);

  const ctx = getTabsCardContext();
  const animated = $derived(animate || (animate !== false && ctx?.animate));

  const inFn = $derived(toTransition(inAction ?? transitionAction, animated ? fly : emptyTransition));
  const inProps = $derived(
    toTransitionProps(inAction ?? transitionAction, animated ? { [orientation]: `${-100 * direction}%`, duration: 600, delay: 100 } : undefined),
  );
  const outFn = $derived(toTransition(outAction ?? transitionAction, animated ? fly : emptyTransition));
  const outProps = $derived(
    toTransitionProps(outAction ?? transitionAction, animated ? { [orientation]: `${100 * direction}%`, duration: 600 } : undefined),
  );

  const paneId = $derived(tabId ? `neo-tab-panel-${String(tabId)}` as Id : undefined);
  $effect.pre(() => {
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
    id={paneId?.toString()}
    aria-labelledby={tabId ? `neo-tab-${String(tabId)}` : undefined}
    data-tab-id={tabId ?? (empty ? 'empty' : undefined)}
    bind:this={ref}
    class:neo-tab-panel={true}
    {...rest}
    in:inFn={inProps}
    out:outFn={outProps}
  >
    {@render children?.(context?.state)}
  </svelte:element>
{/if}
