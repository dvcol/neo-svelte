<script lang="ts">
  import type { NeoListItem, NeoListRowContext, NeoListSelectedItem } from '~/list/neo-list.model.js';
  import type { NeoTabRowItem } from '~/nav/neo-tabs-row.model.js';
  import type { NeoSortableContextItems, NeoSortableItem as NeoSortableItemData } from '~/sortable/neo-sortable-context.svelte.js';

  import { emptyTransition } from '@dvcol/svelte-utils/transition';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoHandle from '~/floating/common/NeoHandle.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import { isSection } from '~/list/neo-list.model.js';
  import NeoList from '~/list/NeoList.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoDroppableZone from '~/sortable/NeoDroppableZone.svelte';
  import NeoSortableItem from '~/sortable/NeoSortableItem.svelte';
  import NeoSortableProvider from '~/sortable/NeoSortableProvider.svelte';
  import { attachToParent } from '~/utils/attach.utils.js';
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

  // ========================================================================
  // NeoList + Sortable showcase
  // ========================================================================

  type RichSortItem = NeoSortableItemData<NeoListItem>;

  const richSeeds: { label: string; description: string }[] = [
    { label: 'Draft project proposal', description: 'Outline objectives, scope, and key deliverables' },
    { label: 'Review with stakeholders', description: 'Schedule a meeting to gather feedback' },
    { label: 'Implement core features', description: 'Build main functionality based on approved specs' },
    { label: 'Write integration tests', description: 'Ensure components work correctly in all scenarios' },
    { label: 'Deploy to staging', description: 'Push changes to staging environment for QA review' },
  ];

  function makeRichItems(seeds: { label: string; description: string }[], prefix: string): RichSortItem[] {
    return seeds.map((s, i) => ({
      id: `${prefix}-${i + 1}`,
      data: { label: s.label, description: s.description, value: s.label, id: `${prefix}-${i + 1}` },
    }));
  }

  // --- 1. Flat sortable list ---
  const flatSortSeed = makeRichItems(richSeeds, 'fl');
  let flatSortItems = $state<RichSortItem[]>(flatSortSeed.map(i => ({ ...i })));
  const flatSortSnapshot = flatSortSeed.map(i => ({ ...i }));
  let flatSortContainer = $state<HTMLElement>();

  // --- 2. Sortable + selectable ---
  const selectSortSeed = makeRichItems(richSeeds, 'sel');
  let selectSortItems = $state<RichSortItem[]>(selectSortSeed.map(i => ({ ...i })));
  const selectSortSnapshot = selectSortSeed.map(i => ({ ...i }));
  let selectSortContainer = $state<HTMLElement>();
  let selectSortSelected = $state<NeoListSelectedItem | undefined>();

  // --- 3. Sortable sections ---
  interface SectionSeed {
    label: string;
    subtitle: string;
    items: { label: string; description: string }[];
  }
  const sectionSeeds: SectionSeed[] = [
    { label: 'Planning', subtitle: 'Phase 1', items: [
      { label: 'Define requirements', description: 'Gather and document all requirements' },
      { label: 'Create timeline', description: 'Build project schedule with milestones' },
    ] },
    { label: 'Development', subtitle: 'Phase 2', items: [
      { label: 'Setup environment', description: 'Configure dev and CI pipelines' },
      { label: 'Build API', description: 'Implement REST endpoints' },
      { label: 'Build UI', description: 'Implement frontend components' },
    ] },
    { label: 'Launch', subtitle: 'Phase 3', items: [
      { label: 'QA review', description: 'Run full regression suite' },
      { label: 'Production deploy', description: 'Push to production' },
    ] },
  ];

  function makeSectionItems(seeds: SectionSeed[], prefix: string): RichSortItem[] {
    return seeds.map((sec, si) => {
      const secId = `${prefix}-${si + 1}`;
      return {
        id: secId,
        data: {
          id: secId,
          label: sec.label,
          subtitle: sec.subtitle,
          divider: true,
          items: sec.items.map((item, ii) => ({
            label: item.label,
            description: item.description,
            value: item.label,
            id: `${secId}-item-${ii + 1}`,
          })),
        },
      };
    });
  }

  const sectionSortSeed = makeSectionItems(sectionSeeds, 'sec');
  let sectionSortItems = $state<RichSortItem[]>(sectionSortSeed.map(i => ({ ...i })));
  const sectionSortSnapshot = sectionSortSeed.map(i => ({ ...i }));
  let sectionSortContainer = $state<HTMLElement>();

  // --- 4. Multi-list ---
  const multiBacklogSeed = makeRichItems([
    { label: 'Research competitors', description: 'Analyze market landscape for positioning' },
    { label: 'Design mockups', description: 'Create wireframes for new feature' },
    { label: 'Write technical spec', description: 'Document architecture decisions' },
    { label: 'Setup monitoring', description: 'Configure alerting and dashboards' },
  ], 'bl');

  const multiProgressSeed = makeRichItems([
    { label: 'Sprint planning', description: 'Organize backlog for next sprint' },
    { label: 'Code review', description: 'Review pending pull requests' },
    { label: 'Update documentation', description: 'Keep README and API docs current' },
    { label: 'Refactor auth module', description: 'Improve security and performance' },
  ], 'pr');

  type MultiRecord = Record<string, RichSortItem[]>;
  let multiSortItems = $state<MultiRecord>({
    backlog: multiBacklogSeed.map(i => ({ ...i })),
    progress: multiProgressSeed.map(i => ({ ...i })),
  });
  const multiSortSnapshot: MultiRecord = {
    backlog: multiBacklogSeed.map(i => ({ ...i })),
    progress: multiProgressSeed.map(i => ({ ...i })),
  };
  let multiSortContainer = $state<HTMLElement>();

  const sortableId = (item: NeoListRowContext['item'], index: number) =>
    typeof item.id === 'string' || typeof item.id === 'number' ? item.id : index;
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

