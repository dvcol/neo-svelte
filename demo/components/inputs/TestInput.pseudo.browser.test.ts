import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestInput.pseudo.browser.test.svelte';

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

describe('neoInput — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline grid (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoInput', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const input = await vi.waitFor(() => getTarget());
    await userEvent.hover(input);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoInput', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus-within — inner input focused (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await vi.waitFor(() => getTarget());
    // Find the underlying <input> in the second cell. NeoInput wraps the input
    // in several containers, so query globally and pick the second match
    // (target is the second cell).
    const inputs = document.querySelectorAll<HTMLInputElement>('input.neo-input, input[type="text"]');
    const inner = inputs[1] ?? inputs[0];
    expect(inner).toBeTruthy();
    inner.focus({ preventScroll: true });
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoInput', 'pseudo-focus-within', 'desktop'),
    );
  });
});
