<script lang="ts">
  import type { NeoListContext, NeoListItem, NeoListSection } from '~/list/neo-list.model.js';

  import NeoListBaseSection from '~/list/NeoListBaseSection.svelte';

  const {
    section,
    index = 0,
    select,
    highlight,
    reverse,
    flip,
    context = {} as NeoListContext,
  }: {
    section: NeoListSection;
    index?: number;
    select?: boolean;
    highlight?: string;
    reverse?: boolean;
    flip?: boolean;
    context?: NeoListContext;
  } = $props();
</script>

<NeoListBaseSection {section} {index} {select} {highlight} {reverse} {flip} {context}>
  {#snippet list({ items })}
    {#each items as item, i (item.id ?? i)}
      {@const li = item as NeoListItem}
      <li class="neo-list-item" data-id={li.id}>{li.label ?? String(li.value)}</li>
    {/each}
  {/snippet}
</NeoListBaseSection>
