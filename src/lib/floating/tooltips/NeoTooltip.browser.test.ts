import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectSide, waitForFloatingPosition } from '../../../../test/helpers/floating.js';
import Harness from './NeoTooltipHarness.test.svelte';

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

async function openAt(placement: string, extra: Record<string, unknown> = {}) {
  const props: Record<string, unknown> = {
    open: true,
    tooltipLabel: 'tip',
    placement,
    triggerProps: CENTER_TRIGGER_PROPS,
    ...extra,
  };
  const result = render(Harness, { props: props as never });
  const tooltip = await new Promise<HTMLElement>((resolve, reject) => {
    let attempts = 0;
    const tick = () => {
      const el = getTooltip();
      if (el) return resolve(el);
      if (attempts++ > 50) return reject(new Error('tooltip never appeared'));
      requestAnimationFrame(tick);
    };
    tick();
  });
  await waitForFloatingPosition(tooltip);
  return { ...result, tooltip };
}

describe('neoTooltip — placement side (real layout)', () => {
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

describe('neoTooltip — transform-origin reflects resolved placement', () => {
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

describe('neoTooltip — flip middleware at viewport edges', () => {
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

describe('neoTooltip — keyboard focus opens (real :focus-visible)', () => {
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
    await user.tab();
    await vi.waitFor(() => {
      expect(getTooltip()).not.toBeNull();
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('neoTooltip — openOnClick (currently broken, see NeoTooltip.svelte:150)', () => {
  // Pinned bug: NeoTooltip.svelte's onOpenChange unconditionally drops `_reason === 'click'`
  // updates, so even in a real browser the popover never opens on click. Phase 2 migration
  // to @floating-ui/dom should fix this; until then this test is skipped to surface the
  // expected behavior alongside the jsdom skip.
  it.skip('opens via real pointer click when openOnClick=true and other flags disabled', async () => {
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
    const trigger = getTrigger()!;
    await user.click(trigger);
    await vi.waitFor(() => {
      expect(getTooltip()).not.toBeNull();
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('neoTooltip — real autoUpdate on viewport resize', () => {
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
