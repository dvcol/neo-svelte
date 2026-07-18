<script lang="ts">
  import type { NeoListContext, NeoListItemOrSection } from '~/list/neo-list.model.js';

  import NeoListRow from '~/list/NeoListRow.svelte';

  const {
    item,
    index = 0,
    checked,
    context = {} as NeoListContext,
    sectionIndex,
    select,
    customItem = false,
    customSection = false,
    wrap = false,
    ontoggle,
  }: {
    item: NeoListItemOrSection;
    index?: number;
    checked?: boolean;
    context?: NeoListContext;
    sectionIndex?: number;
    select?: boolean;
    customItem?: boolean;
    customSection?: boolean;
    wrap?: boolean;
    ontoggle?: (item: unknown, clear?: boolean) => void;
  } = $props();
</script>

{#snippet list({ items })}
  <ul data-testid="nested-list">
    {#each items as nested, nestedIndex (nested.id ?? nestedIndex)}
      <li data-nested-id={nested.id}>{nested.label}</li>
    {/each}
  </ul>
{/snippet}

{#snippet itemRender({ item: rendered, index: renderedIndex, checked: renderedChecked })}
  <output data-testid="custom-item" data-index={renderedIndex} data-checked={renderedChecked}>{rendered.label}</output>
{/snippet}

{#snippet sectionRender(renderList, { section: rendered, index: renderedIndex })}
  <section data-testid="custom-section" data-index={renderedIndex}>
    <h2>{rendered?.label}</h2>
    {@render renderList({ items: rendered?.items ?? [], section: rendered, index: renderedIndex })}
  </section>
{/snippet}

{#snippet rowRender({ item: rendered, sectionIndex: renderedSectionIndex, content })}
  <div data-testid="custom-row" data-id={rendered.id} data-section-index={renderedSectionIndex}>
    {@render content()}
  </div>
{/snippet}

<NeoListRow
  {item}
  {index}
  {checked}
  {context}
  {sectionIndex}
  {select}
  {list}
  itemRender={customItem ? itemRender : undefined}
  sectionRender={customSection ? sectionRender : undefined}
  row={wrap ? rowRender : undefined}
  {ontoggle}
/>
