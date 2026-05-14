<script lang="ts">
  import NeoVirtualList from '~/list/NeoVirtualList.svelte';

  const {
    items,
    before: showBefore,
    after: showAfter,
    scrollbar,
    shadow,
    dim,
  }: {
    items: { id: number }[];
    before?: boolean;
    after?: boolean;
    scrollbar?: boolean;
    shadow?: boolean;
    dim?: boolean;
  } = $props();
</script>

{#snippet rowSnippet({ index, item }: { index: number; item: { id: number } })}
  <div class="neo-virtual-row" data-id={item.id} data-index={index}>row {item.id}</div>
{/snippet}

{#snippet beforeSnippet()}
  <span class="harness-before">before</span>
{/snippet}

{#snippet afterSnippet()}
  <span class="harness-after">after</span>
{/snippet}

<NeoVirtualList
  {items}
  {scrollbar}
  {shadow}
  {dim}
  before={showBefore ? beforeSnippet : undefined}
  after={showAfter ? afterSnippet : undefined}
  children={rowSnippet}
/>