<div class="neo-list-sortable-showcase">
  <h1>NeoList + Sortable (Custom Snippets)</h1>

  {#snippet sortableRow({ item, index, content }: NeoListRowContext)}
    <NeoSortableItem id={sortableId(item, index)} {index} data={item} disabled={item.disabled}>
      {#snippet children({ instance })}
        <div {...attachToParent(instance.attach)} class="sortable-row-inner" data-grabbed={instance.isDragging}>
          <NeoHandle placement="left" active={instance.isDragging} {@attach instance.attachHandle} />
          {@render content()}
        </div>
      {/snippet}
    </NeoSortableItem>
  {/snippet}

  {#snippet sortableSectionRow({ item, index, content }: NeoListRowContext)}
    {#if isSection(item)}
      <NeoSortableItem id={sortableId(item, index)} {index} data={item} disabled={item.disabled}>
        {#snippet children({ instance })}
          <div {...attachToParent(instance.attach)} class="section-sortable-block" data-grabbed={instance.isDragging}>
            <NeoHandle placement="left" active={instance.isDragging} {@attach instance.attachHandle} />
            {@render content()}
          </div>
        {/snippet}
      </NeoSortableItem>
    {:else}
      {@render content()}
    {/if}
  {/snippet}

  <div class="showcase-grid">
    <!-- 1. Flat sortable list -->
    <div class="showcase-col">
      <div class="showcase-header">
        <span class="showcase-title">Flat sortable list</span>
        <NeoButton
          text rounded size="sm" onclick={() => {
            flatSortItems = flatSortSnapshot.map(i => ({ ...i }));
          }}
        >Reset</NeoButton>
      </div>
      <p class="showcase-hint">Drag using the handle on the left.</p>
      <div class="showcase-list" bind:this={flatSortContainer}>
        <NeoSortableProvider bind:items={flatSortItems} axis="y" container={flatSortContainer}>
          {#snippet children(ctx)}
            <NeoList row={sortableRow} items={(ctx.items as RichSortItem[]).map(i => i.data)} height="18rem" />
          {/snippet}
        </NeoSortableProvider>
      </div>
    </div>

    <!-- 2. Sortable + selectable -->
    <div class="showcase-col">
      <div class="showcase-header">
        <span class="showcase-title">Sortable + selectable</span>
        <NeoButton
          text rounded size="sm" onclick={() => {
            selectSortItems = selectSortSnapshot.map(i => ({ ...i }));
            selectSortSelected = undefined;
          }}
        >Reset</NeoButton>
      </div>
      <p class="showcase-hint">Click row to select, drag handle to reorder.</p>
      <div class="showcase-list" bind:this={selectSortContainer}>
        <NeoSortableProvider bind:items={selectSortItems} axis="y" container={selectSortContainer}>
          {#snippet children(ctx)}
            <NeoList row={sortableRow} select nullable bind:selected={selectSortSelected} items={(ctx.items as RichSortItem[]).map(i => i.data)} height="18rem" />
          {/snippet}
        </NeoSortableProvider>
      </div>
      <p class="showcase-selected">Selected: {selectSortSelected?.item?.label ?? selectSortSelected?.item?.id ?? 'none'}</p>
    </div>

    <!-- 3. Sortable sections -->
    <div class="showcase-col">
      <div class="showcase-header">
        <span class="showcase-title">Sortable sections</span>
        <NeoButton
          text rounded size="sm" onclick={() => {
            sectionSortItems = sectionSortSnapshot.map(i => ({ ...i }));
          }}
        >Reset</NeoButton>
      </div>
      <p class="showcase-hint">Drag section header to reorder entire blocks.</p>
      <div class="showcase-list" bind:this={sectionSortContainer}>
        <NeoSortableProvider bind:items={sectionSortItems} axis="y" container={sectionSortContainer}>
          {#snippet children(ctx)}
            <NeoList row={sortableSectionRow} items={(ctx.items as RichSortItem[]).map(i => i.data)} height="18rem">
              {#snippet section(listRender, { index, section, context })}
                {#if section}
                  <div class="section-sortable-content">
                    <div class="section-sortable-meta">
                      <span class="section-sortable-label">{section.label}</span>
                      <span class="section-sortable-subtitle">{(section as any).subtitle} — {section.items.length} items</span>
                    </div>
                    <ul class="section-sortable-items">
                      {@render listRender({ items: section.items, index, section, context })}
                    </ul>
                  </div>
                {/if}
              {/snippet}
            </NeoList>
          {/snippet}
        </NeoSortableProvider>
      </div>
    </div>

    <!-- 4. Multi-list -->
    <div class="showcase-col">
      <div class="showcase-header">
        <span class="showcase-title">Multi-list cross drag</span>
        <NeoButton
          text rounded size="sm" onclick={() => {
            multiSortItems = {
              backlog: multiSortSnapshot.backlog.map(i => ({ ...i })),
              progress: multiSortSnapshot.progress.map(i => ({ ...i })),
            };
          }}
        >Reset</NeoButton>
      </div>
      <p class="showcase-hint">Drag items within or between lists.</p>
      <div class="showcase-multi-list" bind:this={multiSortContainer}>
        <NeoSortableProvider bind:items={multiSortItems} container={multiSortContainer}>
          {#snippet children(ctx)}
            {#each Object.entries(ctx.items as MultiRecord) as [colId, colItems] (colId)}
              <div class="showcase-multi-col">
                <span class="showcase-col-label">{colId === 'backlog' ? 'Backlog' : 'In Progress'}</span>
                {#snippet row({ item, index, content }: NeoListRowContext)}
                  <NeoSortableItem id={sortableId(item, index)} {index} group={colId} data={item} disabled={item.disabled}>
                    {#snippet children({ instance })}
                      <div {...attachToParent(instance.attach)} class="sortable-row-inner" data-grabbed={instance.isDragging}>
                        <NeoHandle placement="left" active={instance.isDragging} {@attach instance.attachHandle} />
                        {@render content()}
                      </div>
                    {/snippet}
                  </NeoSortableItem>
                {/snippet}
                <!-- Keep dnd-kit's retained source row out of NeoList's transition lifecycle during cross-list moves. -->
                <NeoList
                  {row}
                  items={colItems.map(i => i.data)}
                  height="18rem"
                  in={ctx.isDragging ? emptyTransition : undefined}
                  out={ctx.isDragging ? emptyTransition : undefined}
                />
                <NeoDroppableZone {colId}>
                  {#snippet children(zone)}
                    {#if !colItems.length}
                      <div class="drop-zone" {@attach zone.attach}>Drop here</div>
                    {/if}
                  {/snippet}
                </NeoDroppableZone>
              </div>
            {/each}
          {/snippet}
        </NeoSortableProvider>
      </div>
    </div>
  </div>
</div>

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

  /* ---- NeoList + Sortable showcase ---- */
  .neo-list-sortable-showcase {
    width: 100%;
    max-width: 80vw;
    margin: 2rem auto;

    h1 {
      margin-block-end: 1.5rem;
      font-size: var(--neo-font-size-lg);
      text-align: center;
    }
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (width < 900px) {
      grid-template-columns: 1fr;
    }
  }

  .showcase-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .showcase-header {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
  }

  .showcase-title {
    font-weight: var(--neo-font-weight-md, 500);
    font-size: var(--neo-font-size-md);
  }

  .showcase-hint {
    margin: 0;
    color: var(--neo-text-color-secondary);
    font-size: var(--neo-font-size-sm);
  }

  .showcase-selected {
    margin: 0.25rem 0 0;
    color: var(--neo-text-color-secondary);
    font-size: var(--neo-font-size-sm);
  }

  .showcase-list {
    min-height: 18rem;
    max-height: 18rem;
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);

    :global(.neo-list) {
      max-height: 18rem;
    }
  }

  .showcase-multi-list {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    min-height: 18rem;
    max-height: 18rem;
    padding: 0.5rem;
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);

    @media (width < 900px) {
      flex-direction: column;
      max-height: none;
    }
  }

  .showcase-multi-col {
    position: relative;
    display: flex;
    flex: 1 1 50%;
    flex-direction: column;
    gap: 0.25rem;
    align-items: stretch;
    min-width: 0;

    :global(.neo-list) {
      max-height: 18rem;
    }
  }

  .showcase-col-label {
    font-weight: var(--neo-font-weight-sm, 400);
    font-size: var(--neo-font-size-sm);
    text-align: center;
  }

  .sortable-row-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    transition: opacity 0.2s ease;

    &[data-grabbed='true'] {
      opacity: 0.3;
    }

    :global(> .neo-handle-group) {
      flex: 0 0 auto;
      width: 1.5rem;
    }
  }

  .section-sortable-block {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    transition: opacity 0.2s ease;

    &[data-grabbed='true'] {
      opacity: 0.3;
    }

    :global(> .neo-handle-group) {
      flex: 0 0 auto;
      width: 1.5rem;
    }
  }

  .section-sortable-content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .section-sortable-meta {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.375rem 0.5rem;
    background: var(--neo-surface-color, var(--neo-background-color));
    border-block-end: 1px solid var(--neo-border-color);
  }

  .section-sortable-label {
    font-weight: var(--neo-font-weight-md, 500);
    font-size: var(--neo-font-size-sm);
  }

  .section-sortable-subtitle {
    color: var(--neo-text-color-secondary);
    font-size: var(--neo-font-size-xs);
  }

  .section-sortable-items {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .drop-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 2.5rem;
    margin-block-start: 0.25rem;
    color: var(--neo-text-color-disabled);
    font-size: var(--neo-font-size-sm);
    border: 2px dashed var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }
</style>
