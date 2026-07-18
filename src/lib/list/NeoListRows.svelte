<script lang="ts">
  import type { NeoListRowsProps, NeoListVisibleItem } from '~/list/neo-list-rows.model.js';
  import type { NeoListItemOrSection, NeoListRenderContext, NeoListSection } from '~/list/neo-list.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoIconList from '~/icons/NeoIconList.svelte';
  import { isSection, showDivider } from '~/list/neo-list.model.js';
  import NeoListRow from '~/list/NeoListRow.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';

  const {
    // Snippets
    itemRender,
    row,
    sectionRender,
    emptyRender,

    // Context
    items,
    visible: flatVisible,
    context,

    // States
    sections,
    loading,
    select,
    highlight,
    reverse,
    flip,
    disabled,
    readonly,
    nullable,
    divider,

    // Styles
    rounded,

    // Animation
    animateFn,
    animateProps,
    inFn,
    inProps,
    outFn,
    outProps,
    skipOffscreen,

    // Events
    ontoggle,

    // Attachments
    observe,

    // Methods
    isChecked,
    filter,
    sort,

    // Other props
    buttonProps,
    dividerProps,
    itemProps,
    sectionProps,
  }: NeoListRowsProps = $props();

  const inlineVisible = (array: NeoListItemOrSection[] = []): NeoListVisibleItem[] => array
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter(item))
    .sort((a, b) => sort(a.item, b.item));

  const renderDivider = (index: number, array: NeoListVisibleItem[], position: 'top' | 'bottom') => {
    if (position === 'top') return index && (showDivider(array[index]?.item.divider, 'top') ?? showDivider(divider, 'top'));
    if (index >= array.length - 1) return false;
    return showDivider(array[index].item.divider, 'bottom') && !showDivider(array[index + 1]?.item.divider, 'top');
  };
</script>

{#snippet emptyItem(itemEmpty: NeoListSection['empty'] | typeof emptyRender = emptyRender)}
  {#if itemEmpty}
    {@render itemEmpty(context)}
  {:else}
    <div class="neo-list-empty-content">
      <NeoIconList size="3rem" stroke="1" />
      <div>No items</div>
    </div>
  {/if}
{/snippet}

{#snippet list({ items: array, section, index: sectionIndex }: NeoListRenderContext)}
  {@const visible = section || sections ? inlineVisible(array) : flatVisible}
  {#if !visible.length && !loading}
    {@render emptyItem(section?.empty)}
  {:else}
    {#each visible as { item, index }, position (item.id ?? index)}
      {@const checked = !isSection(item) && isChecked({ index, item, sectionIndex, section })}
      <svelte:element
        this={item.tag ?? 'li'}
        role={select ? 'option' : 'listitem'}
        data-id={item.id}
        data-index={index}
        data-section={sectionIndex}
        aria-selected={checked}
        aria-posinset={position + 1}
        aria-setsize={visible.length}
        class:neo-list-item={true}
        class:neo-checked={checked}
        class:neo-list-item-select={select}
        style:--neo-list-item-color={getColorVariable(item.color)}
        {...item.containerProps}
        animate:animateFn={{ ...animateProps, skip: section ? true : skipOffscreen }}
        in:inFn={inProps}
        out:outFn={outProps}
        {@attach observe}
      >
        {#if renderDivider(position, visible, flip ? 'bottom' : 'top')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
        <NeoListRow
          {row}
          {itemRender}
          {sectionRender}
          {list}
          {item}
          {index}
          {checked}
          {context}
          {section}
          {sectionIndex}
          {select}
          {highlight}
          {buttonProps}
          {reverse}
          {rounded}
          {flip}
          disabled={item.disabled || disabled || section?.disabled}
          readonly={item.readonly || readonly || section?.readonly || (!nullable && checked)}
          {itemProps}
          {sectionProps}
          {ontoggle}
        />
        {#if renderDivider(position, visible, flip ? 'top' : 'bottom')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
      </svelte:element>
    {/each}
  {/if}
{/snippet}

{@render list({ items, context })}

<style lang="scss">
  @use 'src/lib/styles/layers' as layers;

  @include layers.neo-components {
    .neo-list-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
      transition: opacity 0.2s linear;
      transition-delay: 0s;

      :global(> .neo-list-item-button) {
        width: 100%;
      }

      :global(> .neo-list-item-divider) {
        color: var(--neo-list-divider-color, var(--neo-text-color));
        margin-block: 0.5rem;
      }

      &:hover,
      &:focus,
      &:focus-within {
        :global(> .neo-list-section-title),
        :global(> .neo-list-item-button .neo-list-item-content) {
          color: var(--neo-text-color-highlight);
        }

        :global(> .neo-list-item-button .neo-list-item-description),
        :global(> .neo-list-item-button .neo-list-item-tags) {
          color: var(--neo-text-color-secondary-highlight);
        }
      }
    }
  }
</style>
