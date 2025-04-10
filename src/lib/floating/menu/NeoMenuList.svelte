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

    // Styles
    shadow,
    scrollbar,
    rounded,

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

<svelte:element
  this={tag}
  role="listbox"
  bind:this={ref}
  class:neo-menu-list={true}
  class:neo-scroll={scrollbar}
  class:neo-shadow={shadow}
  class:neo-rounded={rounded}
  {...rest}
>
  {#each items as item, index (item.id ?? index)}
    {#if index && showDivider(item.divider, 'top') && !showDivider(items[index - 1]?.divider, 'top')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
    <NeoMenuListItem
      {keepOpenOnSelect}
      {rounded}
      {...itemProps}
      {parent}
      {item}
      {index}
      length={items.length}
      {tooltipProps}
      {baseProps}
      menuProps={{ tag, shadow, scrollbar, rounded, dividerProps, tooltipProps, baseProps, ...rest, ...item.menuProps }}
      onMenu={(i, e) => {
        item.menuProps?.onMenu?.(i, e);
        onMenu?.(i, e);
      }}
      onSelect={(i, e) => {
        item.menuProps?.onSelect?.(i, e);
        onSelect?.(i, e);
      }}
    />
    {#if index < items.length - 1 && showDivider(item.divider, 'bottom') && !showDivider(items[index + 1]?.divider, 'bottom')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
  {/each}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-menu-list {
    display: flex;
    flex-direction: column;
    padding: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem)) 0;
    overflow: auto;

    :global(.neo-menu-item-divider) {
      margin: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem)) 0;
    }

    &.neo-scroll,
    &.neo-rounded {
      padding-block: var(--neo-menu-scroll-padding, 0.625rem);

      &:not(.neo-scroll) :global(> .neo-menu-item) {
        padding: 0 var(--neo-menu-padding, var(--neo-gap-xxs, 0.5rem));
      }
    }

    &.neo-scroll {
      &.neo-shadow {
        @include mixin.fade-scroll(1rem);
      }

      @include mixin.scrollbar($button-height: var(--neo-menu-scrollbar-padding, 0.5rem));
    }
  }
</style>
