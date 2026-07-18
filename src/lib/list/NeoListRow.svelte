<script lang="ts">
  import type { NeoListRowProps } from '~/list/neo-list-row.model.js';

  import { isSection } from '~/list/neo-list.model.js';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListBaseSection from '~/list/NeoListBaseSection.svelte';

  const {
    // Snippets
    row,
    itemRender: customItem,
    sectionRender: customSection,
    list,

    // Context
    item,
    index,
    checked,
    context,
    section,
    sectionIndex,

    // States
    select,
    highlight,
    reverse,
    flip,
    disabled,
    readonly,

    // Styles
    rounded,

    // Events
    ontoggle,

    // Other props
    buttonProps,
    itemProps,
    sectionProps,
  }: NeoListRowProps = $props();

  const onClick = $derived.by(() => {
    if (!select || isSection(item)) return undefined;
    return () => ontoggle?.({ index, item, sectionIndex, section }, checked);
  });
</script>

{#snippet content()}
  {#if isSection(item)}
    {@const sectionContext = { items: item.items, section: item, index, context }}
    {#if customSection && !item.render}
      {@render customSection(list, sectionContext)}
    {:else}
      <NeoListBaseSection
        section={item}
        {index}
        {context}
        {select}
        {list}
        {reverse}
        {flip}
        {...sectionProps}
      />
    {/if}
  {:else if customItem && !item.render}
    {@render customItem({ item, index, checked, context })}
  {:else}
    <NeoListBaseItem
      {item}
      {index}
      {context}
      {checked}
      {select}
      {highlight}
      {buttonProps}
      {reverse}
      {rounded}
      {flip}
      {disabled}
      {readonly}
      {...itemProps}
      onclick={onClick}
    />
  {/if}
{/snippet}

{#if row}
  {@render row({ item, index, checked, context, section, sectionIndex, content })}
{:else}
  {@render content()}
{/if}
