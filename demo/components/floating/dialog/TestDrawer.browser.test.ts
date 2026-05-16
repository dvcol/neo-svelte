import { forEachViewport } from 'test/helpers/floating-visual.js';
import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from '~/floating/drawer/NeoDrawer.test.svelte';

import VisualHarness from './TestDrawer.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDrawer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drawer .neo-dialog');
}

async function renderOpen(extra: Record<string, unknown> = {}) {
  const result = render(Harness, { props: { open: true, tag: 'div', unmountOnClose: false, ...extra } as never });
  const drawer = await vi.waitFor(() => {
    const el = getDrawer();
    if (!el) throw new Error('drawer not mounted');
    return el;
  }, { timeout: 1000, interval: 16 });
  return { ...result, drawer };
}

const SIDES = ['top', 'bottom', 'left', 'right'] as const;

describe('neoDrawer — placement (real layout)', { tags: ['browser'] }, () => {
  it.each(SIDES)('placement="%s" anchors the drawer flush against that edge of the viewport', async (side) => {
    await setViewport('desktop');
    const { drawer } = await renderOpen({ placement: side });
    const rect = drawer.getBoundingClientRect();
    expect(drawer.getAttribute('data-placement')).toBe(side);
    // Drawer should be flush to the corresponding edge.
    if (side === 'top') expect(rect.top).toBeLessThanOrEqual(1);
    if (side === 'bottom') expect(window.innerHeight - rect.bottom).toBeLessThanOrEqual(1);
    if (side === 'left') expect(rect.left).toBeLessThanOrEqual(1);
    if (side === 'right') expect(window.innerWidth - rect.right).toBeLessThanOrEqual(1);
  });

  it.each(SIDES)('strips the corner radius adjacent to the anchored edge for placement="%s"', async (side) => {
    const { drawer } = await renderOpen({ placement: side, rounded: true, full: false });
    const cs = getComputedStyle(drawer);
    // Each placement zeros out the two corners that touch the viewport edge.
    if (side === 'top') {
      expect(cs.borderTopLeftRadius).toBe('0px');
      expect(cs.borderTopRightRadius).toBe('0px');
    }
    if (side === 'bottom') {
      expect(cs.borderBottomLeftRadius).toBe('0px');
      expect(cs.borderBottomRightRadius).toBe('0px');
    }
    if (side === 'left') {
      expect(cs.borderTopLeftRadius).toBe('0px');
      expect(cs.borderBottomLeftRadius).toBe('0px');
    }
    if (side === 'right') {
      expect(cs.borderTopRightRadius).toBe('0px');
      expect(cs.borderBottomRightRadius).toBe('0px');
    }
  });
});

describe('neoDrawer — full size flag', { tags: ['browser'] }, () => {
  it.each(SIDES)('full=true (default) makes the drawer span the full viewport along the cross-axis for placement="%s"', async (side) => {
    await setViewport('desktop');
    const { drawer } = await renderOpen({ placement: side, full: true });
    const rect = drawer.getBoundingClientRect();
    if (side === 'top' || side === 'bottom') {
      expect(rect.width).toBeCloseTo(window.innerWidth, 0);
    } else {
      expect(rect.height).toBeCloseTo(window.innerHeight, 0);
    }
  });

  it('full=false keeps the drawer at its content size', async () => {
    await setViewport('desktop');
    const { drawer } = await renderOpen({ placement: 'right', full: false, width: '240px' });
    const rect = drawer.getBoundingClientRect();
    expect(rect.height).toBeLessThan(window.innerHeight);
  });
});

describe('neoDrawer — escape & outside click (modal forced on)', { tags: ['browser'] }, () => {
  it('escape closes a non-native drawer when closeOnClickOutside=true', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ placement: 'right', closeOnClickOutside: true, oncancel });
    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(getDrawer()?.getAttribute('data-open')).toBe('false');
    });
    expect(oncancel).toHaveBeenCalled();
  });

  // TODO: NeoDialog.svelte:152-155 (`onWindowKeydown`) closes the non-native
  // dialog on Escape regardless of `closedby`. Drawer always wraps NeoDialog
  // with tag !== 'dialog', so it inherits the bug — Escape must be a no-op
  // when closedby="none". Pinning expected behavior; unskip after fix.
  it.skip('escape is ignored when closedby="none"', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ placement: 'right', closedby: 'none', oncancel });
    await user.keyboard('{Escape}');
    await new Promise(r => setTimeout(r, 50));
    expect(getDrawer()?.getAttribute('data-open')).toBe('true');
    expect(oncancel).not.toHaveBeenCalled();
  });
});

describe('neoDrawer — focus restore (real focus)', { tags: ['browser'] }, () => {
  it('focuses the first focusable element inside the drawer when it opens', async () => {
    render(VisualHarness, { props: { open: true, tag: 'div', unmountOnClose: false, placement: 'right' } as never });
    const drawer = await vi.waitFor(() => {
      const el = getDrawer();
      if (!el) throw new Error('drawer not mounted');
      return el;
    }, { timeout: 1000, interval: 16 });
    await vi.waitFor(() => {
      expect(drawer.contains(document.activeElement)).toBe(true);
    }, { timeout: 500 });
  });
});

describe('neoDrawer — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  forEachViewport((viewport) => {
    for (const placement of SIDES) {
      it(`open at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        render(VisualHarness, {
          props: {
            open: true,
            tag: 'div',
            // unmountOnClose:true keeps the JS in:inFn transition path so the
            // wrapped NeoDialog actually fades to opacity 1; the CSS-only
            // [open]-gated path used when unmountOnClose:false never fires on
            // a non-native <div>, leaving the screenshot blank.
            unmountOnClose: true,
            placement,
            rounded: true,
            backdrop: true,
            full: true,
            // Without an explicit elevation, NeoDialog.svelte:514 strips
            // background/border/backdrop-filter, leaving an unstyled drawer.
            elevation: 2,
            // Default lorem-ipsum body in the harness — leaving bodyText
            // unset gives the snapshot rich, multi-paragraph content that
            // exercises the drawer's content-flow / scrolling / footer-gap.
          } as never,
        });
        const drawer = await vi.waitFor(() => {
          const el = getDrawer();
          if (!el) throw new Error('drawer not mounted');
          return el;
        });
        await waitForVisualStability(drawer);
        await vi.waitFor(() => {
          const cs = getComputedStyle(drawer);
          expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
          expect(drawer.getBoundingClientRect().width).toBeGreaterThan(0);
        });
        freezeSvgAnimations(drawer);
        await waitForVisualStability(drawer);
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoDrawer', `open-${placement}`, viewport),
        );
      });
    }
  });
});
