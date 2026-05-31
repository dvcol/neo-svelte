import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestInput.browser.test.svelte';
import VisualHarnessGuarded from './TestInput.guarded.browser.test.svelte';
import VisualHarnessStates from './TestInput.states.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

async function mountAndStabilize(harness: typeof VisualHarness, expectedInputs: number): Promise<HTMLElement> {
  render(harness, { props: {} as never });
  const stage = await vi.waitFor(() => {
    const el = getStage();
    if (!el) throw new Error('stage not mounted');
    return el;
  });
  await vi.waitFor(() => {
    const inputs = stage.querySelectorAll<HTMLElement>('.neo-input');
    expect(inputs.length).toBe(expectedInputs);
    for (const i of inputs) expect(i.getBoundingClientRect().width).toBeGreaterThan(0);
  });
  await waitForVisualStability(stage);
  return stage;
}

describe('neoInput — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    await mountAndStabilize(VisualHarness, 15);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoInput', 'matrix', viewport),
    );
  });

  it('states grid — idle / hover / focus-visible / focus-within / active / disabled (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessStates, 6);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoInput', 'states', 'desktop'),
    );
  });

  it('guarded pairs — flat+borderless / inset-hover hovered / floating-label no-autofill (desktop)', async () => {
    await setViewport('desktop');
    await mountAndStabilize(VisualHarnessGuarded, 3);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoInput', 'guarded-pairs', 'desktop'),
    );
  });
});
