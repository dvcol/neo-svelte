import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoSwitch from '~/inputs/NeoSwitch.svelte';

import VisualHarness from './TestSwitch.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getInput(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>('input.neo-switch-button-checkbox')
    ?? document.querySelector<HTMLInputElement>('input[type="checkbox"].neo-input');
}

function getButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-switch-button');
}

describe('neoSwitch — click toggle (real pointer)', { tags: ['browser'] }, () => {
  it('clicking the switch surface toggles checked', async () => {
    const user = userEvent.setup();
    render(NeoSwitch, { props: { checked: false } as never });
    const button = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('switch not mounted');
      return el;
    });
    expect(getInput()?.checked).toBe(false);
    await user.click(button);
    await vi.waitFor(() => {
      expect(getInput()?.checked).toBe(true);
    });
    await user.click(button);
    await vi.waitFor(() => {
      expect(getInput()?.checked).toBe(false);
    });
  });

  it('space on the focused switch button toggles checked', async () => {
    const user = userEvent.setup();
    render(NeoSwitch, { props: { checked: false } as never });
    const button = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('switch not mounted');
      return el;
    });
    button.focus();
    await user.keyboard(' ');
    await vi.waitFor(() => {
      expect(getInput()?.checked).toBe(true);
    });
  });

  it('disabled=true ignores clicks', async () => {
    const user = userEvent.setup();
    render(NeoSwitch, { props: { checked: false, disabled: true } as never });
    const button = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('switch not mounted');
      return el;
    });
    await user.click(button);
    await new Promise(r => setTimeout(r, 50));
    expect(getInput()?.checked).toBe(false);
  });
});

describe('neoSwitch — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES.flatMap(v => (['off', 'on'] as const).map(s => [v, s] as const)))(
    '%s (%s)',
    async (viewport: ViewportName, state: 'off' | 'on') => {
      await setViewport(viewport);
      render(VisualHarness, { props: { checked: state === 'on', label: `switch-${state}`, rounded: true } as never });
      const button = await vi.waitFor(() => {
        const el = getButton();
        if (!el) throw new Error('switch not mounted');
        return el;
      });
      await waitForVisualStability(button);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoSwitch', state, viewport),
      );
    },
  );
});
