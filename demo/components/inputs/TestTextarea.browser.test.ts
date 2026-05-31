import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestTextarea.browser.test.svelte';
import VisualHarnessGuarded from './TestTextarea.guarded.browser.test.svelte';
import VisualHarnessStates from './TestTextarea.states.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

async function mountAndStabilize(harness: typeof VisualHarness, expected: number): Promise<HTMLElement> {
  render(harness, { props: {} as never });
  const stage = await vi.waitFor(() => {
    const el = getStage();
    if (!el) throw new Error('stage not mounted');
    return el;
  });
  await vi.waitFor(() => {
    const ts = stage.querySelectorAll<HTMLElement>('.neo-textarea');
    expect(ts.length).toBe(expected);
    for (const t of ts) expect(t.getBoundingClientRect().width).toBeGreaterThan(0);
  });
  await waitForVisualStability(stage);
  return stage;
}

describe('neoTextarea — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    await mountAndStabilize(VisualHarness, 12);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTextarea', 'matrix', viewport),
    );
  });

  it('states grid — idle / hovered / focused / focus-within / pressed / disabled (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessStates, 6);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTextarea', 'states', 'desktop'),
    );
  });

  it('guarded pairs — flat+borderless / hover-flat hovered / floating empty (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessGuarded, 3);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTextarea', 'guarded-pairs', 'desktop'),
    );
  });
});
