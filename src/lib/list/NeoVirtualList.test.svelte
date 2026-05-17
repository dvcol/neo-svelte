<script lang="ts" generics="T extends { id: number | string }">
  import type { NeoVirtualListMethods, NeoVirtualListProps } from '~/list/neo-virtual-list.model.js';

  import NeoVirtualList from '~/list/NeoVirtualList.svelte';

  type Props = {
    items: T[];
    before?: boolean;
    after?: boolean;
    itemHeight?: NeoVirtualListProps<T>['itemHeight'];
    estimatedItemHeight?: number;
    buffer?: number;
    scrolling?: boolean;
    onScrollTop?: NeoVirtualListProps<T>['onScrollTop'];
    onScrollBottom?: NeoVirtualListProps<T>['onScrollBottom'];
    methods?: NeoVirtualListMethods | undefined;
  };

  let {
    items,
    before: showBefore = false,
    after: showAfter = false,
    itemHeight,
    estimatedItemHeight,
    buffer,
    scrolling = $bindable(false),
    onScrollTop,
    onScrollBottom,
    methods = $bindable(),
  }: Props = $props();
</script>

{#snippet rowSnippet({ item, index }: { item: T; index: number }, _ctx: unknown, register: (el: Element) => void | (() => void))}
  <li class="neo-virtual-row" data-id={item.id} data-index={index} {@attach register}>row {String(item.id)}</li>
{/snippet}

{#snippet beforeSnippet()}
  <span class="harness-before">before</span>
{/snippet}

{#snippet afterSnippet()}
  <span class="harness-after">after</span>
{/snippet}

<NeoVirtualList
  bind:this={methods}
  bind:scrolling
  {items}
  {itemHeight}
  {estimatedItemHeight}
  {buffer}
  {onScrollTop}
  {onScrollBottom}
  before={showBefore ? beforeSnippet : undefined}
  after={showAfter ? afterSnippet : undefined}
  children={rowSnippet}
/>
