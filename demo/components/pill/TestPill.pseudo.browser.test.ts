import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestPill.pseudo.browser.test.svelte';

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

describe('neoPill — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline grid (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoPill', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const p = await vi.waitFor(() => getTarget());
    await userEvent.hover(p);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoPill', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus-within (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const target = await vi.waitFor(() => getTarget());
    target.setAttribute('tabindex', '0');
    target.focus();
    expect(document.activeElement).toBe(target);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoPill', 'pseudo-focus-within', 'desktop'),
    );
  });
});
