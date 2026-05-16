import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestDialogConfirm.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

describe('neoDialogConfirm + neoDialogStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('confirm body — header / message / cancel + confirm buttons (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'confirm' } as never });
    const dialog = await vi.waitFor(() => {
      const el = getDialog();
      if (!el) throw new Error('dialog not mounted');
      return el;
    });
    await waitForVisualStability(dialog);
    await vi.waitFor(() => {
      const cs = getComputedStyle(dialog);
      expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
      expect(dialog.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoDialogConfirm', 'matrix', 'desktop'),
    );
  });

  it('stepper body — progress + active step layout (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'stepper' } as never });
    const dialog = await vi.waitFor(() => {
      const el = getDialog();
      if (!el) throw new Error('dialog not mounted');
      return el;
    });
    await vi.waitFor(() => {
      if (dialog.getBoundingClientRect().width <= 0) throw new Error('dialog not sized yet');
      const stepper = document.querySelector<HTMLElement>('.neo-floating-stepper');
      if (!stepper) throw new Error('stepper not mounted');
    }, { timeout: 3000, interval: 32 });
    await waitForVisualStability(dialog);
    await vi.waitFor(() => {
      const cs = getComputedStyle(dialog);
      expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
      expect(dialog.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoDialogStepper', 'matrix', 'desktop'),
    );
  });
});
