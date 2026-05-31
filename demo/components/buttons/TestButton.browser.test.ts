import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoButton from '~/buttons/NeoButton.svelte';

import VisualHarness from './TestButton.browser.test.svelte';
import VisualHarnessGuarded from './TestButton.guarded.browser.test.svelte';
import VisualHarnessStates from './TestButton.states.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-button');
}

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoButton — keyboard activation (real focus)', { tags: ['browser'] }, () => {
  it('enter on a focused button fires onclick', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(NeoButton, { props: { onclick } as never, target: document.body }, { children: () => 'Go' as never });
    const btn = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('button not mounted');
      return el;
    });
    btn.focus();
    expect(document.activeElement).toBe(btn);
    await user.keyboard('{Enter}');
    await vi.waitFor(() => {
      expect(onclick).toHaveBeenCalledTimes(1);
    });
  });

  it('disabled=true ignores click', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(NeoButton, { props: { onclick, disabled: true } as never });
    const btn = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('button not mounted');
      return el;
    });
    await user.click(btn);
    await new Promise(r => setTimeout(r, 50));
    expect(onclick).not.toHaveBeenCalled();
  });
});

async function mountAndWaitForButtons(harness: typeof VisualHarness, props: Record<string, unknown>, expectedButtons: number): Promise<HTMLElement> {
  render(harness, { props: props as never });
  const stage = await vi.waitFor(() => {
    const el = getStage();
    if (!el) throw new Error('stage not mounted');
    return el;
  });
  await vi.waitFor(() => {
    const buttons = stage.querySelectorAll<HTMLElement>('.neo-button');
    expect(buttons.length).toBeGreaterThanOrEqual(expectedButtons);
    for (const b of buttons) expect(b.getBoundingClientRect().width).toBeGreaterThan(0);
  });
  await waitForVisualStability(stage);
  return stage;
}

describe('neoButton — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    await mountAndWaitForButtons(VisualHarness, { composite: true }, 15);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButton', 'matrix', viewport),
    );
  });

  it('states grid — idle / hovered / focused / pressed / loading / disabled (desktop)', async () => {
    await setViewport('desktop');
    await mountAndWaitForButtons(VisualHarnessStates, {}, 6);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButton', 'states', 'desktop'),
    );
  });

  it('guarded pairs — flat+pressed / glass+disabled / loading+pressed (desktop)', async () => {
    await setViewport('desktop');
    await mountAndWaitForButtons(VisualHarnessGuarded, {}, 3);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButton', 'guarded-pairs', 'desktop'),
    );
  });
});
