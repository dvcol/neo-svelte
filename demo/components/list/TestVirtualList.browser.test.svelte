<script lang="ts" generics="T extends { id: number }">
  import type { NeoVirtualListMethods, NeoVirtualListProps } from '~/list/neo-virtual-list.model.js';

  import NeoVirtualList from '~/list/NeoVirtualList.svelte';

  type Props = {
    items: T[];
    itemHeight?: NeoVirtualListProps<T>['itemHeight'];
    estimatedItemHeight?: number;
    buffer?: number;
    methods?: NeoVirtualListMethods | undefined;
    scrolling?: boolean;
  };

  let {
    items,
    itemHeight,
    estimatedItemHeight,
    buffer,
    methods = $bindable(),
    scrolling = $bindable(false),
  }: Props = $props();
</script>

{#snippet row({ item, index }: { item: T; index: number }, _ctx: unknown, register: (el: Element) => void | (() => void))}
  <li class="row" data-id={item.id} data-index={index} {@attach register}>row {item.id}</li>
{/snippet}

<div class="frame" data-testid="frame">
  <NeoVirtualList
    bind:this={methods}
    bind:scrolling
    class="vlist"
    {items}
    {itemHeight}
    {estimatedItemHeight}
    {buffer}
    children={row}
  />
</div>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .frame {
    width: 320px;
    height: 240px;
    overflow: hidden;
  }

  :global(.vlist) {
    height: 100%;
  }

  :global(.row) {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 8px;
    list-style: none;
    border-bottom: 1px solid #ddd;
  }
</style>
