<script lang="ts" generics="T">
  import type { NeoVirtualContext, NeoVirtualItem, NeoVirtualListProps } from '~/list/neo-virtual-list.model.js';

  import { untrack } from 'svelte';

  import { defaultVirtualKey } from '~/list/neo-virtual-list.model.js';
  import { useVirtualScroll } from '~/list/use-virtual-scroll.svelte.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  let {
    // Snippet
    children,
    before,
    after,

    // State
    ref: listEl = $bindable(),
    itemRefs = $bindable([]),
    tag = 'div',
    items = [],
    key: getKey = defaultVirtualKey,
    itemHeight,
    buffer = 3,

    // Style
    dim,
    shadow = true,
    scrollbar = true,

    // List Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other Props
    contentProps,
    beforeProps,
    afterProps,
    ...rest
  }: NeoVirtualListProps<T> = $props();

  const { tag: contentTag = 'div', ...contentRest } = $derived(contentProps ?? {});
  const { tag: beforeTag = 'div', ...beforeRest } = $derived(beforeProps ?? {});
  const { tag: afterTag = 'div', ...afterRest } = $derived(afterProps ?? {});

  // TODO before/after elemments
  // TODO expose scrollTo options
  // TODO pass more options to useVirtualScroll
  // TODO top/bottom padding for scroll shadow

  const virtualizer = useVirtualScroll({
    count: items.length,
    getItemKey: (index: number) => getKey(items[index], index),
    getScrollElement: () => listEl,
    estimateSize: () => itemHeight ?? 50, // Default item height if not provided
    overscan: Number(buffer),
  });

  (window as any).virtualizer = virtualizer; // For debugging purposes

  $effect(() => {
    console.info('==> Virtualizer initialized options changed');
    virtualizer.setOptions({
      count: items.length,
      getItemKey: (index: number) => getKey(items[index], index),
      estimateSize: () => itemHeight ?? 50, // Default item height if not provided
      overscan: Number(buffer),
    });
  });

  $effect(() => {
    if (!itemRefs?.length) return;
    itemRefs.forEach(ref => virtualizer.measureElement(ref));
  });

  const visible: Array<NeoVirtualItem<T>> = $derived(virtualizer.items.map(item => ({
    ...item,
    item: untrack(() => items[item.index]),
  })));

  const cursor = $derived(virtualizer.range);
  const contentHeight = $derived(virtualizer.size);

  const context = $derived<NeoVirtualContext<T>>({
    items,
    visible,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element
  this={tag}
  class:neo-virtual-list={true}
  class:neo-scroll={scrollbar}
  class:neo-shadow={shadow}
  bind:this={listEl}
  {...rest}
  in:inFn={inProps}
  out:outFn={outProps}
>
  <svelte:element
    this={contentTag}
    class:neo-virtual-list-contents={true}
    class:neo-dim={dim}
    style:height="{contentHeight}px"
    {...contentRest}
  >
    {#if before && cursor.start === 0}
      <svelte:element
        this={beforeTag}
        class:neo-virtual-list-before={true}
        role="none"
        {...beforeRest}
      >
        {@render before(context)}
      </svelte:element>
    {/if}
    <ul
      class="neo-virtual-list-viewport"
      style:transform="translateY({visible[0]?.start ?? 0}px)"
    >
      {#each visible as item, idx (item.key)}
        <li
          class="neo-virtual-list-item"
          bind:this={itemRefs[idx]}
          data-index={item.index}
          data-key={item.key}
          aria-posinset={item.index + 1}
          aria-setsize={items?.length}
        >
          {@render children?.(item, context)}
        </li>
      {/each}
    </ul>

    {#if after && cursor.end === items.length}
      <svelte:element
        this={afterTag}
        class:neo-virtual-list-after={true}
        role="none"
        {...afterRest}
      >
        {@render after(context)}
      </svelte:element>
    {/if}
  </svelte:element>
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-virtual-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    contain: strict;
    -webkit-overflow-scrolling: touch;
    padding-inline: var(--neo-list-padding, 0.375rem);
    padding-block: var(--neo-list-padding, 0.375rem);

    &-contents {
      position: relative;
      width: 100%;

      &.neo-dim {
        &:hover :global(> *:not(:hover, :has(*:focus-visible))),
        &:has(> * :global(*:focus-visible)) > *:not(:hover, :has(:global(*:focus-visible))) {
          opacity: 0.6;
          transition-timing-function: linear;
          transition-duration: 0.6s;
        }
      }
    }

    &-viewport {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    &-item {
      width: 100%;
    }

    &-before,
    &-after {
      display: flex;
      flex-direction: column;
    }

    &.neo-scroll {
      padding-block: var(--neo-list-scroll-padding, 0.625rem);

      &.neo-shadow {
        @include mixin.fade-scroll(1rem);
      }

      @include mixin.scrollbar($button-height: var(--neo-list-scrollbar-padding, 0.625rem));
    }
  }
</style>
