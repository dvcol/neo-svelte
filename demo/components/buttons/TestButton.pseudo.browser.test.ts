import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestButton.pseudo.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
  if (!el) throw new Error('stage not mounted');
  return el;
}

function getTarget(selector = '[data-testid="target"]'): HTMLElement {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`${selector} not mounted`);
  return el;
}

describe('neoButton — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline grid (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoButton', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const btn = await vi.waitFor(() => getTarget());
    await userEvent.hover(btn);
    await waitForVisualStability(stage);
    // Whole-stage screenshot keeps the pointer parked over `target` so the
    // :hover state stays applied during capture.
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoButton', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus — mouse click (desktop)', async () => {
    // Mouse click sets :focus on the activeElement but NOT :focus-visible
    // (browsers reserve :focus-visible for keyboard/programmatic-from-keyboard
    // focus paths). This snapshot captures the cascade outcome of plain :focus
    // — distinct from focus-visible below if the component has separate rules.
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const btn = await vi.waitFor(() => getTarget());
    await userEvent.click(btn);
    // Move pointer off the target so :hover doesn't dominate the screenshot.
    await userEvent.hover(getTarget('[data-testid="target-disabled"]'));
    expect(document.activeElement).toBe(btn);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoButton', 'pseudo-focus', 'desktop'),
    );
  });

  it('focus-visible — keyboard tab (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await vi.waitFor(() => getTarget());
    // Tab once to `target-idle`, again to `target`. Real keyboard input
    // sets :focus-visible (vs el.focus() which only sets :focus).
    await userEvent.tab();
    await userEvent.tab();
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoButton', 'pseudo-focus-visible', 'desktop'),
    );
  });
});
