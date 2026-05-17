# Virtual list rewrite

Goal: replace the stuttering virtual scroller with a high-performance,
elegant primitive (`NeoVirtualList`) and an opt-in virtualization mode on
`NeoList`. Drop `NeoSimpleList`. Breaking change.

## Why

The current `NeoVirtualList` (consumed via `NeoSimpleList`) suffers from
white flashes and stuttering on fast scroll. Root causes (current code):

- `handleScroll → handleResize` is fully synchronous and O(n): every
  scroll tick walks all items from index 0 to compute `content.top`,
  then walks the rest for `content.bottom`. No rAF, no throttling.
- `computeCursor` `await`s `tick()` inside its row-discovery loop —
  every newly visible row forces a microtask flush.
- Two redundant invalidators on `items` change (`$effect(refresh)`
  and `watch(handleResize, items.length)`) double the work.
- `ResizeObserver` re-fires `refresh` on every row size change, which
  re-observes every row again. No `unobserve` on rows that scroll out.
- `getTotalHeight` / `getAverageHeight` allocate and reduce on every
  call from the hot path.
- Rows use `out:inFn` / `in:outFn` transitions that fire on every
  cursor advance during scroll; the `scrolling` guard is too loose.
- Id-keyed `{#each}` falls back to `index + cursor.start` when items
  lack ids — re-mounts everything when the cursor moves.

These are inherent to the current approach. Rewrite from scratch.

## Locked design

### NeoVirtualList — primitive

- **Snippet API:** `children({ id, index, item }, context, register)`.
  Consumer renders its own row element with `{@attach register}`
  (Svelte 5 attachment). NeoVirtualList does **not** wrap rows.
- **Sizing:** `itemHeight?: number | ((item, i) => number)` — omit for
  dynamic measurement. `estimatedItemHeight?: number` (default 40)
  is the initial estimate for unmeasured rows in dynamic mode.
- **Buffer:** `buffer: number` rows above/below visible window,
  default 3.
- **Layout:** padding-spacer top/bottom on a single content layer.
  Keeps CSS `position: sticky` working for non-virtual paths that
  use it (we explicitly _do not_ virtualize sticky-section lists).
- **Hot path:** rAF-coalesced cursor recompute. Prefix-sum offsets in
  a `Float64Array`. Binary search for dynamic mode, O(1) division for
  fixed mode. No `await tick()` anywhere in the scroll path.
- **Measurement:** single shared `ResizeObserver`. Heights cached by
  stable item key (survives reorder). One rAF batches measurement
  changes into a single offset rebuild.
- **Imperative methods (Svelte 5 `export const`):**
  `refresh`, `scrollToTop`, `scrollToBottom`, `scrollToIndex`. Children
  also receive these via the snippet `context` arg.
- **Slots:** `before` / `after` snippets render only when the cursor
  reaches the start / end (`cursor.start === 0` / `cursor.end === items.length`).
- **State:** `scrolling` is `$bindable`, true while the viewport is
  actively scrolling, debounced reset (300 ms touch / 150 ms desktop).
- **Accessibility:** `prefers-reduced-motion: reduce` forces
  `emptyTransition` for in/out regardless of scroll state.
- **Not supported:** `flip` (column-reverse) — caller must use
  non-virtual mode.

### NeoList — sugar over NeoVirtualList

- **New prop:** `virtual?: boolean` (default `false` — opt-in).
- **Virtualization activates** only when `virtual && !hasSections(items) && !flip`.
  Otherwise: `Logger.warn` and fall back to the current rendering path.
- **Forwards** to NeoVirtualList: `itemHeight`, `buffer`,
  `estimatedItemHeight`, `key`.
- **`animate:` (FLIP)** is a no-op in virtual mode (incompatible with
  cursor-driven mounts/unmounts). Documented.
- **`in:` / `out:` transitions** are wrapped in `emptyTransition`
  while `scrolling`, re-armed at idle threshold (single stage).
- **`customSection` snippet** untouched (only used in non-virtual fallback).
- **Loader** renders via the `after` slot of NeoVirtualList in virtual
  mode (visible only when cursor reaches end). Existing `scrollToLoader`
  semantics preserved via `scrollToBottom`.
- **`scrolling`** is `$bindable`, tracked in both modes.
- **Imperative methods (`export const`)** matching the ref-migration
  pattern: `scrollToTop`, `scrollToBottom`, `scrollToIndex`, `refresh`,
  plus existing `selectItem`, `clearItem`, `reSelect`. In virtual mode,
  scroll methods delegate to an internal `bind:this={virtualList}`.
- **`ref`** stays as the raw DOM element — no `Object.assign(ref, …)`.

### Caveats / documented limitations

- Virtualization auto-disabled for sectioned lists (`customSection`
  callers keep full power).
- `flip` and `virtual` are mutually exclusive (warn + fall back).
- `animate:` is no-op in virtual mode.
- Zero-height measurements are skipped — rows continue using
  `estimatedItemHeight` until they have real layout.

## File-level changes

| File                                           | Change                                                                                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/list/NeoVirtualList.svelte`           | Full rewrite (padding-spacer, rAF, prefix-sum, `register` attachment).                                                                                      |
| `src/lib/list/neo-virtual-list.model.ts`       | New props (`estimatedItemHeight`, function `itemHeight`, `NeoVirtualListMethods`). Drop styling props (`dim`/`shadow`/`scrollbar`) — those move to NeoList. |
| `src/lib/list/NeoList.svelte`                  | Add `virtual` branch (calls into NeoVirtualList), warn + fallback for sections / flip, scroll-gated transitions, `export const` methods.                    |
| `src/lib/list/neo-list.model.ts`               | Add `virtual`, `itemHeight`, `buffer`, `estimatedItemHeight`, `key` props.                                                                                  |
| `src/lib/list/NeoSimpleList.svelte`            | **Delete.**                                                                                                                                                 |
| `src/lib/list/neo-simple-list.model.ts`        | **Delete.**                                                                                                                                                 |
| `src/lib/list/NeoSimpleList.test.ts`           | **Delete.**                                                                                                                                                 |
| `src/lib/list/NeoVirtualList.test.{svelte,ts}` | Rewrite with exhaustive coverage (jsdom + browser).                                                                                                         |
| `src/lib/list/NeoList.test.ts`                 | Extend: virtual on/off matrix, fallbacks, animate no-op, transition gating, selection persistence across cursor moves.                                      |
| `src/lib/list/index.ts`                        | Fix the alias bug (`NeoVirtualList` was re-exported from NeoSimpleList). Drop simple-list exports.                                                          |
| `demo/components/list/DemoLists.svelte`        | Three explicit cells: NeoList non-virtual, NeoList virtual, NeoVirtualList primitive.                                                                       |

## Verification checklist

- 1k+ items fast-scroll without empty viewport gaps.
- Selection persists across sort / filter / virtual cursor moves.
- Insertion at top during scroll does not animation-flash.
- Sectioned lists (non-virtual fallback) unchanged.
- `flip` lists (non-virtual fallback) unchanged.
- `prefers-reduced-motion: reduce` suppresses transitions.
- `register` attachment unobserves on row unmount (no leaked observers).
