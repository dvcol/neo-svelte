import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NeoRadio from '~/inputs/NeoRadio.svelte';

import VisualHarness from './TestRadio.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getNativeInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-radio-input');
}

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-radio-button');
}

describe('neoRadio — disabled (real browser)', { tags: ['browser'] }, () => {
  it('clicking the styled button on a disabled NeoRadio does not check the underlying input', async () => {
    const user = userEvent.setup();
    // Use a non-default value so Svelte 5 `bind:group` machinery does not
    // treat `undefined === undefined` (the default group) as a match, which
    // would render the input pre-checked regardless of `checked={false}`.
    const { container } = render(NeoRadio, { props: { disabled: true, value: 'a' } as never });
    await tick();

    const input = getNativeInput(container)!;
    expect(input).not.toBeNull();
    expect(input.disabled).toBe(true);
    expect(input.checked).toBe(false);

    const button = getButton(container)!;
    expect(button).not.toBeNull();
    await user.click(button);
    await tick();

    expect(input.checked).toBe(false);
  });

  it('clicking the styled button on an enabled NeoRadio still checks the input', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoRadio, {});
    await tick();

    await user.click(getButton(container)!);
    await tick();

    expect(getNativeInput(container)?.checked).toBe(true);
  });
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoRadio — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('checked / disabled × glass / tinted / sharp / required / loading matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const radios = stage.querySelectorAll<HTMLElement>('.neo-radio-container');
      expect(radios.length).toBe(13);
      for (const r of radios) expect(r.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    // NeoIconRadio uses chained SMIL <animate> to draw the dot — wait then
    // freeze so the indicator is fully rendered before snapshot capture.
    await new Promise(r => setTimeout(r, 800));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoRadio', 'matrix', 'desktop'),
    );
  });
});
