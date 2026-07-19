<script lang="ts">
  import type { NeoListItem, NeoListItemContext, NeoListRowContext } from '~/list/neo-list.model.js';
  import type { NeoSortableContextItems } from '~/sortable/neo-sortable-context.svelte.js';

  import { emptyTransition } from '@dvcol/svelte-utils/transition';

  import NeoList from '~/list/NeoList.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoDroppableZone from '~/sortable/NeoDroppableZone.svelte';
  import NeoSortableItem from '~/sortable/NeoSortableItem.svelte';
  import NeoSortableProvider from '~/sortable/NeoSortableProvider.svelte';
  import { attachToParent } from '~/utils/attach.utils.js';

  type ItemData = { label: string };
  type Item = { id: string; data: ItemData };

  interface Props {
    axis?: 'x' | 'y';
    disabledId?: string;
    emptyList?: boolean;
    multiList?: boolean;
    multiNeoList?: boolean;
    neoList?: boolean;
    neoListCustomItem?: boolean;
    neoListRow?: boolean;
    neoListSelect?: boolean;
  }

  const {
    axis = 'y',
    disabledId,
    emptyList = false,
    multiList = false,
    multiNeoList = false,
    neoList = false,
    neoListCustomItem = true,
    neoListRow: withNeoListRow = true,
    neoListSelect = false,
  }: Props = $props();

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

  let emptyListInitialized = false;
  $effect.pre(() => {
    if (emptyListInitialized) return;
    emptyListInitialized = true;
    if (emptyList) multiItems = { ...multiItems, 'list-b': [] };
  });

  const neoListItems = $derived((items as Item[]).map(({ id, data }) => ({ id, value: id, ...data })) satisfies NeoListItem[]);
</script>

{#snippet neoListItem({ item }: NeoListItemContext)}
  <div
    class="list-item"
    data-testid="sortable-item"
    data-id={item.id}
  >
    {item.label}
  </div>
{/snippet}

{#snippet neoListRow({ item, index, content }: NeoListRowContext)}
  <NeoSortableItem
    id={typeof item.id === 'string' || typeof item.id === 'number' ? item.id : index}
    {index}
    data={item}
    disabled={item.id === disabledId}
  >
    {#snippet children({ instance })}
      <div {...attachToParent(instance.attach)} class="row-attachment">
        {@render content()}
      </div>
    {/snippet}
  </NeoSortableItem>
{/snippet}

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if neoList}
      <NeoSortableProvider bind:items {axis}>
        <NeoList
          row={withNeoListRow ? neoListRow : undefined}
          items={neoListItems}
          item={neoListCustomItem ? neoListItem : undefined}
          select={neoListSelect}
          data-testid="sortable-list"
        />
      </NeoSortableProvider>
    {:else if !multiList}
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
              {#if multiNeoList}
                {#snippet itemContent({ item }: NeoListItemContext)}
                  <div class="list-item" data-testid="sortable-item" data-id={item.id} data-list={listId}>
                    {item.label}
                  </div>
                {/snippet}
                {#snippet row({ item, index, content }: NeoListRowContext)}
                  <NeoSortableItem
                    id={typeof item.id === 'string' || typeof item.id === 'number' ? item.id : index}
                    {index}
                    group={listId}
                    data={item}
                  >
                    {#snippet children({ instance })}
                      <div {...attachToParent(instance.attach)} class="row-attachment">
                        {@render content()}
                      </div>
                    {/snippet}
                  </NeoSortableItem>
                {/snippet}
                <NeoList
                  {row}
                  item={itemContent}
                  items={list.map(({ id, data }) => ({ id, value: id, ...data }))}
                  in={ctx.isDragging ? emptyTransition : undefined}
                  out={ctx.isDragging ? emptyTransition : undefined}
                  data-testid="sortable-list"
                  data-list-id={listId}
                />
                <NeoDroppableZone id={listId}>
                  {#snippet children(zone)}
                    {#if !list.length}
                      <div
                        {@attach zone.attach}
                        class="drop-zone"
                        data-testid="drop-zone"
                        data-list={listId}
                      >
                        Drop here
                      </div>
                    {/if}
                  {/snippet}
                </NeoDroppableZone>
              {:else}
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
              {/if}
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

  .row-attachment {
    display: contents;
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
