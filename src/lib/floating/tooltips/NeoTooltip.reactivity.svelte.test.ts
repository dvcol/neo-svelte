import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, fireEvent, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { flushSync, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoTooltip.test.svelte';

afterEach(() => {
  cleanup();
});

function getTrigger(container: HTMLElement): HTMLElement {
  const node = container.querySelector<HTMLElement>('.neo-tooltip-trigger');
  if (!node) throw new Error('trigger not rendered');
  return node;
}

/**
 * Locks the contract that pass-through option props (`hoverOptions`,
 * `clickOptions`, `dismissOptions`, `options`) honor reactive getters at the
 * call site. Prior to this guarantee, NeoTooltip spread these props into the
 * interaction-options object, flattening getters into the values they
 * happened to hold on first render.
 */
describe('neoTooltip — pass-through option reactivity', { tags: ['jsdom'] }, () => {
  it('hoverOptions.enabled flip is observed after construction', async () => {
    let enabled = $state(false);
    const hoverOptions = {
      get enabled() {
        return enabled;
      },
    };

    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: true,
      openOnFocus: false,
      openOnClick: false,
      hoverDelay: 0,
      openDelay: 0,
      hoverOptions,
      onChange,
    });

    // hoverOptions.enabled=false wins over openOnHover=true → no open.
    await fireEvent.mouseEnter(getTrigger(container));
    await tick();
    expect(onChange).not.toHaveBeenCalled();

    // Flip the underlying signal; the getter on hoverOptions re-reads.
    enabled = true;
    flushSync();

    // mouseleave + mouseenter to retrigger (the previous mouseenter was
    // dropped while disabled and left no rest timer).
    await fireEvent.mouseLeave(getTrigger(container));
    await fireEvent.mouseEnter(getTrigger(container));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  it('dismissOptions.enabled flip is observed after construction', async () => {
    let enabled = $state(false);
    const dismissOptions = {
      get enabled() {
        return enabled;
      },
    };

    const onChange = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      // Both `closeOnDismiss=true` (component default) and dismissOptions.enabled
      // are honored — the override wins via `dismissOptions?.enabled ?? closeOnDismiss`.
      closeOnDismiss: true,
      dismissOptions,
      onChange,
    });
    await tick();
    onChange.mockClear();

    // dismissOptions.enabled=false suppresses dismiss.
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(onChange).not.toHaveBeenCalled();

    enabled = true;
    flushSync();

    await fireEvent.pointerDown(document.body);
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });
});

/**
 * Locks the `options.onOpenChange` pre-hook contract: the consumer's hook
 * runs before NeoTooltip's local handler, and `event.preventDefault()`
 * vetoes the local logic (no `keepOpenOn*` chain, no `bind:open` write).
 */
describe('neoTooltip — options.onOpenChange pre-hook', { tags: ['jsdom'] }, () => {
  it('pre-hook runs before the local onChange handler', async () => {
    const order: string[] = [];
    const preHook = vi.fn(() => order.push('pre'));
    const onChange = vi.fn(() => order.push('local'));
    const user = userEvent.setup();

    renderWithPortalTarget(Harness, {
      open: true,
      options: { onOpenChange: preHook },
      onChange,
    });
    await tick();
    onChange.mockClear();
    preHook.mockClear();
    order.length = 0;

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(preHook).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(false);
    });
    // preventDefault not called → both ran, in order.
    expect(order[0]).toBe('pre');
    expect(order.at(-1)).toBe('local');
  });

  it('preventDefault inside the pre-hook vetoes the local handler', async () => {
    const preHook = vi.fn((_open: boolean, event?: Event) => {
      event?.preventDefault();
    });
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithPortalTarget(Harness, {
      open: true,
      options: { onOpenChange: preHook },
      onChange,
    });
    await tick();
    onChange.mockClear();

    await user.keyboard('{Escape}');
    await tick();

    expect(preHook).toHaveBeenCalled();
    // The local handler's `open = _open` write triggers the `watch` effect
    // that calls onChange. With the veto in place, that write never lands.
    expect(onChange).not.toHaveBeenCalled();
  });
});

/**
 * Compile-time only: NeoTooltipProps['options'] no longer accepts
 * `middleware`, `interactions`, or `placement` — those are NeoTooltip-
 * internal or live on top-level props. These markers will fail TS if the
 * narrowing is ever loosened.
 */
describe('neoTooltip — options type narrowing (compile-time)', { tags: ['jsdom'] }, () => {
  it('rejects middleware / interactions / placement on options', () => {
    // @ts-expect-error options.middleware is not part of the narrowed surface
    const _middleware: NeoTooltipProps['options'] = { middleware: [] };
    // @ts-expect-error options.interactions is not part of the narrowed surface
    const _interactions: NeoTooltipProps['options'] = { interactions: [] };
    // @ts-expect-error options.placement is not part of the narrowed surface
    const _placement: NeoTooltipProps['options'] = { placement: 'top' };
    void _middleware;
    void _interactions;
    void _placement;
  });
});
