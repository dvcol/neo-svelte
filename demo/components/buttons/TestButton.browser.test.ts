import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoButton from '~/buttons/NeoButton.svelte';

import VisualHarness from './TestButton.browser.test.svelte';

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

describe('neoButton — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('button family matrix (standard + iconic + layout wrappers)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { composite: true } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const blocks = stage.querySelectorAll<HTMLElement>('[data-block]');
      expect(blocks.length).toBe(3);
      for (const b of blocks) expect(b.getBoundingClientRect().width).toBeGreaterThan(0);
      const buttons = stage.querySelectorAll<HTMLElement>('.neo-button');
      expect(buttons.length).toBeGreaterThanOrEqual(15);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButton', 'matrix', 'desktop'),
    );
  });
});
