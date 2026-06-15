<script lang="ts">
  import type { NeoTabRowItem } from '~/nav/neo-tabs-row.model.js';
  import type { NeoSortableContextItems } from '~/sortable/neo-sortable-context.svelte.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoHandle from '~/floating/common/NeoHandle.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoDroppableZone from '~/sortable/NeoDroppableZone.svelte';
  import NeoSortableItem from '~/sortable/NeoSortableItem.svelte';
  import NeoSortableProvider from '~/sortable/NeoSortableProvider.svelte';
  import { Colors } from '~/utils/colors.utils';

  const options = $state({
    overlay: false,
    vertical: false,
  });

  // Drag-to-reorder showcase: a small dataset with stable string ids. `items`
  // stays pristine; the live arrangement is read via `bind:sorted`.
  const sortableItems = [
    { id: 'task-1', data: { label: 'Draft the proposal', count: 1, color: Colors.Primary } },
    { id: 'task-2', data: { label: 'Review with the team', count: 2, color: Colors.Secondary } },
    { id: 'task-3', data: { label: 'Incorporate feedback', count: 3, color: Colors.Warning } },
    { id: 'task-4', data: { label: 'Ship it', count: 4, color: Colors.Success } },
    { id: 'task-5', data: { label: 'Celebrate', count: 5, color: Colors.Secondary } },
  ] satisfies NeoSortableContextItems<{ label: string; count: null; color: string }>;

  let singleContainer = $state<HTMLElement>();
  let multipleContainer = $state<HTMLElement>();

  let activeTab = $state<string>('button');
  let snapshotActiveTab = $state<string>();
  const tabs: NeoTabRowItem[] = [
    { label: 'Button', tabId: 'button', value: 'button', close: false },
    { tabId: 'icon', value: 'icon', icon },
    { label: 'Icon', tabId: 'icon-label', value: 'icon-label', close: false, icon },
    ...Array.from({ length: 3 }, (_, i) => ({
      label: `Button ${i + 1}`,
      tabId: `button-${i + 1}`,
      value: `button-value-${i + 1}`,
    })),
  ];

  let tabContainer = $state<HTMLElement>();
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.overlay}>Overlay</NeoButton>
    <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
  </NeoButtonGroup>

</div>

{#snippet overlay(source)}
  <span>Dragging... {source?.id}</span>
{/snippet}

{#snippet listItem({ instance, data, index })}
  <li {@attach instance.attach} class="list-item" data-overlay={options.overlay} data-grabbed={instance.isDragging}>
    <NeoHandle placement="left" active={instance.isDragging} {@attach instance.attachHandle}>
      <span>{data.label} - {index}</span>
    </NeoHandle>
  </li>
{/snippet}

<section>
  <div class="row">
    <div class="column content">
      <NeoSortableProvider items={sortableItems} overlay={options.overlay ? overlay : undefined} container={singleContainer} axis={options.vertical ? 'x' : 'y'}>
        {#snippet children(ctx)}
          <h1>Single List</h1>

          <ol class="list" class:vertical={options.vertical} bind:this={singleContainer}>
            {#each ctx.items as item, index (item.id)}
              <NeoSortableItem {...item} {index} children={listItem} />
            {/each}
          </ol>
        {/snippet}
      </NeoSortableProvider>
    </div>

    <div class="column content">
      <NeoSortableProvider
        items={{ list1: sortableItems.map(i => ({ ...i, id: `list - 1 - ${i.id}`, label: `list - 1 - ${i.label}` })), list2: sortableItems.map(i => ({ ...i, label: `list - 2 - ${i.label}` })) }}
        overlay={options.overlay ? overlay : undefined}
        container={multipleContainer}
      >
        {#snippet children(ctx)}
          <div class="list-container" class:vertical={options.vertical} bind:this={multipleContainer}>
            {#each Object.entries(ctx.items) as [id, list], i (id)}
              <div class="column multi-list">
                <h1>Multi List {i + 1}</h1>
                <ol class="list" class:vertical={options.vertical}>
                  {#each list as item, index (item.id)}
                    <NeoSortableItem {...item} {index} children={listItem} />
                  {/each}
                  <NeoDroppableZone {id}>
                    {#snippet children(instance)}
                      {#if !list.length}
                        <li class="list-footer" {@attach instance.attach}>
                          <!-- drop zone as footer -->
                        </li>
                      {/if}
                    {/snippet}
                  </NeoDroppableZone>
                </ol>
              </div>
            {/each}
          </div>
        {/snippet}
      </NeoSortableProvider>
    </div>
  </div>
</section>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

<section>
  <div class="row">
    <div class="column content tabs">

      <NeoTabs vertical={options.vertical} bind:active={activeTab} elevation={-2} bind:groupRef={tabContainer}>
        <NeoSortableProvider
          items={tabs.map(t => ({ id: t.tabId, data: t }))}
          axis={options.vertical ? 'y' : 'x'}
          container={tabContainer}
          onBeforeDragStart={() => {
            if (!activeTab) return;
            snapshotActiveTab = activeTab;
            activeTab = undefined;
          }}
          onDragEnd={() => {
            if (!snapshotActiveTab) return;
            activeTab = snapshotActiveTab;
            snapshotActiveTab = undefined;
          }}
        >
          {#snippet children(ctx)}
            {#each ctx.items as { id, data }, index (id)}

              <NeoSortableItem {id} {data} {index} disabled={data.disabled}>
                {#snippet children({ instance })}
                  <NeoTab {...data} {@attach instance.attach} />
                {/snippet}
              </NeoSortableItem>

            {/each}
          {/snippet}
        </NeoSortableProvider>
      </NeoTabs>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;
  @use 'src/lib/styles/mixin' as mixin;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .label {
    max-width: 80vw;
    white-space: pre-line;
    text-align: center;
    word-break: break-all;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    min-width: 18rem;
    max-width: 80vw;
    margin: 0;
    padding: 1rem;
    list-style: none;
    border: 2px var(--neo-border-color) dashed;
    border-radius: 1rem;

    &.vertical {
      @include mixin.scrollbar;

      flex-direction: row;
    }
  }

  .list-footer {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;
  }

  .list-item {
    display: flex;
    width: 15rem;
    border: 1px var(--neo-border-color) solid;
    border-radius: 1rem;
    transition: opacity 0.25s 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease, backdrop-filter 0.25s ease;

    &[data-overlay='true'][data-grabbed='true'] {
      opacity: 0;
      transition:none;
    }

    &[data-overlay='false'][data-grabbed='true'] {
      background-color:  var(--neo-glass-background-color);
      box-shadow: var(--neo-glass-box-shadow-raised-3);
      backdrop-filter:  var(--neo-blur-3) var(--neo-saturate-2);
    }
  }

  .multi-list {
    align-items: center;

    .list {
      flex: 0 1 auto;
      min-height: 6rem;
    }
  }

  .list-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: unset;
    min-width: max-content;

    &.vertical {
      flex-direction: column;
    }
  }

  .column.tabs {
    flex: 1 1 auto;
  }

  .column {
    @include flex.column($gap: var(--neo-gap-lg), $flex: 0 1 20%);

    &.content {
      align-items: center;
      min-height: min(80vh, 24rem);

      :global(.neo-list) {
        max-width: 18.875rem;
        max-height: calc(min(80vh, 24rem) - var(--neo-gap-lg) - 2rem);
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: flex-start;
    min-width: 80vw;
    margin: 2rem 0;
  }

  @media (width < 1550px) {
    .column {
      flex: 0 1 30%;
    }
  }

  @media (width < 600px) {
    .column {
      flex: 0 1 80%;
    }
  }
</style>
