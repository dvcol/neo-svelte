import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SectionHarness from './TestListSection.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const ROW = 32;

function makeSections(groups: number, perGroup: number) {
  return Array.from({ length: groups }, (_, s) => ({
    id: `s${s + 1}`,
    label: `Group ${s + 1}`,
    divider: true,
    items: Array.from({ length: perGroup }, (__, i) => ({
      id: `${s + 1}-${i + 1}`,
      value: `${s + 1}-${i + 1}`,
      label: `Group ${s + 1} — item ${i + 1}`,
    })),
  }));
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

function getScroller(): HTMLElement {
  return document.querySelector<HTMLElement>('.neo-virtual-list')!;
}

describe('neoList virtual — section dividers (browser)', { tags: ['browser'] }, () => {
  it('renders a NeoDivider at the boundary of each section after the first', async () => {
    render(SectionHarness, {
      props: {
        items: makeSections(3, 5),
        virtual: true,
        itemHeight: ROW,
      } as never,
    });
    await settle();
    /*
     * Section dividers in virtual mode are stamped onto the first child of
     * each section by `flattenSectionsWithCascade`. The first row of
     * section 1 sits at flat index 0, so its top divider is suppressed
     * by `renderFlatDivider`'s `index > 0` guard. Sections 2 and 3 each
     * contribute one divider above their first row.
     */
    expect(document.querySelectorAll('.neo-list-item-divider').length).toBeGreaterThanOrEqual(2);
  });
});

describe('neoList virtual — derived_inert hygiene (browser)', { tags: ['browser'] }, () => {
  it('does not warn `derived_inert` while scrolling', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    /*
     * `derived_inert` is also surfaced via Svelte's main warning channel,
     * which routes through console.warn in dev. A single regression at
     * NeoList.svelte:658 (`out:` reading a $derived during destroyed-effect
     * cleanup) floods the console — so any matching message fails the test.
     */
    render(SectionHarness, {
      props: {
        items: makeSections(5, 100),
        virtual: true,
        itemHeight: ROW,
      } as never,
    });
    await settle();
    const list = getScroller();
    for (let y = 0; y <= ROW * 200; y += ROW * 10) {
      list.scrollTop = y;
      await settle();
    }
    await new Promise(r => setTimeout(r, 50));
    const offending = warnSpy.mock.calls.flat().filter(arg => typeof arg === 'string' && arg.includes('derived_inert'));
    expect(offending).toEqual([]);
    warnSpy.mockRestore();
  });
});
