<script lang="ts">
  import type { NeoTabPaneProps } from '~/nav/neo-tab-pane.model.js';

  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';

  const { children, tabId, empty }: NeoTabPaneProps = $props();

  const context = getTabContext();
  const active = $derived(context?.active === tabId);

  const show = $derived(empty ? !context?.active : active);
</script>

{#if show}
  {@render children?.(context?.state ?? {})}
{/if}
