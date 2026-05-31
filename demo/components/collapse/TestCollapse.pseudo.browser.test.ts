import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestCollapse.pseudo.browser.test.svelte';

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

describe('neoCollapse — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline grid (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCollapse', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await vi.waitFor(() => getTarget());
    // data-testid lands on the collapsed <section> (aria-hidden=true). Hover
    // its visible trigger button instead, which is what users actually hover.
    const triggers = document.querySelectorAll<HTMLElement>('.neo-collapse-trigger');
    const trigger = triggers[1] ?? triggers[0];
    await userEvent.hover(trigger);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCollapse', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus-within — trigger focused (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const target = await vi.waitFor(() => getTarget());
    const trigger = target.querySelector<HTMLElement>('.neo-collapse-trigger');
    trigger?.focus({ preventScroll: true });
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoCollapse', 'pseudo-focus-within', 'desktop'),
    );
  });
});
