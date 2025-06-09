<script lang="ts" generics="T">
  import type { NeoVirtualContext, NeoVirtualItem, NeoVirtualListProps } from '~/list/neo-virtual-list.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { watch } from '@dvcol/svelte-utils/watch';
  import { onDestroy, onMount, tick } from 'svelte';

  import { defaultVirtualKey } from '~/list/neo-virtual-list.model.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';

  let {
    // Snippet
    children,
    before,
    after,

    // State
    ref: viewport = $bindable(),
    tag = 'ul',
    items = [],
    key = defaultVirtualKey,
    itemHeight,
    buffer = 3,

    // Style
    dim,
    shadow = true,
    scrollbar = true,

    // Events
    onscroll,

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

  // Height of the list viewport
  let viewportHeight = $state(0);

  // Rendered items
  const cursor = $state({
    start: 0,
    end: 0,
  });

  // Rows wrapper
  const content = $state<{
    ref?: HTMLElement;
    before?: number;
    after?: number;
    top: number;
    bottom: number;
  }>({
    ref: undefined,
    before: undefined,
    after: undefined,
    top: 0,
    bottom: 0,
  });

  // Rows items
  const rows = $state<{ refs: HTMLCollectionOf<HTMLElement>; heights: number[] }>({
    refs: [] as unknown as HTMLCollectionOf<HTMLElement>,
    heights: [],
  });

  const visible: Array<NeoVirtualItem<T>> = $derived(
    items.slice(cursor.start, cursor.end).map((item, index) => {
      return { id: key?.(item) ?? index + cursor.start, index, item };
    }),
  );

  const getTotalHeight = () => {
    let total = rows.heights.reduce((x, y) => x + y, 0);
    if (!viewport) return total;
    const style = getComputedStyle(viewport);
    total += Number.parseInt(style.paddingBlockEnd, 10);
    total += Number.parseInt(style.paddingBlockStart, 10);
    // add before and after height
    total += Math.max(content.before ?? 0, 0);
    total += Math.max(content.after ?? 0, 0);
    return total;
  };

  const getAverageHeight = () => {
    if (!cursor.end) return 0;
    // Calculate averageHeight based on all known heights, not just rendered
    const heights = rows.heights.filter(Boolean);
    return (heights.reduce((x, y) => x + y, 0) / heights.length) || itemHeight || 1;
  };

  async function computeCursor(scrollTop: number) {
    let contentHeight = content.top - scrollTop;
    let i = cursor.start;

    const averageHeight = getAverageHeight();
    while (contentHeight < viewportHeight && i < items.length) {
      let row = rows.refs[i - cursor.start];
      if (!row) {
        cursor.end = i + 1;
        await tick(); // render the newly visible row
        row = rows.refs[i - cursor.start];
      }
      contentHeight += (rows.heights[i] = row?.offsetHeight || averageHeight);
      i += 1;
    }

    cursor.end = Math.min(items.length, i + buffer); // Add buffer to the end
  }

  function computeBottomPadding() {
    const averageHeight = getAverageHeight();
    // Calculate bottom padding based on the remaining items
    const remaining = items.length - cursor.end;
    content.bottom = remaining * averageHeight;

    // Ensure heights array is long enough
    rows.heights.length = items.length;

    // Fill remaining heights with averageHeight
    for (let k = cursor.end; k < items.length; k++) {
      if (rows.heights[k] === undefined) rows.heights[k] = averageHeight;
    }
  }

  function ensureViewport() {
    if (!viewport) return;
    const { scrollTop } = viewport;
    const totalHeight = getTotalHeight();
    // If we scroll outside the viewport scroll to the top to prevent extra space at the bottom.
    if ((scrollTop + viewportHeight > totalHeight) && viewport) {
      viewport?.scrollTo(0, Math.max(0, totalHeight - viewportHeight));
    }
  }

  const rowObserver: ResizeObserver = new ResizeObserver(refresh);
  export async function refresh() {
    // wait until the DOM is up to date
    await tick();

    if (!viewport) return;
    const { scrollTop } = viewport;

    await computeCursor(scrollTop);
    computeBottomPadding();
    ensureViewport();

    for (const row of rows.refs) rowObserver?.observe(row);
  }

  function handleResize() {
    if (!viewport) return;
    const { scrollTop } = viewport;

    for (let v = 0; v < rows.refs.length; v += 1) {
      const itemIndex = cursor.start + v;
      if (itemIndex >= items.length) continue;
      rows.heights[itemIndex] = itemHeight || (rows.refs[v]).offsetHeight;
    }

    let i = 0;
    let y = 0;

    const averageHeight = getAverageHeight();
    // Fill top padding until the first item is visible
    while (i < items.length) {
      // Ensure rowHeight is not 0
      const rowHeight = rows.heights[i] || averageHeight;
      // Stop if the current item's bottom edge is past the scrollTop minus buffer considerations
      if (y + rowHeight > scrollTop) break;
      y += rowHeight;
      i += 1;
    }

    cursor.start = Math.max(0, i - buffer);

    // Re-compute the top padding including buffer
    content.top = 0;
    for (let k = 0; k < cursor.start; k++) content.top += rows.heights[k] || averageHeight;

    // Fill until we reach the bottom of the viewport
    while (i < items.length) {
      y += rows.heights[i] || averageHeight;
      i += 1;
      if (y > scrollTop + viewportHeight) break;
    }
    cursor.end = Math.min(items.length, i + buffer);

    // Fill unknown heights with the new average
    for (let k = 0; k < items.length; k++) if (!rows.heights[k]) rows.heights[k] = averageHeight;

    // Calculate bottom padding including buffer
    content.bottom = 0;
    for (let k = cursor.end; k < items.length; k++) content.bottom += rows.heights[k] || averageHeight;

    ensureViewport();
  }

  export function handleScroll(e: SvelteEvent<UIEvent>) {
    if (!viewport) return onscroll?.(e);
    handleResize();
    return onscroll?.(e);
  }

  // whenever `items` changes, invalidate the current heightmap
  $effect(() => {
    void refresh();
  });

  watch(handleResize, () => items.length, { skip: 1 });

  // trigger initial refresh
  onMount(() => {
    if (!content.ref) return;
    rows.refs = content.ref.children as HTMLCollectionOf<HTMLElement>;
  });

  onDestroy(() => {
    rowObserver?.disconnect();
  });

  const context = $derived<NeoVirtualContext<T>>({
    items,
    visible,
    start: cursor.start,
    end: cursor.end,
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
  bind:this={viewport}
  bind:offsetHeight={viewportHeight}
  {...rest}
  onscroll={handleScroll}
  in:inFn={inProps}
  out:outFn={outProps}
>
  <svelte:element
    this={contentTag}
    class:neo-virtual-list-contents={true}
    class:neo-dim={dim}
    bind:this={content.ref}
    style:padding-top="{content.top}px"
    style:padding-bottom="{content.bottom}px"
    {...contentRest}
  >
    {#if before && cursor.start === 0}
      <svelte:element
        this={beforeTag}
        bind:offsetHeight={content.before}
        class:neo-virtual-list-before={true}
        role="none"
        {...beforeRest}
      >
        {@render before(context)}
      </svelte:element>
    {/if}
    {#each visible as { id, index, item } (id)}
      {@render children?.({ id, index, item }, context)}
    {/each}

    {#if after && cursor.end === items.length}
      <svelte:element
        this={afterTag}
        bind:offsetHeight={content.after}
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
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-inline: var(--neo-list-padding, 0.375rem);
    padding-block: var(--neo-list-padding, 0.375rem);

    &-contents {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;

      &.neo-dim {
        &:hover :global(> *:not(:hover, :has(*:focus-visible))),
        &:has(> * :global(*:focus-visible)) > *:not(:hover, :has(:global(*:focus-visible))) {
          opacity: 0.6;
          transition-timing-function: linear;
          transition-duration: 0.6s;
        }
      }
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
