<script lang="ts" generics="T">
  import type {
    NeoVirtualContext,
    NeoVirtualItem,
    NeoVirtualListMethods,
    NeoVirtualListProps,
    NeoVirtualRegister,
  } from '~/list/neo-virtual-list.model.js';

  import { toTransition, toTransitionProps } from '@dvcol/svelte-utils/transition';
  import { onDestroy, onMount, untrack } from 'svelte';

  import { defaultVirtualKey } from '~/list/neo-virtual-list.model.js';
  import { buildOffsets, computeCursor } from '~/list/neo-virtual-list.utils.js';

  let {
    // Snippets
    children,
    before,
    after,

    // State
    ref = $bindable(),
    tag = 'ul',
    items = [],
    key = defaultVirtualKey as never,
    itemHeight,
    estimatedItemHeight = 40,
    buffer = 10,
    scrolling = $bindable(false),

    // Events
    onscroll,
    onScrollTop,
    onScrollBottom,
    scrollTolerance = 1,

    // List Transitions (mounted on the viewport itself)
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

  /* ------------------------------ Sizing --------------------------------- */

  const fixedHeight = $derived(typeof itemHeight === 'number' ? itemHeight : null);
  const heightFn = $derived(typeof itemHeight === 'function' ? itemHeight : null);
  const dynamicMode = $derived(fixedHeight == null && !heightFn);

  // Heights cached by stable item key. Survives reorder.
  const heights = new Map<string | number, number>();

  function resolveId(item: T, index: number): string | number {
    const id = (key as (item: T, index: number) => string | number | undefined)?.(item, index);
    return id ?? index;
  }

  /*
   * Running average of measured heights. Refines as more rows measure.
   * Falls back to `estimatedItemHeight` (read via $derived to stay reactive
   * when the caller updates it).
   */
  const initialEstimate = $derived(estimatedItemHeight);
  let measuredAvg = $state(0);
  function refreshAvg() {
    if (heights.size === 0) {
      measuredAvg = 0;
      return;
    }
    let sum = 0;
    for (const h of heights.values()) sum += h;
    measuredAvg = sum / heights.size;
  }

  function effectiveEstimate(): number {
    return measuredAvg || initialEstimate;
  }

  /* --------------------------- Offsets (sums) ---------------------------- */
  /* offsets[i] = sum of heights of items [0..i). offsets[items.length] = total. */

  let offsets = $state<Float64Array>(new Float64Array(1));
  let total = $state(0);

  function rebuildOffsets() {
    const built = buildOffsets({
      items,
      length: items.length,
      key,
      fixedHeight,
      heightFn,
      heights,
      estimate: effectiveEstimate(),
    });
    offsets = built.offsets;
    total = built.total;
  }

  /* ------------------------------- Cursor -------------------------------- */

  const cursor = $state({ start: 0, end: 0 });
  let viewportHeight = $state(0);

  function recomputeCursor() {
    if (!ref) return;
    const next = computeCursor({
      scrollTop: ref.scrollTop,
      viewportHeight,
      length: items.length,
      buffer,
      fixedHeight,
      offsets,
    });
    if (cursor.start !== next.start) cursor.start = next.start;
    if (cursor.end !== next.end) cursor.end = next.end;
  }

  /* --------------------------- Scroll handling --------------------------- */

  /*
   * Cursor recompute runs synchronously on every scroll event so cursor.start/end
   * and the derived padTop/padBottom stay in lock-step with the next paint.
   * It is O(log n) (binary search) in dynamic mode and O(1) in fixed mode, so
   * throttling via rAF would only re-introduce the off-by-one-frame white gap.
   */

  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const scrollIdleMs = isTouch ? 300 : 150;
  let stopScrollingTimer: ReturnType<typeof setTimeout> | 0 = 0;
  function markScrolling() {
    if (!scrolling) scrolling = true;
    if (stopScrollingTimer) clearTimeout(stopScrollingTimer);
    stopScrollingTimer = setTimeout(() => {
      scrolling = false;
      stopScrollingTimer = 0;
    }, scrollIdleMs);
  }

  function fireEdgeEvents(e: Event) {
    if (!ref) return;
    const top = ref.scrollTop;
    if (top === 0) return onScrollTop?.(e);
    if (Math.abs(top + ref.clientHeight - ref.scrollHeight) <= scrollTolerance) {
      return onScrollBottom?.(e);
    }
  }

  function handleScroll(e: Event) {
    markScrolling();
    recomputeCursor();
    fireEdgeEvents(e);
    onscroll?.(e as never);
  }

  /* ----------------------- Measurement (shared RO) ----------------------- */

  let measureFrame = 0;
  let measureDirty = false;
  function scheduleOffsetRebuild() {
    measureDirty = true;
    if (measureFrame) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      if (!measureDirty) return;
      measureDirty = false;
      refreshAvg();
      rebuildOffsets();
      recomputeCursor();
    /*
     * Intentionally do NOT call ensureScrollInBounds() here: a measurement-
     * driven rebuild during user scroll would re-clamp scrollTop and feed
     * back into handleScroll → recomputeCursor → mount → register → rebuild.
     * The master $effect handles items-driven clamping; the user owns scroll.
     */
    });
  }

  const observer = typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver((entries) => {
      if (!dynamicMode) return; // ignore measurements when caller controls heights
      let changed = false;
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const id = readKey(el);
        if (id == null) continue;
        const next = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
        if (!next) continue; // skip zero-height (display:none, not laid out)
        if (heights.get(id) !== next) {
          heights.set(id, next);
          changed = true;
        }
      }
      if (changed) scheduleOffsetRebuild();
    });

  function writeKey(el: HTMLElement, id: string | number) {
    el.dataset.virtualKey = String(id);
    el.dataset.virtualKeyType = typeof id === 'number' ? 'n' : 's';
  }

  function readKey(el: HTMLElement): string | number | undefined {
    const raw = el.dataset.virtualKey;
    if (raw == null) return;
    return el.dataset.virtualKeyType === 'n' ? Number(raw) : raw;
  }

  /**
   * Svelte 5 attachment factory, memoized by id.
   *
   * Returned closures are passed to children snippets and spread via
   * `{@attach register}` on the consumer's row element. Memoizing by id
   * prevents the attachment from re-running on every re-render of a row
   * that hasn't actually changed key.
   */
  const registerCache = new Map<string | number, NeoVirtualRegister>();
  function makeRegister(id: string | number): NeoVirtualRegister {
    const cached = registerCache.get(id);
    if (cached) return cached;
    const fn: NeoVirtualRegister = (node) => {
      const el = node as HTMLElement;
      writeKey(el, id);
      if (!dynamicMode) return;
      /*
       * Cache-warm only: seed the height when we have none yet. Genuine size
       * changes after mount come through the ResizeObserver, so re-measuring
       * on every scroll-driven re-mount would just fight handleScroll.
       */
      if (!heights.has(id)) {
        const h = el.offsetHeight;
        if (h) {
          heights.set(id, h);
          scheduleOffsetRebuild();
        }
      }
      observer?.observe(el);
      return () => observer?.unobserve(el);
    };
    registerCache.set(id, fn);
    return fn;
  }

  function ensureScrollInBounds() {
    if (!ref) return;
    const max = Math.max(0, total - viewportHeight);
    if (ref.scrollTop > max) ref.scrollTo({ top: max, behavior: 'instant' });
  }

  /* ----------------------------- Visible slice ---------------------------- */

  const visible = $derived.by<NeoVirtualItem<T>[]>(() => {
    const out: NeoVirtualItem<T>[] = [];
    /*
     * Clamp the cursor against the live `items.length` here — the master
     * `$effect` that re-clamps cursor on items mutation runs *after* this
     * derivation in the same tick, so `items[i]` would otherwise be `undefined`
     * for indices past the new length and `key(undefined, i)` would crash.
     */
    const end = Math.min(cursor.end, items.length);
    for (let i = cursor.start; i < end; i++) {
      const item = items[i] as T;
      out.push({ id: resolveId(item, i), index: i, item });
    }
    return out;
  });

  const padTop = $derived(offsets[Math.min(cursor.start, offsets.length - 1)] ?? 0);
  const padBottom = $derived(Math.max(0, total - (offsets[Math.min(cursor.end, offsets.length - 1)] ?? 0)));

  /* --------------------------- Reactive triggers ------------------------- */

  /*
   * Rebuild offsets when items / sizing change. GC stale heights in dynamic mode.
   * Note: estimatedItemHeight is intentionally NOT tracked here — rebuildOffsets
   * reads it via effectiveEstimate() each call, so the rebuild path already
   * reacts to estimate changes.
   */
  $effect(() => {
    /* eslint-disable no-unused-expressions */
    items;
    fixedHeight;
    heightFn;
    /* eslint-enable no-unused-expressions */
    untrack(() => {
      if (heights.size || registerCache.size) {
        const present = new Set<string | number>();
        for (let i = 0; i < items.length; i++) present.add(resolveId(items[i]!, i));
        if (dynamicMode) {
          for (const k of heights.keys()) if (!present.has(k)) heights.delete(k);
          refreshAvg();
        }
        for (const k of registerCache.keys()) if (!present.has(k)) registerCache.delete(k);
      }
      rebuildOffsets();
      recomputeCursor();
      /*
       * Only clamp when items have actually shrunk past the current scrollTop.
       * Calling ensureScrollInBounds() unconditionally on every items change
       * dispatches a scroll event that re-enters handleScroll → recompute,
       * which during a smooth scroll cascades into Svelte's effect-update loop.
       */
      if (ref && ref.scrollTop > Math.max(0, total - viewportHeight)) {
        ensureScrollInBounds();
      }
    });
  });

  /* React to viewportHeight changes (resize) without going through scroll. */
  $effect(() => {
    // eslint-disable-next-line no-unused-expressions
    viewportHeight;
    untrack(recomputeCursor);
  });

  onMount(() => {
    rebuildOffsets();
    recomputeCursor();
  });

  onDestroy(() => {
    observer?.disconnect();
    if (measureFrame) cancelAnimationFrame(measureFrame);
    if (stopScrollingTimer) clearTimeout(stopScrollingTimer);
  });

  /* ----------------------------- Public methods -------------------------- */

  /** Force a re-measure of currently rendered rows + offset rebuild. */
  export const refresh: NeoVirtualListMethods['refresh'] = () => {
    if (dynamicMode && ref) {
      const rows = ref.querySelectorAll<HTMLElement>('[data-virtual-key]');
      for (const el of rows) {
        const id = readKey(el);
        if (id == null) continue;
        const h = el.offsetHeight;
        if (h) heights.set(id, h);
      }
      refreshAvg();
    }
    rebuildOffsets();
    recomputeCursor();
  };

  export const scrollToTop: NeoVirtualListMethods['scrollToTop'] = (options) => {
    if (!ref) return false;
    ref.scrollTo({ top: 0, behavior: 'smooth', ...options });
    return ref;
  };

  export const scrollToBottom: NeoVirtualListMethods['scrollToBottom'] = (options) => {
    if (!ref) return false;
    /*
     * Use the actual scrollable max instead of `total` — `total` excludes the
     * before/after slot heights, so targeting it would land short of the bottom
     * and the next layout would emit further scroll events.
     */
    const max = Math.max(0, ref.scrollHeight - ref.clientHeight);
    ref.scrollTo({ top: max, behavior: 'smooth', ...options });
    return ref;
  };

  export const scrollToIndex: NeoVirtualListMethods['scrollToIndex'] = (index, options) => {
    if (!ref || index < 0 || index >= items.length) return false;
    const align = options?.align ?? 'start';
    let target = offsets[index] ?? 0;
    const itemH = (offsets[index + 1] ?? total) - target;
    if (align === 'center') target = target - viewportHeight / 2 + itemH / 2;
    else if (align === 'end') target = target - viewportHeight + itemH;
    target = Math.max(0, Math.min(Math.max(0, total - viewportHeight), target));
    ref.scrollTo({ top: target, behavior: 'smooth', ...options });
    return ref;
  };

  /* ------------------------------- Context ------------------------------- */

  const context = $derived<NeoVirtualContext<T>>({
    items,
    visible,
    start: cursor.start,
    end: cursor.end,
    total,
    viewport: viewportHeight,
    scrolling,
  });

  /* Mount transitions on the viewport itself (in/out of the whole list). */
  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element
  this={tag}
  class:neo-virtual-list={true}
  bind:this={ref}
  bind:offsetHeight={viewportHeight}
  {...rest}
  onscroll={handleScroll}
  in:inFn={inProps}
  out:outFn={outProps}
>
  <svelte:element
    this={contentTag}
    class:neo-virtual-list-contents={true}
    style:padding-top="{padTop}px"
    style:padding-bottom="{padBottom}px"
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
    {#each visible as v (v.id)}
      {@render children(v, context, makeRegister(v.id))}
    {/each}
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

    &-before,
    &-after {
      display: flex;
      flex-direction: column;
    }
  }
</style>
