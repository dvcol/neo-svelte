import { CARDINAL_PLACEMENTS, forEachViewport } from 'test/helpers/floating-visual.js';
import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';
import { quietForVisual, screenshotName, setViewport } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NeoRange from '~/inputs/NeoRange.svelte';

import VisualHarness from './TestRange.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const CENTERED_CONTAINER_PROPS = {
  style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:240px;',
};

const BOTTOM_PINNED_CONTAINER_PROPS = {
  style: 'position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:240px;',
};

function getHandle(): HTMLElement {
  const el = document.querySelector<HTMLElement>('.neo-range-handle');
  if (!el) throw new Error('range handle not found');
  return el;
}

function getTooltip(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-range-value');
}

async function focusHandle() {
  const handle = getHandle();
  handle.focus();
  return vi.waitFor(() => {
    const el = getTooltip();
    if (!el) throw new Error('tooltip never appeared after focus');
    return el;
  }, { timeout: 1000, interval: 16 });
}

describe('neoRange — tooltip layout (real DOM)', { tags: ['browser'] }, () => {
  it('shows the value tooltip below the handle when the range has room below', async () => {
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    const tooltip = await focusHandle();
    await waitForFloatingPosition(tooltip);
    expectSide(getHandle(), tooltip, 'bottom');
  });

  it('flips above the handle when the range is pinned to the bottom edge', async () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, containerProps: BOTTOM_PINNED_CONTAINER_PROPS } as never,
    });
    const tooltip = await focusHandle();
    await waitForFloatingPosition(tooltip);
    const handle = getHandle();
    const refRect = handle.getBoundingClientRect();
    expect(window.innerHeight - refRect.bottom).toBeLessThan(40);
    expectSide(handle, tooltip, 'top');
  });

  it('renders both lower and upper tooltips for dual-handle ranges', async () => {
    render(NeoRange, {
      props: { value: [2, 8], min: 0, max: 10, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    const handles = document.querySelectorAll<HTMLElement>('.neo-range-handle');
    expect(handles).toHaveLength(2);
    handles[0].focus();
    await vi.waitFor(() => {
      const tooltips = document.querySelectorAll<HTMLElement>('.neo-range-value');
      expect(tooltips).toHaveLength(2);
    });
  });

  it('tooltips=false suppresses the floating value display on focus', async () => {
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, tooltips: false, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    getHandle().focus();
    // Wait long enough that, if a tooltip were going to appear, it would have.
    await new Promise(r => setTimeout(r, 100));
    expect(getTooltip()).toBeNull();
  });
});

describe('neoRange — keyboard step sync', { tags: ['browser'] }, () => {
  it('arrow-right increments value and shifts the tooltip rightward', async () => {
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    const tooltip = await focusHandle();
    await waitForFloatingPosition(tooltip);
    const initialLeft = tooltip.getBoundingClientRect().left;
    const initialText = tooltip.textContent?.trim();
    expect(initialText).toContain('5');

    // 5 ArrowRight presses → should advance to 10 (capped at max).
    // NeoRange's step handler scales by a "holding" multiplier across rapid
    // repeats, so dispatch keyup between presses to keep each step at 1.
    const handle = getHandle();
    for (let i = 0; i < 5; i++) {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      handle.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
    }

    await vi.waitFor(() => {
      const text = tooltip.textContent?.trim() ?? '';
      if (!/(?:^|\D)10(?:\D|$)/.test(text)) throw new Error(`tooltip text not updated: ${text}`);
    }, { timeout: 1000, interval: 16 });

    await waitForFloatingPosition(tooltip);
    const finalLeft = tooltip.getBoundingClientRect().left;
    // Tooltip moved right (value went from 5 to 10 on a 0..10 range).
    expect(finalLeft).toBeGreaterThan(initialLeft);
  });

  it('arrow-left decrements value and shifts the tooltip leftward', async () => {
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    const tooltip = await focusHandle();
    await waitForFloatingPosition(tooltip);
    const initialLeft = tooltip.getBoundingClientRect().left;

    const handle = getHandle();
    for (let i = 0; i < 3; i++) {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      handle.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft', bubbles: true }));
    }

    await vi.waitFor(() => {
      const text = tooltip.textContent?.trim() ?? '';
      if (!/(?:^|\D)2(?:\D|$)/.test(text)) throw new Error(`tooltip text not updated: ${text}`);
    }, { timeout: 1000, interval: 16 });

    await waitForFloatingPosition(tooltip);
    const finalLeft = tooltip.getBoundingClientRect().left;
    expect(finalLeft).toBeLessThan(initialLeft);
  });
});

describe('neoRange — thumb hover surface', { tags: ['browser'] }, () => {
  it('opens the value tooltip on pointer hover (no focus required)', async () => {
    render(NeoRange, {
      props: { value: 5, min: 0, max: 10, containerProps: CENTERED_CONTAINER_PROPS } as never,
    });
    const handle = getHandle();
    handle.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    handle.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    const tooltip = await vi.waitFor(() => {
      const el = getTooltip();
      if (!el) throw new Error('tooltip never appeared on hover');
      return el;
    }, { timeout: 1000, interval: 16 });

    await waitForFloatingPosition(tooltip);
    expect(tooltip.getBoundingClientRect().width).toBeGreaterThan(0);
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

describe('neoRange — visual contract (single thumb + cardinal placements)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });
  forEachViewport((viewport) => {
    for (const placement of CARDINAL_PLACEMENTS) {
      it(`tooltip at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        render(VisualHarness, {
          props: { placement } as never,
        });
        const handle = await vi.waitFor(() => {
          const el = document.querySelector<HTMLElement>('.neo-range-handle');
          if (!el) throw new Error('range handle not mounted');
          return el;
        }, { timeout: 1500, interval: 16 });
        handle.focus();
        const tooltip = await vi.waitFor(() => {
          const el = document.querySelector<HTMLElement>('.neo-range-value');
          if (!el) throw new Error('tooltip not visible after focus');
          return el;
        }, { timeout: 1500, interval: 16 });
        await waitForFloatingPosition(tooltip);
        await waitForVisualStability(tooltip);
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoRange', `single-${placement}`, viewport),
        );
      });
    }
  });
});

describe('neoRange — visual contract (dual thumb)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });
  forEachViewport((viewport) => {
    it(`dual tooltips visible (${viewport})`, async () => {
      await setViewport(viewport);
      render(VisualHarness, {
        props: { dual: true, placement: 'top' } as never,
      });
      const handle = await vi.waitFor(() => {
        const el = document.querySelector<HTMLElement>('.neo-range-handle');
        if (!el) throw new Error('range handle not mounted');
        return el;
      }, { timeout: 1500, interval: 16 });
      handle.focus();
      await vi.waitFor(() => {
        const tips = document.querySelectorAll<HTMLElement>('.neo-range-value');
        if (tips.length < 2) throw new Error(`expected ≥2 tooltips, got ${tips.length}`);
      }, { timeout: 1500, interval: 16 });
      const tips = Array.from(document.querySelectorAll<HTMLElement>('.neo-range-value'));
      for (const tip of tips) {
        await waitForFloatingPosition(tip);
        await waitForVisualStability(tip);
      }
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoRange', 'dual', viewport),
      );
    });
  });
});
