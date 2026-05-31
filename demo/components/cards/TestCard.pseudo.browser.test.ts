import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestCard.pseudo.browser.test.svelte';

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

describe('neoCard — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline grid (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCard', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const card = await vi.waitFor(() => getTarget());
    await userEvent.hover(card);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCard', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus-within — descendant focus (desktop)', async () => {
    // NeoCard has `:focus-within` rules; force it by focusing a descendant.
    // We use the close button if present, else a programmatic focus on the
    // card itself (which is non-focusable, so we synthesize tabindex).
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const card = await vi.waitFor(() => getTarget());
    card.setAttribute('tabindex', '0');
    card.focus();
    expect(document.activeElement).toBe(card);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCard', 'pseudo-focus-within', 'desktop'),
    );
  });
});
