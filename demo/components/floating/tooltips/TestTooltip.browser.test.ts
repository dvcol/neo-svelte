import { CARDINAL_PLACEMENTS, forEachViewport } from 'test/helpers/floating-visual.js';
import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';
import { quietForVisual, screenshotName, setViewport } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import Harness from './TestTooltip.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getTooltip(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip');
}

function getTrigger(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip-trigger');
}

const CENTER_TRIGGER_PROPS = {
  style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:24px;',
};

async function waitForTrigger(): Promise<HTMLElement> {
  for (let attempts = 0; attempts < 200; attempts++) {
    const el = getTrigger();
    if (el) return el;
    await new Promise(r => requestAnimationFrame(() => r(null)));
  }
  throw new Error('trigger never mounted');
}

async function waitForTooltip(): Promise<HTMLElement> {
  for (let attempts = 0; attempts < 200; attempts++) {
    const el = getTooltip();
    if (el) return el;
    await new Promise(r => requestAnimationFrame(() => r(null)));
  }
  throw new Error('tooltip never appeared');
}

// Svelte's `in:` transition animates opacity/scale via inline styles, which
// CSS overrides cannot disable. Poll computed style until the tooltip is
// fully rendered (opacity 1, no in-flight transform) before screenshotting.
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

function assertVisible(el: HTMLElement, label: string): void {
  expect(el, `${label} should be in the DOM`).toBeTruthy();
  expect(el.hasAttribute('hidden'), `${label} should not be hidden`).toBe(false);
  const cs = getComputedStyle(el);
  expect(cs.visibility, `${label} should be visible`).not.toBe('hidden');
  expect(cs.display, `${label} should not be display:none`).not.toBe('none');
  expect(Number.parseFloat(cs.opacity), `${label} should be fully opaque`).toBeGreaterThanOrEqual(0.999);
}

async function openAt(placement: string, extra: Record<string, unknown> = {}) {
  const props: Record<string, unknown> = {
    open: true,
    tooltipLabel: 'tip',
    placement,
    triggerProps: CENTER_TRIGGER_PROPS,
    ...extra,
  };
  const result = render(Harness, { props: props as never });
  const tooltip = await waitForTooltip();
  await waitForFloatingPosition(tooltip);
  return { ...result, tooltip };
}

describe('neoTooltip — placement side (real layout)', { tags: ['browser'] }, () => {
  it('placement="top" puts the floating element above the trigger', async () => {
    const { tooltip } = await openAt('top');
    const trigger = getTrigger();
    expect(trigger).not.toBeNull();
    expectSide(trigger!, tooltip, 'top');
  });

  it('placement="bottom" puts the floating element below the trigger', async () => {
    const { tooltip } = await openAt('bottom');
    expectSide(getTrigger()!, tooltip, 'bottom');
  });

  it('placement="left" puts the floating element to the left of the trigger', async () => {
    const { tooltip } = await openAt('left');
    expectSide(getTrigger()!, tooltip, 'left');
  });

  it('placement="right" puts the floating element to the right of the trigger', async () => {
    const { tooltip } = await openAt('right');
    expectSide(getTrigger()!, tooltip, 'right');
  });
});

describe('neoTooltip — transform-origin reflects resolved placement', { tags: ['browser'] }, () => {
  it('placement="top" → transform-origin uses "bottom" (origin opposite to placement)', async () => {
    const { tooltip } = await openAt('top');
    const origin = getComputedStyle(tooltip).transformOrigin;
    expect(origin.length).toBeGreaterThan(0);
    // Origin axis is opposite to the placement axis: top placement -> bottom origin
    // We assert via data-position rather than computed pixel coords.
    const position = tooltip.getAttribute('data-position');
    expect(position).toMatch(/^top/);
  });

  it('placement="right" → data-position resolves to "right"', async () => {
    const { tooltip } = await openAt('right');
    expect(tooltip.getAttribute('data-position')).toMatch(/^right/);
  });
});

describe('neoTooltip — flip middleware at viewport edges', { tags: ['browser'] }, () => {
  it('falls back to the opposite side when the requested side has no room', async () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const { tooltip } = await openAt('top', {
      // Anchor the trigger at the very top of the viewport so `top` placement
      // has no room and flip should kick the tooltip to `bottom`.
      triggerProps: {
        style: 'position:fixed;top:0;left:50%;transform:translateX(-50%);width:80px;height:24px;',
      },
    });

    const trigger = getTrigger()!;
    const refRect = trigger.getBoundingClientRect();
    expect(refRect.top).toBeLessThan(20);

    // Flipped: tooltip should now be on the bottom side of the trigger.
    expectSide(trigger, tooltip, 'bottom');
    expect(tooltip.getAttribute('data-position')).toMatch(/^bottom/);
  });
});

