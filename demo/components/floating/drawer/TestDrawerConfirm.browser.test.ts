import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestDrawerConfirm.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDrawer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drawer .neo-dialog');
}

describe('neoDrawerConfirm + neoDrawerStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('confirm body — header / message / cancel + confirm buttons (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'confirm' } as never });
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
      screenshotName('NeoDrawerConfirm', 'matrix', 'desktop'),
    );
  });

  it('stepper body — progress + active step layout (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'stepper' } as never });
    const drawer = await vi.waitFor(() => {
      const el = getDrawer();
      if (!el) throw new Error('drawer not mounted');
      return el;
    });
    await vi.waitFor(() => {
      if (drawer.getBoundingClientRect().width <= 0) throw new Error('drawer not sized yet');
      const stepper = document.querySelector<HTMLElement>('.neo-floating-stepper');
      if (!stepper) throw new Error('stepper not mounted');
    }, { timeout: 3000, interval: 32 });
    await waitForVisualStability(drawer);
    await vi.waitFor(() => {
      const cs = getComputedStyle(drawer);
      expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
      expect(drawer.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    freezeSvgAnimations(drawer);
    await waitForVisualStability(drawer);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoDrawerStepper', 'matrix', 'desktop'),
    );
  });
});
