<script lang="ts" generics="T">
  import type { NeoVirtualContext, NeoVirtualItem, NeoVirtualListProps } from '~/list/neo-virtual-list.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { onMount, tick } from 'svelte';

  import { defaultVirtualKey } from '~/list/neo-virtual-list.model.js';

  const {
    // Snippet
    children,
    before,
    after,

    // State
    tag = 'ul',
    items = [],
    key = defaultVirtualKey,
    itemHeight,
    buffer = 3,

    // Events
    onscroll,

    // Other Props
    contentProps,
    ...rest
  }: NeoVirtualListProps<T> = $props();

  const { tag: contentTag = 'div', ...contentRest } = $derived(contentProps ?? {});

  // Rendered items
  const cursor = $state({
    start: 0,
    end: 0,
  });

  // Viewport container
  const viewport = $state<{ ref?: HTMLElement; height: number }>({
    ref: undefined,
    height: 0,
  });

  // Rows wrapper
  const content = $state<{ ref?: HTMLElement; top: number; bottom: number }>({
    ref: undefined,
    top: 0,
    bottom: 0,
  });

  // Rows items
  const rows = $state<{ refs: HTMLCollectionOf<HTMLElement>; heights: number[] }>({
    refs: [] as unknown as HTMLCollectionOf<HTMLElement>,
    heights: [],
  });

  const averageHeight = $derived.by<number>(() => {
    if (!cursor.end) return 0;
    // Calculate averageHeight based on all known heights, not just rendered
    const heights = rows.heights.filter(Boolean);
    return (heights.reduce((x, y) => x + y, 0) / heights.length) || itemHeight || 1;
  });

  const visible: Array<NeoVirtualItem<T>> = $derived(
    items.slice(cursor.start, cursor.end).map((item, index) => {
      return { id: key?.(item) ?? index + cursor.start, index, item };
    }),
  );

  async function computeCursor(scrollTop: number) {
    let contentHeight = content.top - scrollTop;
    let i = cursor.start;

    while (contentHeight < viewport.height && i < items.length) {
      let row = rows.refs[i - cursor.start];
      if (!row) {
        cursor.end = i + 1;
        await tick(); // render the newly visible row
        row = rows.refs[i - cursor.start];
      }
      contentHeight += (rows.heights[i] = itemHeight || row.offsetHeight);
      i += 1;
    }

    cursor.end = Math.min(items.length, i + buffer); // Add buffer to the end
  }

  function computeBottomPadding() {
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

  let resizeObserver: ResizeObserver;
  async function refresh() {
    // wait until the DOM is up to date
    await tick();

    if (!viewport.ref) return;
    const { scrollTop } = viewport.ref;

    await computeCursor(scrollTop);
    computeBottomPadding();

    const totalHeight = rows.heights.reduce((x, y) => x + y, 0);
    if (scrollTop + viewport.height > totalHeight && viewport.ref) {
      // If we scroll outside the viewport scroll to the top.
      viewport.ref.scrollTo(0, Math.max(0, totalHeight - viewport.height));
    }

    for (const row of rows.refs) resizeObserver?.observe(row);
  }

  async function handleScroll(e: SvelteEvent<UIEvent>) {
    if (!viewport.ref) return onscroll?.(e);

    const { scrollTop } = viewport.ref;
    const previous = cursor.start;

    for (let v = 0; v < rows.refs.length; v += 1) {
      const itemIndex = cursor.start + v;
      if (itemIndex >= items.length) continue;
      rows.heights[itemIndex] = itemHeight || (rows.refs[v]).offsetHeight;
    }

    let i = 0;
    let y = 0;

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
      if (y > scrollTop + viewport.height) break;
    }
    cursor.end = Math.min(items.length, i + buffer);

    // Fill unknown heights with the new average
    for (let k = 0; k < items.length; k++) if (!rows.heights[k]) rows.heights[k] = averageHeight;

    // Calculate bottom padding including buffer
    content.bottom = 0;
    for (let k = cursor.end; k < items.length; k++) content.bottom += rows.heights[k] || averageHeight;

    // prevent jumping if we scrolled up into unknown territory
    if (cursor.start < previous && viewport.ref) {
      await tick();
      let expectedHeight = 0;
      let actualHeight = 0;
      for (let k = cursor.start; k < previous; k += 1) {
        if (!rows.refs[k - cursor.start]) continue;
        expectedHeight += rows.heights[k] || averageHeight;
        actualHeight += itemHeight || (rows.refs[k - cursor.start]).offsetHeight;
      }
      const difference = actualHeight - expectedHeight;
      viewport.ref.scrollTo(0, scrollTop + difference);
    }

    const totalHeight = rows.heights.reduce((x, y) => x + y, 0);
    if (scrollTop + viewport.height > totalHeight && viewport.ref) {
      // If we scroll outside the viewport scroll to the top.
      viewport.ref?.scrollTo(0, Math.max(0, totalHeight - viewport.height));
    }
    return onscroll?.(e);
  }

  let mounted: boolean = $state(false);

  // whenever `items` changes, invalidate the current heightmap
  $effect(() => {
    if (!mounted) return;
    refresh();
  });

  // trigger initial refresh
  onMount(() => {
    if (!content.ref) return;
    rows.refs = content.ref.children as HTMLCollectionOf<HTMLElement>;
    resizeObserver = new ResizeObserver(() => refresh);
    mounted = true;
  });

  const context = $derived<NeoVirtualContext<T>>({
    items,
    visible,
    start: cursor.start,
    end: cursor.end,
  });
</script>

<svelte:element
  this={tag}
  class:neo-virtual-list={true}
  bind:this={viewport.ref}
  bind:offsetHeight={viewport.height}
  {...rest}
  onscroll={handleScroll}
>
  <svelte:element
    this={contentTag}
    class:neo-virtual-list-contents={true}
    bind:this={content.ref}
    style:padding-top="{content.top}px"
    style:padding-bottom="{content.bottom}px"
    {...contentRest}
  >
    {@render before?.(context)}
    {#each visible as { id, index, item } (id)}
      {@render children?.({ id, index, item }, context)}
    {/each}
    {@render after?.(context)}
  </svelte:element>
</svelte:element>

<style lang="scss">
  .neo-virtual-list {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    &-contents {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;
    }
  }
</style>