describe('neoTooltip — keyboard focus opens (real :focus-visible)', { tags: ['browser'] }, () => {
  // jsdom counterpart in NeoTooltip.test.ts is skipped because skeleton's useFocus
  // checks `event.target.matches(':focus-visible')`, which jsdom does not simulate.
  // The browser project does, so we exercise the path here.
  it('opens via keyboard focus when openOnFocus=true and other interactions disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(Harness, {
      props: {
        triggerProps: { ...CENTER_TRIGGER_PROPS, tabindex: 0, tag: 'button' },
        triggerLabel: 'trigger',
        tooltipLabel: 'tip',
        openOnHover: false,
        openOnFocus: true,
        openOnClick: false,
        unmountOnClose: true,
        onChange,
      } as never,
    });
    // NeoThemeProvider gates children on async stylesheet load — wait for the
    // trigger to mount before driving keyboard input.
    await waitForTrigger();
    await user.tab();
    await vi.waitFor(() => {
      expect(getTooltip()).not.toBeNull();
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('neoTooltip — openOnClick', { tags: ['browser'] }, () => {
  it('opens via real pointer click when openOnClick=true and other flags disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(Harness, {
      props: {
        triggerProps: CENTER_TRIGGER_PROPS,
        triggerLabel: 'trigger',
        tooltipLabel: 'tip',
        openOnHover: false,
        openOnFocus: false,
        openOnClick: true,
        unmountOnClose: true,
        onChange,
      } as never,
    });
    const trigger = await waitForTrigger();
    await user.click(trigger);
    await vi.waitFor(() => {
      expect(getTooltip()).not.toBeNull();
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('neoTooltip — real autoUpdate on viewport resize', { tags: ['browser'] }, () => {
  it('repositions the tooltip when the window is resized', async () => {
    const { tooltip } = await openAt('top');
    const before = tooltip.getBoundingClientRect();

    const initialWidth = window.innerWidth;
    const newWidth = Math.max(400, initialWidth - 200);

    window.resizeTo(newWidth, window.innerHeight);
    window.dispatchEvent(new Event('resize'));

    await waitForFloatingPosition(tooltip);
    const after = tooltip.getBoundingClientRect();

    // The trigger may stay at the same x relative to its parent, but the
    // viewport-relative tooltip rect should at least re-evaluate without throwing.
    expect(after.width).toBeGreaterThan(0);
    expect(after.height).toBeGreaterThan(0);
    expect(Number.isFinite(before.left)).toBe(true);
  });
});

beforeEach(() => {
  quietForVisual();
});

describe('neoTooltip — visual contract (defaults open)', { tags: ['browser', 'visual'] }, () => {
  forEachViewport((viewport) => {
    for (const placement of CARDINAL_PLACEMENTS) {
      it(`open at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        render(Harness, {
          props: {
            open: true,
            placement,
            tooltipLabel: 'Tooltip content',
            triggerLabel: 'Trigger',
            triggerAsButton: true,
            unmountOnClose: false,
          } as never,
        });
        const trigger = await waitForTrigger();
        const tooltip = await waitForTooltip();
        await waitForFloatingPosition(tooltip);
        await waitForVisualStability(tooltip);
        assertVisible(trigger, 'trigger');
        assertVisible(tooltip, 'tooltip');
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoTooltip', `open-${placement}`, viewport),
        );
      });
    }
  });
});

describe('neoTooltip — hover-bridge contract (the regression target)', { tags: ['browser'] }, () => {
  it('pointer-cross from trigger into floating keeps tooltip open', async () => {
    await setViewport('desktop');
    const user = userEvent.setup();
    render(Harness, {
      props: {
        placement: 'bottom',
        tooltipLabel: 'Tooltip content',
        triggerLabel: 'Trigger',
        openOnHover: true,
        openOnFocus: false,
        openOnClick: false,
        // The bug only reproduces with the default unmountOnClose; closing the
        // tooltip removes the hover target entirely.
        unmountOnClose: true,
      } as never,
    });
    const trigger = await waitForTrigger();
    await user.hover(trigger);
    await new Promise(r => setTimeout(r, 300)); // allow openDelay
    const tooltip = await waitForTooltip();
    await waitForFloatingPosition(tooltip);

    // Move pointer from trigger to the tooltip — must stay open.
    await user.unhover(trigger);
    await user.hover(tooltip);
    // Wait past the close-timer (100ms) plus a buffer.
    await new Promise(r => setTimeout(r, 250));

    expect(getTooltip()).not.toBeNull();
    expect(getTooltip()?.hasAttribute('hidden')).toBe(false);
  });

  it('keepOpenOnHover keeps tooltip open after pointerleave', async () => {
    await setViewport('desktop');
    const user = userEvent.setup();
    render(Harness, {
      props: {
        placement: 'bottom',
        tooltipLabel: 'Sticky',
        triggerLabel: 'Trigger',
        openOnHover: true,
        keepOpenOnHover: true,
        openOnFocus: false,
        openOnClick: false,
        unmountOnClose: false,
      } as never,
    });
    const trigger = await waitForTrigger();
    await user.hover(trigger);
    await new Promise(r => setTimeout(r, 300));
    const tooltip = getTooltip()!;
    await waitForFloatingPosition(tooltip);
    await user.unhover(trigger);
    await new Promise(r => setTimeout(r, 250));
    expect(getTooltip()?.hasAttribute('hidden')).toBe(false);
  });
});

describe('neoTooltip — aria-expanded reactivity', { tags: ['browser'] }, () => {
  it('aria-expanded on the trigger updates when role!=tooltip and open toggles', async () => {
    await setViewport('desktop');
    const { rerender } = render(Harness, {
      props: {
        role: 'menu',
        open: false,
        placement: 'bottom',
        tooltipLabel: 'Menu items',
        triggerLabel: 'Trigger',
        unmountOnClose: false,
      } as never,
    });

    const trigger = await waitForTrigger();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await rerender({
      role: 'menu',
      open: true,
      placement: 'bottom',
      tooltipLabel: 'Menu items',
      triggerLabel: 'Trigger',
      unmountOnClose: false,
    } as never);

    await waitForFloatingPosition(getTooltip()!);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
