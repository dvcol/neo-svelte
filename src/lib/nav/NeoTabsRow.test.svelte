<script lang="ts">
  import type { NeoTabRowItem } from '~/nav/neo-tabs-row.model.js';

  import NeoTabsRow from '~/nav/NeoTabsRow.svelte';

  let {
    tabs = [],
    active = $bindable(),
    threshold = $bindable(0),
    vertical,
    disabled,
    onchange,
    wrapperStyle,
  }: {
    tabs?: NeoTabRowItem<string>[];
    active?: string;
    threshold?: number;
    vertical?: boolean;
    disabled?: boolean;
    onchange?: (...args: any[]) => void;
    wrapperStyle?: string;
  } = $props();
</script>

{#if wrapperStyle}
  <div style={wrapperStyle}>
    <NeoTabsRow
      {tabs}
      bind:active
      bind:threshold
      {vertical}
      {disabled}
      {onchange}
      width="100%"
      containerProps={{ style: 'width: 100%; box-sizing: border-box;' }}
    />
  </div>
{:else}
  <NeoTabsRow
    {tabs}
    bind:active
    bind:threshold
    {vertical}
    {disabled}
    {onchange}
  />
{/if}
