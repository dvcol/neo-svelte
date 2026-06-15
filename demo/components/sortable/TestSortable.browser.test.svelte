<script lang="ts">
  import type { NeoSortableContextItems } from '~/sortable/neo-sortable-context.svelte.js';

  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoDroppableZone from '~/sortable/NeoDroppableZone.svelte';
  import NeoSortableItem from '~/sortable/NeoSortableItem.svelte';
  import NeoSortableProvider from '~/sortable/NeoSortableProvider.svelte';

  type ItemData = { label: string };
  type Item = { id: string; data: ItemData };

  interface Props {
    axis?: 'x' | 'y';
    disabledId?: string;
    multiList?: boolean;
  }

  const { axis = 'y', disabledId, multiList = false }: Props = $props();

  let items = $state<NeoSortableContextItems<ItemData>>([
    { id: 'item-1', data: { label: 'Item 1' } },
    { id: 'item-2', data: { label: 'Item 2' } },
    { id: 'item-3', data: { label: 'Item 3' } },
  ]);

  let multiItems = $state<Record<string, Item[]>>({
    'list-a': [
      { id: 'la-1', data: { label: 'A1' } },
      { id: 'la-2', data: { label: 'A2' } },
    ],
    'list-b': [
      { id: 'lb-1', data: { label: 'B1' } },
      { id: 'lb-2', data: { label: 'B2' } },
    ],
  });
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if !multiList}
      <NeoSortableProvider bind:items {axis}>
        {#snippet children(ctx)}
          <ol class="list" data-testid="sortable-list">
            {#each ctx.items as item, index (item.id)}
              <NeoSortableItem
                {...(item as Item)}
                {index}
                disabled={(item as Item).id === disabledId}
              >
                {#snippet children({ instance })}
                  <li
                    {@attach instance.attach}
                    class="list-item"
                    data-testid="sortable-item"
                    data-id={(item as Item).id}
                  >
                    {(item as Item).data.label}
                  </li>
                {/snippet}
              </NeoSortableItem>
            {/each}
          </ol>
        {/snippet}
      </NeoSortableProvider>
    {:else}
      <NeoSortableProvider bind:items={multiItems}>
        {#snippet children(ctx)}
          <div class="multi-container" data-testid="multi-container">
            {#each Object.entries(ctx.items as Record<string, Item[]>) as [listId, list] (listId)}
              <ol class="list" data-testid="sortable-list" data-list-id={listId}>
                {#each list as item, index (item.id)}
                  <NeoSortableItem {...item} {index}>
                    {#snippet children({ instance })}
                      <li
                        {@attach instance.attach}
                        class="list-item"
                        data-testid="sortable-item"
                        data-id={item.id}
                        data-list={listId}
                      >
                        {item.data.label}
                      </li>
                    {/snippet}
                  </NeoSortableItem>
                {/each}

                <NeoDroppableZone id={listId}>
                  {#snippet children(zone)}
                    {#if !list.length}
                      <li
                        {@attach zone.attach}
                        class="drop-zone"
                        data-testid="drop-zone"
                        data-list={listId}
                      >
                        Drop here
                      </li>
                    {/if}
                  {/snippet}
                </NeoDroppableZone>
              </ol>
            {/each}
          </div>
        {/snippet}
      </NeoSortableProvider>
    {/if}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html),
  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .list {
    width: 14rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .list-item {
    box-sizing: border-box;
    min-height: 3.75rem;
    margin-bottom: 0.25rem;
    padding: 0.5rem 1rem;
    border: 1px solid;
    cursor: grab;
    touch-action: none;
  }

  .multi-container {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    .list {
      width: auto;
      min-width: 9rem;
      min-height: 4rem;
      padding: 0.5rem;
      border: 2px solid;
    }

    .list-item {
      min-height: 3rem;
      padding: 0.25rem 0.75rem;
    }
  }

  .drop-zone {
    box-sizing: border-box;
    min-height: 2.5rem;
    padding: 0.5rem;
    font-size: 0.75rem;
    border: 2px dashed;
  }
</style>
