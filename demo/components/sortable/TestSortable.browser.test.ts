import { cdpDragBy } from 'test/helpers/pointer.js';
import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import DemoSortable from './DemoSortable.svelte';
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

  it('keeps NeoList drag feedback stable during a collision', async () => {
    await mountAndWaitForItems({ axis: 'y', neoList: true });

    const items = getSortableItems();
    const item1Rect = items[0].getBoundingClientRect();
    const item2Rect = items[1].getBoundingClientRect();
    const item1Centre = item1Rect.top + item1Rect.height / 2;
    const item2Centre = item2Rect.top + item2Rect.height / 2;
    const dy = Math.ceil(item2Centre - item1Centre + item2Rect.height * 0.3);
    let observedFeedback = false;
    let feedbackStayedVisible = true;
    let containerStayedStable = true;
    let maxStepError = 0;
    let previousFeedbackY: number | undefined;
    let previousPointerY: number | undefined;
    const list = document.querySelector<HTMLElement>('[data-testid="sortable-list"]')!;
    const initialListRect = list.getBoundingClientRect();

    await cdpDragBy(items[0], { y: dy }, {
      steps: 16,
      stepDelay: 20,
      settle: 500,
      onStep: ({ y }) => {
        const feedback = document.querySelector<HTMLElement>('[data-dnd-dragging]');
        if (!feedback) return;
        observedFeedback = true;
        const rect = feedback.getBoundingClientRect();
        const styles = getComputedStyle(feedback);
        const listRect = list.getBoundingClientRect();
        const feedbackY = rect.top + rect.height / 2;
        feedbackStayedVisible &&= rect.width > 0 && rect.height > 0 && styles.opacity !== '0' && styles.visibility !== 'hidden';
        containerStayedStable &&= Math.abs(listRect.width - initialListRect.width) < 1 && Math.abs(listRect.height - initialListRect.height) < 1;
        if (previousFeedbackY !== undefined && previousPointerY !== undefined) {
          maxStepError = Math.max(maxStepError, Math.abs((feedbackY - previousFeedbackY) - (y - previousPointerY)));
        }
        previousFeedbackY = feedbackY;
        previousPointerY = y;
      },
    });

    expect(observedFeedback).toBe(true);
    expect(feedbackStayedVisible).toBe(true);
    expect(containerStayedStable).toBe(true);
    expect(maxStepError).toBeLessThan(20);
    expect(getItemOrder()).not.toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('leaves NeoList rows inert when the row wrapper is omitted', async () => {
    await mountAndWaitForItems({ axis: 'y', neoList: true, neoListRow: false });

    const items = getSortableItems();
    const item1Rect = items[0].getBoundingClientRect();
    const item2Rect = items[1].getBoundingClientRect();
    const dy = Math.ceil(item2Rect.bottom - item1Rect.top);

    await cdpDragBy(items[0], { y: dy }, { steps: 12, stepDelay: 20, settle: 300 });

    expect(document.querySelector('[data-dnd-dragging]')).toBeNull();
    expect(getItemOrder()).toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('does not update untouched selection content with a composed row', async () => {
    render(Harness as never, {
      props: {
        axis: 'y',
        neoList: true,
        neoListCustomItem: false,
        neoListSelect: true,
      } as never,
    });

    const row = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-list-item[data-id="item-1"]');
      if (!el) throw new Error('selectable row not mounted');
      return el;
    });
    const sibling = document.querySelector<HTMLElement>('.neo-list-item[data-id="item-2"]')!;
    const checkmark = row.querySelector('.neo-list-item-checkmark');
    const siblingCheckmark = sibling.querySelector('.neo-list-item-checkmark');
    const checkbox = checkmark?.querySelector('svg');
    const siblingCheckbox = siblingCheckmark?.querySelector('svg');
    const siblingCheckPath = siblingCheckbox?.querySelector('path');
    const siblingCheckAnimation = siblingCheckPath?.querySelector('animate');
    const button = row.querySelector<HTMLButtonElement>('button');
    expect(checkmark).not.toBeNull();
    expect(siblingCheckmark).not.toBeNull();
    expect(checkbox).not.toBeNull();
    expect(siblingCheckbox).not.toBeNull();
    expect(siblingCheckPath).not.toBeNull();
    expect(siblingCheckAnimation).not.toBeNull();
    expect(button).not.toBeNull();

    button!.click();
    await vi.waitFor(() => expect(row.getAttribute('aria-selected')).toBe('true'));

    expect(row.querySelector('.neo-list-item-checkmark')).toBe(checkmark);
    expect(row.querySelector('.neo-list-item-checkmark svg')).not.toBe(checkbox);
    expect(document.querySelector('.neo-list-item[data-id="item-2"]')).toBe(sibling);
    expect(sibling.querySelector('.neo-list-item-checkmark')).toBe(siblingCheckmark);
    expect(sibling.querySelector('.neo-list-item-checkmark svg')).toBe(siblingCheckbox);
    expect(sibling.querySelector('.neo-list-item-checkmark path')).toBe(siblingCheckPath);
    expect(sibling.querySelector('.neo-list-item-checkmark animate')).toBe(siblingCheckAnimation);
  });

  it('does not update untouched selection content without a custom row', async () => {
    render(Harness as never, {
      props: {
        neoList: true,
        neoListCustomItem: false,
        neoListRow: false,
        neoListSelect: true,
      } as never,
    });

    const row = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-list-item[data-id="item-1"]');
      if (!el) throw new Error('selectable row not mounted');
      return el;
    });
    const sibling = document.querySelector<HTMLElement>('.neo-list-item[data-id="item-2"]')!;
    const checkmark = row.querySelector('.neo-list-item-checkmark');
    const siblingCheckmark = sibling.querySelector('.neo-list-item-checkmark');
    const checkbox = checkmark?.querySelector('svg');
    const siblingCheckbox = siblingCheckmark?.querySelector('svg');
    const siblingCheckPath = siblingCheckbox?.querySelector('path');
    const siblingCheckAnimation = siblingCheckPath?.querySelector('animate');
    const button = row.querySelector<HTMLButtonElement>('button');
    expect(checkmark).not.toBeNull();
    expect(siblingCheckmark).not.toBeNull();
    expect(checkbox).not.toBeNull();
    expect(siblingCheckbox).not.toBeNull();
    expect(siblingCheckPath).not.toBeNull();
    expect(siblingCheckAnimation).not.toBeNull();
    expect(button).not.toBeNull();

    button!.click();
    await vi.waitFor(() => expect(row.getAttribute('aria-selected')).toBe('true'));

    expect(row.querySelector('.neo-list-item-checkmark')).toBe(checkmark);
    expect(row.querySelector('.neo-list-item-checkmark svg')).not.toBe(checkbox);
    expect(document.querySelector('.neo-list-item[data-id="item-2"]')).toBe(sibling);
    expect(sibling.querySelector('.neo-list-item-checkmark')).toBe(siblingCheckmark);
    expect(sibling.querySelector('.neo-list-item-checkmark svg')).toBe(siblingCheckbox);
    expect(sibling.querySelector('.neo-list-item-checkmark path')).toBe(siblingCheckPath);
    expect(sibling.querySelector('.neo-list-item-checkmark animate')).toBe(siblingCheckAnimation);
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

  it('keeps drag feedback visible while transferring an item across lists', async () => {
    await mountAndWaitForItems({ multiList: true, multiNeoList: true });
    const la1 = document.querySelector<HTMLElement>('[data-id="la-1"]')!;
    const lb = document.querySelector<HTMLElement>('[data-list-id="list-b"]')!;
    const lbRect = lb.getBoundingClientRect();
    const la1Rect = la1.getBoundingClientRect();
    const dx = lbRect.left + lbRect.width / 2 - (la1Rect.left + la1Rect.width / 2);
    const dy = lbRect.top + lbRect.height / 2 - (la1Rect.top + la1Rect.height / 2);
    let observedFeedback = false;
    let crossedIntoTarget = false;
    let feedbackStayedMounted = true;
    let feedbackStayedSized = true;
    let feedbackStayedPopulated = true;
    let feedbackStayedVisible = true;
    let observedHiddenPlaceholder = false;
    let observedOverlay = false;
    await cdpDragBy(la1, { x: dx, y: dy }, {
      steps: 20,
      stepDelay: 25,
      settle: 500,
      onStep: ({ x }) => {
        if (x >= lbRect.left) crossedIntoTarget = true;
        observedHiddenPlaceholder ||= !!document.querySelector('[data-dnd-placeholder="hidden"]');
        observedOverlay ||= !!document.querySelector('[data-dnd-overlay]');
        const feedback = document.querySelector<HTMLElement>('[data-dnd-dragging]');
        if (!feedback) {
          if (crossedIntoTarget) feedbackStayedMounted = false;
          return;
        }
        observedFeedback = true;
        const rect = feedback.getBoundingClientRect();
        const style = getComputedStyle(feedback);
        if (crossedIntoTarget) {
          feedbackStayedSized &&= rect.width > 0 && rect.height > 0;
          feedbackStayedPopulated &&= feedback.textContent?.includes('A1') === true;
          feedbackStayedVisible &&= style.visibility !== 'hidden' && style.opacity !== '0';
        }
      },
    });

    const listAItems = document.querySelectorAll('[data-list="list-a"]');
    const listBItems = document.querySelectorAll('[data-list="list-b"]');
    expect(observedFeedback).toBe(true);
    expect(crossedIntoTarget).toBe(true);
    expect(feedbackStayedMounted).toBe(true);
    expect(feedbackStayedSized).toBe(true);
    expect(feedbackStayedPopulated).toBe(true);
    expect(feedbackStayedVisible).toBe(true);
    expect(observedHiddenPlaceholder).toBe(true);
    expect(observedOverlay).toBe(false);
    expect(listAItems).toHaveLength(1);
    expect(listBItems).toHaveLength(3);
  });

  it('drops an item into an empty NeoList column', async () => {
    render(Harness as never, { props: { multiList: true, multiNeoList: true, emptyList: true } as never });
    const { source, zone } = await vi.waitFor(() => {
      const source = document.querySelector<HTMLElement>('[data-id="la-1"]');
      const zone = document.querySelector<HTMLElement>('[data-testid="drop-zone"][data-list="list-b"]');
      if (!source || !zone || !source.offsetHeight || !zone.offsetHeight) throw new Error('empty-list drag targets not ready');
      return { source, zone };
    });
    const sourceRect = source.getBoundingClientRect();
    const zoneRect = zone.getBoundingClientRect();
    const dx = zoneRect.left + zoneRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const dy = zoneRect.top + zoneRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

    await cdpDragBy(source, { x: dx, y: dy }, { steps: 20, stepDelay: 25, settle: 500 });

    expect(document.querySelectorAll('[data-list="list-a"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-list="list-b"]')).toHaveLength(1);
    expect(document.querySelector('[data-testid="drop-zone"][data-list="list-b"]')).toBeNull();
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

// ---------------------------------------------------------------------------
// Demo layout contract
// ---------------------------------------------------------------------------

describe('demoSortable — NeoList showcase layout', { tags: ['browser'] }, () => {
  it.each(['desktop', 'mobile'] as const)('contains section and multi-list sizing at %s width', async (viewport) => {
    await setViewport(viewport);
    quietForVisual();
    render(DemoSortable);

    const showcase = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.neo-list-sortable-showcase');
      if (!element || element.querySelectorAll('.showcase-col').length !== 4) throw new Error('showcase not mounted');
      return element;
    });
    await waitForVisualStability(showcase);

    const containers = [
      showcase,
      ...showcase.querySelectorAll<HTMLElement>('.showcase-col'),
      ...showcase.querySelectorAll<HTMLElement>('.showcase-list'),
      ...showcase.querySelectorAll<HTMLElement>('.showcase-multi-list'),
      ...showcase.querySelectorAll<HTMLElement>('.showcase-multi-col'),
    ];
    for (const container of containers) {
      expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth + 1);
      expect(container.scrollHeight).toBeLessThanOrEqual(container.clientHeight + 1);
    }

    const handleGroup = showcase.querySelector<HTMLElement>('.neo-handle-group')!;
    const handle = handleGroup.querySelector<HTMLElement>('.neo-handle')!;
    const content = Array.from(handleGroup.children).find(child => child !== handle) as HTMLElement;
    const groupRect = handleGroup.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    expect(handleRect.height).toBe(groupRect.height);
    expect(contentRect.left).toBeGreaterThanOrEqual(handleRect.right - 1);
    expect(contentRect.right).toBeLessThanOrEqual(groupRect.right + 1);
  });
});
