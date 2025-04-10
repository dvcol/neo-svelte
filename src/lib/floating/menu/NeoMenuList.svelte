<script lang="ts">
  import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';

  import NeoMenuListItem from '~/floating/menu/NeoMenuListItem.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    ref = $bindable(),

    // Item Props
    tag = 'ul',
    item: parent,
    items = [],

    keepOpen,

    // Events
    onMenu,
    onSelect,

    // Other Props
    tooltipProps,
    baseProps,
    itemProps,
    ...rest
  }: NeoMenuListProps = $props();
  /* eslint-enable prefer-const */

  // TODO: Section
  // TODO: divider
</script>

<svelte:element this={tag} role="listbox" bind:this={ref} class:neo-menu-list={true} {...rest}>
  {#each items as item, index (item.id ?? index)}
    <NeoMenuListItem {parent} {item} {index} {keepOpen} {onMenu} {onSelect} {tooltipProps} {baseProps} {...itemProps} />
  {/each}
</svelte:element>

<style lang="scss">
  .neo-menu-list {
    display: flex;
    flex-direction: column;
    padding: 0.375rem;
    overflow: auto;
  }
</style>
