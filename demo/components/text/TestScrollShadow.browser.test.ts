import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestScrollShadow.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getShadow(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-scroll-shadow');
}

describe('neoScrollShadow — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('top edge — only bottom shadow visible (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'top' } as never });
    const shadow = await vi.waitFor(() => {
      const el = getShadow();
      if (!el) throw new Error('shadow not mounted');
      return el;
    });
    await waitForVisualStability(shadow);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoScrollShadow', 'matrix-top', 'desktop'),
    );
  });

  it('middle — top + bottom shadows visible (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'middle' } as never });
    const shadow = await vi.waitFor(() => {
      const el = getShadow();
      if (!el) throw new Error('shadow not mounted');
      return el;
    });
    await waitForVisualStability(shadow);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoScrollShadow', 'matrix-middle', 'desktop'),
    );
  });

  it('bottom edge — only top shadow visible (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'bottom' } as never });
    const shadow = await vi.waitFor(() => {
      const el = getShadow();
      if (!el) throw new Error('shadow not mounted');
      return el;
    });
    await waitForVisualStability(shadow);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoScrollShadow', 'matrix-bottom', 'desktop'),
    );
  });
});
