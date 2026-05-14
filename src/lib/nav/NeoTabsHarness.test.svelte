<script lang="ts">
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabPanel from '~/nav/NeoTabPanel.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  type Tab = { tabId: string; label: string; value?: string; disabled?: boolean };

  let {
    tabs = [],
    active = $bindable(),
    close,
    add,
    line,
    pill,
    slide,
    disabled,
    vertical,
    onclose,
    onadd,
    onchange,
  }: {
    tabs?: Tab[];
    active?: string;
    close?: boolean;
    add?: boolean;
    line?: boolean;
    pill?: boolean;
    slide?: boolean;
    disabled?: boolean;
    vertical?: boolean;
    onclose?: (...args: any[]) => void;
    onadd?: () => void;
    onchange?: (...args: any[]) => void;
  } = $props();
</script>

<NeoTabs
  bind:active
  {close}
  {add}
  {line}
  {pill}
  {slide}
  {disabled}
  {vertical}
  {onclose}
  {onadd}
  {onchange}
>
  {#each tabs as tab (tab.tabId)}
    <NeoTab tabId={tab.tabId} value={tab.value ?? tab.label} disabled={tab.disabled}>
      {tab.label}
    </NeoTab>
  {/each}
  {#snippet panes()}
    {#each tabs as tab (tab.tabId)}
      <NeoTabPanel tabId={tab.tabId}>
        <span data-pane={tab.tabId}>panel-{tab.label}</span>
      </NeoTabPanel>
    {/each}
  {/snippet}
</NeoTabs>
