<script lang="ts">
  import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';

  import NeoMenuListItem from '~/floating/menu/NeoMenuListItem.svelte';
  import { showDivider } from '~/list/neo-list.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    ref = $bindable(),

    // Item Props
    tag = 'ul',
    item: parent,
    items = [],

    keepOpenOnSelect,

    // Events
    onMenu,
    onSelect,

    // Other Props
    tooltipProps,
    baseProps,
    itemProps,
    dividerProps,
    ...rest
  }: NeoMenuListProps = $props();
  /* eslint-enable prefer-const */

  // TODO: Section
</script>

<svelte:element this={tag} role="listbox" bind:this={ref} class:neo-menu-list={true} {...rest}>
  {#each items as item, index (item.id ?? index)}
    {#if index && showDivider(item.divider, 'top') && !showDivider(items[index - 1]?.divider, 'top')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
    <NeoMenuListItem
      {parent}
      {item}
      {index}
      length={items.length}
      {keepOpenOnSelect}
      {onMenu}
      {onSelect}
      {tooltipProps}
      {baseProps}
      {dividerProps}
      {...itemProps}
    />
    {#if index < items.length - 1 && showDivider(item.divider, 'bottom') && !showDivider(items[index + 1]?.divider, 'bottom')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
  {/each}
</svelte:element>

<style lang="scss">
  .neo-menu-list {
    display: flex;
    flex-direction: column;
    padding: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25)) 0;
    overflow: auto;

    :global(.neo-menu-item-divider) {
      margin: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25)) 0;
    }
  }
</style>
