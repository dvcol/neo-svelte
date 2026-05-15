import { CARDINAL_PLACEMENTS, forEachViewport } from 'test/helpers/floating-visual.js';
import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';
import { quietForVisual, screenshotName, setViewport } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from './TestPopSelect.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getTooltip(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip');
}

function getTrigger(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip-trigger');
}

async function waitForTrigger(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const el = getTrigger();
    if (!el) throw new Error('trigger not mounted');
    return el;
  }, { timeout: 1500, interval: 16 });
}

async function waitForOpenTooltip(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const el = getTooltip();
    if (!el) throw new Error('tooltip not mounted');
    if (el.hasAttribute('hidden')) throw new Error('tooltip still hidden');
    return el;
  }, { timeout: 2000, interval: 16 });
}

describe('neoPopSelect — placement (real layout)', { tags: ['browser'] }, () => {
  it('opens below the trigger by default at desktop viewport', async () => {
    await setViewport('desktop');
    const user = userEvent.setup();
    render(Harness, { props: {} as never });
    const trigger = await waitForTrigger();
    await user.hover(trigger);
    const tooltip = await waitForOpenTooltip();
    await waitForFloatingPosition(tooltip);
    expectSide(trigger, tooltip, 'bottom');
  });

  it('honors placement="top"', async () => {
    await setViewport('desktop');
    const user = userEvent.setup();
    render(Harness, { props: { placement: 'top' } as never });
    const trigger = await waitForTrigger();
    await user.hover(trigger);
    const tooltip = await waitForOpenTooltip();
    await waitForFloatingPosition(tooltip);
    expectSide(trigger, tooltip, 'top');
  });
});

describe('neoPopSelect — hover-bridge contract', { tags: ['browser'] }, () => {
  it('pointer-cross from trigger into the popover keeps it open', async () => {
    await setViewport('desktop');
    const user = userEvent.setup();
    render(Harness, { props: { placement: 'bottom' } as never });
    const trigger = await waitForTrigger();
    await user.hover(trigger);
    const tooltip = await waitForOpenTooltip();
    await waitForFloatingPosition(tooltip);

    // Move from trigger into the popover content.
    await user.unhover(trigger);
    await user.hover(tooltip);
    await new Promise(r => setTimeout(r, 250));

    expect(getTooltip()?.hasAttribute('hidden')).toBe(false);
  });
});

async function waitForVisualStability(el: HTMLElement, timeoutMs = 1500): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    const cs = getComputedStyle(el);
    const opacity = Number.parseFloat(cs.opacity);
    const transform = cs.transform;
    const stable = opacity >= 0.999 && (transform === 'none' || /matrix\(1,\s*0,\s*0,\s*1/.test(transform));
    if (stable) return;
    await new Promise(r => requestAnimationFrame(() => r(null)));
  }
}

describe('neoPopSelect — visual contract (open + cardinal placements)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });
  forEachViewport((viewport) => {
    for (const placement of CARDINAL_PLACEMENTS) {
      it(`open at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        render(Harness, {
          props: { open: true, placement, openOnHover: false, openOnFocus: false, openOnClick: false, unmountOnClose: false } as never,
        });
        const tooltip = await vi.waitFor(() => {
          const el = getTooltip();
          if (!el) throw new Error('tooltip not mounted');
          if (el.hasAttribute('hidden')) throw new Error('tooltip still hidden');
          return el;
        }, { timeout: 1500, interval: 16 });
        await waitForFloatingPosition(tooltip);
        await waitForVisualStability(tooltip);
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoPopSelect', `open-${placement}`, viewport),
        );
      });
    }
  });
});
