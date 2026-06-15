import { cdpDragBy } from 'test/helpers/pointer.js';
import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import Harness from './TestSortable.browser.test.svelte';

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSortableItems(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-testid="sortable-item"]'));
}

function getItemOrder(): string[] {
  return getSortableItems().map(el => el.getAttribute('data-id') ?? '');
}

/** Wait until the order of rendered sortable items matches `expected`. */
async function waitForOrder(expected: string[]): Promise<void> {
  await vi.waitFor(
    () => {
      expect(getItemOrder()).toEqual(expected);
    },
    { timeout: 2000 },
  );
}

async function mountAndWaitForItems(props: Record<string, unknown> = {}): Promise<HTMLElement> {
  render(Harness as never, { props: props as never });
  const stage = await vi.waitFor(() => {
    const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
    if (!el) throw new Error('stage not mounted');
    return el;
  });
  // Wait until all three items have non-zero bounding boxes (DnD is ready)
  await vi.waitFor(
    () => {
      const items = getSortableItems();
      if (items.length < 3) throw new Error('items not rendered yet');
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        if (rect.height === 0) throw new Error('items have no height yet');
      }
    },
    { timeout: 3000 },
  );
  return stage;
}

// ---------------------------------------------------------------------------
// Render / initial state
// ---------------------------------------------------------------------------

describe('neoSortableProvider — initial render', { tags: ['browser'] }, () => {
  it('renders the three items in the correct initial order', async () => {
    await mountAndWaitForItems();
    expect(getItemOrder()).toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('each item exposes its text label', async () => {
    await mountAndWaitForItems();
    const labels = getSortableItems().map(el => el.textContent?.trim());
    expect(labels).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });
});

// ---------------------------------------------------------------------------
// Drag-to-reorder (single list, axis=y)
// ---------------------------------------------------------------------------

describe('neoSortableProvider — drag reorder', { tags: ['browser'] }, () => {
  it('dragging item-1 past item-2 promotes item-2 to position 0', async () => {
    await mountAndWaitForItems({ axis: 'y' });

    const items = getSortableItems();
    const item1Rect = items[0].getBoundingClientRect();
    const item2Rect = items[1].getBoundingClientRect();
    // Move item-1's centre past item-2's centre, with a 30% overshoot for reliability.
    const item1Centre = item1Rect.top + item1Rect.height / 2;
    const item2Centre = item2Rect.top + item2Rect.height / 2;
    const dy = Math.ceil(item2Centre - item1Centre + item2Rect.height * 0.3);
    await cdpDragBy(items[0], { y: dy }, { steps: 16, stepDelay: 20, settle: 500 });

    await waitForOrder(['item-2', 'item-1', 'item-3']);
  });

  it('axis=y: a purely horizontal drag does NOT reorder', async () => {
    await mountAndWaitForItems({ axis: 'y' });

    // Drag item-1 sideways only — the RestrictToVerticalAxis modifier collapses the
    // x component to zero, so the effective delta is (0, 0) and no sort fires.
    const items = getSortableItems();
    await cdpDragBy(items[0], { x: 200, y: 0 }, { steps: 16, stepDelay: 20, settle: 500 });

    expect(getItemOrder()).toEqual(['item-1', 'item-2', 'item-3']);
  });
});

// ---------------------------------------------------------------------------
// Disabled items
// ---------------------------------------------------------------------------

describe('neoSortableProvider — disabled item', { tags: ['browser'] }, () => {
  it('a disabled item cannot be dragged — order remains unchanged', async () => {
    await mountAndWaitForItems({ axis: 'y', disabledId: 'item-1' });

    const items = getSortableItems();
    const before = getItemOrder();
    const item1Rect = items[0].getBoundingClientRect();
    const item2Rect = items[1].getBoundingClientRect();
    const item1Centre = item1Rect.top + item1Rect.height / 2;
    const item2Centre = item2Rect.top + item2Rect.height / 2;
    const dy = Math.ceil(item2Centre - item1Centre + item2Rect.height * 0.3);

    // Attempt to drag item-1 (disabled) — same delta that would succeed if enabled
    await cdpDragBy(items[0], { y: dy }, { steps: 16, stepDelay: 20, settle: 500 });

    expect(getItemOrder()).toEqual(before);
  });
});

// ---------------------------------------------------------------------------
// Multi-list render
// ---------------------------------------------------------------------------

describe('neoSortableProvider — multi-list render', { tags: ['browser'] }, () => {
  it('renders two lists with the correct item distribution', async () => {
    await mountAndWaitForItems({ multiList: true });

    const listA = document.querySelector('[data-testid="sortable-list"][data-list-id="list-a"]');
    const listB = document.querySelector('[data-testid="sortable-list"][data-list-id="list-b"]');
    expect(listA).not.toBeNull();
    expect(listB).not.toBeNull();

    const listAItems = listA!.querySelectorAll('[data-testid="sortable-item"]');
    const listBItems = listB!.querySelectorAll('[data-testid="sortable-item"]');
    expect(listAItems).toHaveLength(2);
    expect(listBItems).toHaveLength(2);
  });

  it.skip('cross-list drag (TODO): dragging an item from list-a into list-b transfers it', async () => {
    // TODO: cross-list drag requires moving the pointer from list-a's bounding rect into
    // list-b's bounding rect. The delta depends on the gap between the two lists in the
    // harness layout. Implement once the visual layout is stable enough for pixel-level
    // offsets.
    await mountAndWaitForItems({ multiList: true });
    const la1 = document.querySelector<HTMLElement>('[data-id="la-1"]')!;
    const lb = document.querySelector<HTMLElement>('[data-list-id="list-b"]')!;
    const lbRect = lb.getBoundingClientRect();
    const la1Rect = la1.getBoundingClientRect();
    const dx = lbRect.left + lbRect.width / 2 - (la1Rect.left + la1Rect.width / 2);
    const dy = lbRect.top + lbRect.height / 2 - (la1Rect.top + la1Rect.height / 2);
    await cdpDragBy(la1, { x: dx, y: dy }, { steps: 20, stepDelay: 25, settle: 500 });
    // After transfer: list-a should have 1 item, list-b should have 3
    const listAItems = document.querySelectorAll('[data-list="list-a"]');
    const listBItems = document.querySelectorAll('[data-list="list-b"]');
    expect(listAItems).toHaveLength(1);
    expect(listBItems).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Visual contract (idle state)
// ---------------------------------------------------------------------------

describe('neoSortableProvider — visual contract', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle single-list (desktop)', async () => {
    await setViewport('desktop');
    await mountAndWaitForItems({ axis: 'y' });
    const stage = document.querySelector<HTMLElement>('[data-testid="visual-stage"]')!;
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(stage)).toMatchScreenshot(screenshotName('NeoSortableProvider', 'idle-single-list', 'desktop'));
  });

  it('idle multi-list (desktop)', async () => {
    await setViewport('desktop');
    await mountAndWaitForItems({ multiList: true });
    const stage = document.querySelector<HTMLElement>('[data-testid="visual-stage"]')!;
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(stage)).toMatchScreenshot(screenshotName('NeoSortableProvider', 'idle-multi-list', 'desktop'));
  });
});
