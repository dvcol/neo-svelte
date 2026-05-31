import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestCard.browser.test.svelte';
import VisualHarnessGuarded from './TestCard.guarded.browser.test.svelte';
import VisualHarnessStates from './TestCard.states.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

async function mountAndStabilize(harness: typeof VisualHarness, harnessProps: Record<string, unknown>, expectedCards: number): Promise<HTMLElement> {
  render(harness, { props: harnessProps as never });
  const stage = await vi.waitFor(() => {
    const el = getStage();
    if (!el) throw new Error('stage not mounted');
    return el;
  });
  await vi.waitFor(() => {
    const cards = stage.querySelectorAll<HTMLElement>('.neo-card');
    expect(cards.length).toBe(expectedCards);
    for (const c of cards) expect(c.getBoundingClientRect().width).toBeGreaterThan(0);
  });
  await waitForVisualStability(stage);
  return stage;
}

describe('neoCard — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    await mountAndStabilize(VisualHarness, { composite: true }, 6);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoCard', 'matrix', viewport),
    );
  });

  it('states grid — idle / hovered / focused / disabled / skeleton (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessStates, {}, 5);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoCard', 'states', 'desktop'),
    );
  });

  it('guarded pairs — flat+borderless / glass+inset / segmented+cover (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessGuarded, {}, 3);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoCard', 'guarded-pairs', 'desktop'),
    );
  });
});
