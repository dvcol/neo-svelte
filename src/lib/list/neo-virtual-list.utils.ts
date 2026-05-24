import type { NeoVirtualKey } from '~/list/neo-virtual-list.model.js';

/** Resolve a stable id for `item` at `index`, falling back to `index` when `key` returns nullish. */
export function resolveVirtualId<T>(item: T, index: number, key: NeoVirtualKey<T>): string | number {
  const id = key?.(item, index);
  return id ?? index;
}

export interface BuildOffsetsArgs<T> {
  items: ReadonlyArray<T>;
  length: number;
  key: NeoVirtualKey<T>;
  fixedHeight: number | null;
  heightFn: ((item: T, index: number) => number) | null;
  heights: ReadonlyMap<string | number, number>;
  estimate: number;
}

/**
 * Build the prefix-sum offset map for `items`.
 *
 * `offsets[i]` is the sum of the heights of items `[0..i)`; `offsets[length]` is
 * the total content height. Fixed mode multiplies, function mode calls the
 * caller's height fn, dynamic mode reads from the measured `heights` map and
 * falls back to `estimate` for unmeasured ids.
 */
export function buildOffsets<T>({
  items,
  length,
  key,
  fixedHeight,
  heightFn,
  heights,
  estimate,
}: BuildOffsetsArgs<T>): { offsets: Float64Array; total: number } {
  const next = new Float64Array(length + 1);
  let acc = 0;
  if (fixedHeight != null) {
    const h = fixedHeight;
    for (let i = 0; i < length; i++) {
      next[i] = acc;
      acc += h;
    }
  } else if (heightFn) {
    for (let i = 0; i < length; i++) {
      next[i] = acc;
      acc += heightFn(items[i], i);
    }
  } else {
    for (let i = 0; i < length; i++) {
      next[i] = acc;
      acc += heights.get(resolveVirtualId(items[i], i, key)) ?? estimate;
    }
  }
  next[length] = acc;
  return { offsets: next, total: acc };
}

export interface IndexAtOffsetArgs {
  y: number;
  fixedHeight: number | null;
  offsets: Float64Array;
  length: number;
}

/**
 * Largest `i` such that `offsets[i] <= y`. O(1) division in fixed mode,
 * O(log n) binary search in dynamic / per-item-fn mode.
 */
export function indexAtOffset({ y, fixedHeight, offsets, length }: IndexAtOffsetArgs): number {
  if (!length) return 0;
  if (fixedHeight != null) {
    return Math.max(0, Math.min(length - 1, Math.floor(y / fixedHeight)));
  }
  let lo = 0;
  let hi = offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (offsets[mid] <= y) lo = mid;
    else hi = mid - 1;
  }
  return Math.max(0, Math.min(length - 1, lo));
}

export interface ComputeCursorArgs {
  scrollTop: number;
  viewportHeight: number;
  length: number;
  buffer: number;
  fixedHeight: number | null;
  offsets: Float64Array;
}

/**
 * Compute the rendered window `[start, end)` for the current scroll position.
 *
 * Empty input collapses to `{ start: 0, end: 0 }`. Non-empty input expands the
 * window by `buffer` rows on either side and clamps to `[0, length]`.
 */
export function computeCursor({
  scrollTop,
  viewportHeight,
  length,
  buffer,
  fixedHeight,
  offsets,
}: ComputeCursorArgs): { start: number; end: number } {
  if (!length) return { start: 0, end: 0 };
  const bottom = scrollTop + viewportHeight;
  const startIdx = indexAtOffset({ y: scrollTop, fixedHeight, offsets, length });
  const endIdx = indexAtOffset({ y: bottom, fixedHeight, offsets, length }) + 1;
  const start = Math.max(0, startIdx - buffer);
  const end = Math.min(length, endIdx + buffer);
  return { start, end };
}
