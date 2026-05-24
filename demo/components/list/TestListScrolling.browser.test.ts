import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import ScrollingHarness from './TestListScrolling.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const ROW = 32;

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1, value: i + 1, label: `Item ${i + 1}` }));
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

function getScroller(): HTMLElement {
  return (document.querySelector<HTMLElement>('.neo-virtual-list')
    ?? document.querySelector<HTMLElement>('.neo-list-items'))!;
}

/*
 * `scrolling` is the bound flag exposed by NeoList. Virtual mode delegates
 * to NeoVirtualList's internal markScrolling. Non-virtual mode runs the
 * same logic in NeoList itself so consumers can rely on the prop in either
 * mode.
 *
 * Both modes flip true synchronously on the first scroll event and reset
 * after a 150ms idle window (300ms on touch). The tests below pin that
 * symmetry — same behavior, same observable timing.
 */
describe('neoList — scrolling prop parity (browser)', { tags: ['browser'] }, () => {
  for (const virtual of [true, false] as const) {
    describe(virtual ? 'virtual' : 'non-virtual', () => {
      it('toggles scrolling=true on scroll and resets after idle', async () => {
        const seen: boolean[] = [];
        render(ScrollingHarness, {
          props: {
            items: makeItems(200),
            virtual,
            itemHeight: virtual ? ROW : undefined,
            onScrollingChange: (v: boolean) => seen.push(v),
          } as never,
        });
        await settle();
        expect(seen.at(-1)).toBe(false);

        const list = getScroller();
        list.scrollTop = ROW * 5;
        list.dispatchEvent(new Event('scroll'));
        await settle();
        expect(seen).toContain(true);
        expect(seen.at(-1)).toBe(true);

        await new Promise(r => setTimeout(r, 400));
        expect(seen.at(-1)).toBe(false);
      });

      it('extends the idle window on continued scrolling', async () => {
        const seen: boolean[] = [];
        render(ScrollingHarness, {
          props: {
            items: makeItems(200),
            virtual,
            itemHeight: virtual ? ROW : undefined,
            onScrollingChange: (v: boolean) => seen.push(v),
          } as never,
        });
        await settle();
        const list = getScroller();
        for (let i = 1; i <= 4; i++) {
          list.scrollTop = ROW * i;
          list.dispatchEvent(new Event('scroll'));
          await new Promise(r => setTimeout(r, 80));
          // Mid-burst: still scrolling because the timer keeps getting reset.
          expect(seen.at(-1)).toBe(true);
        }
        await new Promise(r => setTimeout(r, 400));
        expect(seen.at(-1)).toBe(false);
      });
    });
  }
});
