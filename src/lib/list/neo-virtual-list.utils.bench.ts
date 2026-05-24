import { bench, describe } from 'vitest';

import { defaultVirtualKey } from '~/list/neo-virtual-list.model.js';
import { buildOffsets, computeCursor } from '~/list/neo-virtual-list.utils.js';

const SIZES = [1_000, 10_000, 100_000] as const;
const SCROLL_FRACTIONS = [0, 0.25, 0.5, 0.75, 1] as const;
const ROW = 40;
const VIEWPORT = 800;
const BUFFER = 8;

interface Item {
  id: number;
}

const itemPools = new Map<number, Item[]>();
function makeItems(n: number): Item[] {
  let pool = itemPools.get(n);
  if (!pool) {
    pool = Array.from({ length: n }, (_, i) => ({ id: i }));
    itemPools.set(n, pool);
  }
  return pool;
}

const fixedFixtures = new Map<number, { items: Item[]; offsets: Float64Array; total: number }>();
function fixedFixture(n: number) {
  let f = fixedFixtures.get(n);
  if (!f) {
    const items = makeItems(n);
    const built = buildOffsets({
      items,
      length: n,
      key: defaultVirtualKey,
      fixedHeight: ROW,
      heightFn: null,
      heights: new Map(),
      estimate: ROW,
    });
    f = { items, offsets: built.offsets, total: built.total };
    fixedFixtures.set(n, f);
  }
  return f;
}

const dynamicFixtures = new Map<
  number,
  { items: Item[]; heights: Map<string | number, number>; offsets: Float64Array; total: number }
>();
function dynamicFixture(n: number) {
  let f = dynamicFixtures.get(n);
  if (!f) {
    const items = makeItems(n);
    /*
     * Realistic dynamic-mode fixture: every other row measured to a custom
     * height; the rest fall back to `estimate`. Forces buildOffsets through
     * the map-lookup branch and computeCursor through binary search.
     */
    const heights = new Map<string | number, number>();
    for (let i = 0; i < n; i += 2) heights.set(i, 30 + (i % 50));
    const built = buildOffsets({
      items,
      length: n,
      key: defaultVirtualKey,
      fixedHeight: null,
      heightFn: null,
      heights,
      estimate: ROW,
    });
    f = { items, heights, offsets: built.offsets, total: built.total };
    dynamicFixtures.set(n, f);
  }
  return f;
}

for (const n of SIZES) {
  describe(`buildOffsets — fixed (n=${n})`, () => {
    const items = makeItems(n);
    bench('build', () => {
      buildOffsets({
        items,
        length: n,
        key: defaultVirtualKey,
        fixedHeight: ROW,
        heightFn: null,
        heights: new Map(),
        estimate: ROW,
      });
    });
  });

  describe(`buildOffsets — dynamic (n=${n})`, () => {
    const { items, heights } = dynamicFixture(n);
    bench('build', () => {
      buildOffsets({
        items,
        length: n,
        key: defaultVirtualKey,
        fixedHeight: null,
        heightFn: null,
        heights,
        estimate: ROW,
      });
    });
  });
}

for (const n of SIZES) {
  describe(`computeCursor — fixed (n=${n})`, () => {
    const { offsets, total } = fixedFixture(n);
    const max = Math.max(0, total - VIEWPORT);
    for (const frac of SCROLL_FRACTIONS) {
      const scrollTop = max * frac;
      bench(`scrollTop=${Math.round(frac * 100)}%`, () => {
        computeCursor({
          scrollTop,
          viewportHeight: VIEWPORT,
          length: n,
          buffer: BUFFER,
          fixedHeight: ROW,
          offsets,
        });
      });
    }
  });

  describe(`computeCursor — dynamic (n=${n})`, () => {
    const { offsets, total } = dynamicFixture(n);
    const max = Math.max(0, total - VIEWPORT);
    for (const frac of SCROLL_FRACTIONS) {
      const scrollTop = max * frac;
      bench(`scrollTop=${Math.round(frac * 100)}%`, () => {
        computeCursor({
          scrollTop,
          viewportHeight: VIEWPORT,
          length: n,
          buffer: BUFFER,
          fixedHeight: null,
          offsets,
        });
      });
    }
  });
}
