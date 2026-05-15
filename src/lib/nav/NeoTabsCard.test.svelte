<script lang="ts">
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoTabsCard from '~/nav/NeoTabsCard.svelte';

  let {
    tabs = [],
    active = $bindable(),
    animate,
  }: {
    tabs?: { tabId: string; label: string }[];
    active?: string;
    animate?: boolean;
  } = $props();
</script>

<NeoTabs bind:active>
  {#each tabs as tab (tab.tabId)}
    <NeoTab tabId={tab.tabId}>{tab.label}</NeoTab>
  {/each}
  {#snippet panes()}
    <NeoTabsCard {animate}>
      <span class="harness-card-content">card-{active ?? 'none'}</span>
    </NeoTabsCard>
  {/snippet}
</NeoTabs>
