import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@vitest/browser/context';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoSelect from '~/inputs/NeoSelect.svelte';

import VisualHarness from './TestSelect.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const options = ['alpha', 'bravo', 'charlie', 'delta'];

const CENTERED_CONTAINER_PROPS = {
  style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:200px;',
};

const BOTTOM_PINNED_CONTAINER_PROPS = {
  style: 'position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:200px;',
};

function getTrigger(): HTMLElement | null {
  // NeoSelect passes containerRef as the floating reference. NeoInput assigns
  // containerRef to its `.neo-input-group` element.
  return document.querySelector<HTMLElement>('.neo-input-group');
}

async function waitTrigger(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const el = getTrigger();
    if (!el) throw new Error('trigger not yet mounted');
    return el;
  }, { timeout: 1500, interval: 16 });
}

async function waitAffix(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const el = document.querySelector<HTMLElement>('.neo-select-toggle');
    if (!el) throw new Error('chevron toggle not yet mounted');
    return el;
  }, { timeout: 1500, interval: 16 });
}

async function openSelect(extra: Record<string, unknown> = {}) {
  const result = render(NeoSelect, {
    props: { options, open: true, ...extra } as never,
  });
  const dropdown = await vi.waitFor(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>('.neo-tooltip'));
    const visible = all.find(el => !el.hasAttribute('hidden'));
    if (!visible) throw new Error(`no visible tooltip among ${all.length}`);
    return visible;
  }, { timeout: 1500, interval: 16 });
  await waitForFloatingPosition(dropdown);
  return { ...result, dropdown };
}

describe('neoSelect — dropdown layout (real DOM)', { tags: ['browser'] }, () => {
  it('opens the dropdown below the trigger by default', async () => {
    const { dropdown } = await openSelect({
      containerProps: CENTERED_CONTAINER_PROPS,
    });
    const trigger = getTrigger();
    expect(trigger).not.toBeNull();
    expectSide(trigger!, dropdown, 'bottom');
  });

  it('flips above the trigger when pinned to the viewport bottom edge', async () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const { dropdown } = await openSelect({
      containerProps: BOTTOM_PINNED_CONTAINER_PROPS,
    });
    const trigger = getTrigger()!;
    const refRect = trigger.getBoundingClientRect();
    expect(window.innerHeight - refRect.bottom).toBeLessThan(40);
    expectSide(trigger, dropdown, 'top');
  });
});

function visibleTooltip(): HTMLElement | null {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-tooltip')).find(el => !el.hasAttribute('hidden')) ?? null;
}

async function waitVisible(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const el = visibleTooltip();
    if (!el) throw new Error('tooltip not visible');
    return el;
  }, { timeout: 1500, interval: 16 });
}

async function waitHidden(): Promise<void> {
  await vi.waitFor(() => {
    if (visibleTooltip()) throw new Error('tooltip still visible');
  }, { timeout: 1500, interval: 16 });
}

describe('neoSelect — interaction regressions (post-popover-migration)', { tags: ['browser'] }, () => {
  it('deselecting a pill in multi mode does not crash the runtime', async () => {
    const errors: string[] = [];
    const originalError = console.error;
    const onError = (event: ErrorEvent) => {
      errors.push(`window.onerror: ${event.message ?? String(event.error)}`);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      errors.push(`unhandledrejection: ${String(event.reason)}`);
    };
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(' '));
      originalError(...args);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    try {
      render(VisualHarness, {
        props: { multiple: true, pillContent: true, initialValue: ['apple', 'banana'] } as never,
      });
      const trigger = await waitTrigger();
      await userEvent.click(trigger);
      const dropdown = await waitVisible();
      await waitForFloatingPosition(dropdown);
      const apple = dropdown.querySelector<HTMLElement>('button[data-value="apple"], .neo-list-item[data-value="apple"]')
        ?? Array.from(dropdown.querySelectorAll<HTMLElement>('.neo-list-item, button')).find(el => /apple/i.test(el.textContent ?? ''));
      expect(apple, 'apple option').toBeTruthy();
      await userEvent.click(apple!);
      await new Promise(r => setTimeout(r, 250));
      const runtimeErrors = errors.filter(e => /TypeError|ReferenceError|effect|lifecycle|teardown|destroyed|get_fn/i.test(e));
      expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
    } finally {
      console.error = originalError;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    }
  });

  it('chevron affix toggles open/closed on each click', async () => {
    render(VisualHarness, { props: { openOnFocus: false } as never });
    const affix = await waitAffix();
    await userEvent.click(affix);
    await waitVisible();
    await userEvent.click(affix);
    await waitHidden();
    await userEvent.click(affix);
    await waitVisible();
  });

  it('search keeps the popover open while focused', async () => {
    render(VisualHarness, { props: { openOnFocus: false, search: true } as never });
    const affix = await waitAffix();
    await userEvent.click(affix);
    const dropdown = await waitVisible();
    const searchInput = dropdown.querySelector<HTMLInputElement>('input');
    expect(searchInput).toBeTruthy();
    searchInput!.focus();
    await userEvent.keyboard('app');
    await new Promise(r => setTimeout(r, 50));
    expect(visibleTooltip()).not.toBeNull();
  });

  it('outside click dismisses the popover', async () => {
    render(VisualHarness, { props: { openOnFocus: false } as never });
    const affix = await waitAffix();
    await userEvent.click(affix);
    await waitVisible();
    await userEvent.click(document.body);
    await waitHidden();
  });

  // TODO: pending fix for Issue 1 (`get_fn(...) is not a function` during
  // teardown of pill content snippet when three NeoSelects share the same
  // `bind:value`). Root cause: a `$derived` somewhere in the
  // NeoSelect/NeoInput/NeoPill teardown path is read after its parent effect
  // is INERT (Svelte's `derived_inert` warning fires), so `get_fn()` returns
  // UNINITIALIZED and the transition machinery calls a non-function. The
  // surface fix attempted earlier (eagerly capturing transitions in NeoPill)
  // hid the symptom in this case but the same crash reproduces when toggling
  // `glass` on the live DemoInputs page — so the real culprit is upstream.
  // Expected once fixed: no runtime errors.
  it.skip('deselecting a pill with three NeoSelects sharing the same value state does not crash', async () => {
    // DemoInputs binds the same `selectCustomMultipleState.value` to three
    // NeoSelect instances (default display, function display, content snippet).
    // Deselecting a pill in any of them re-renders all three; this is the
    // configuration that surfaces the get_fn(...) crash users reported.
    const errors: string[] = [];
    const originalError = console.error;
    const onError = (event: ErrorEvent) => {
      errors.push(`window.onerror: ${event.message ?? String(event.error)}`);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      errors.push(`unhandledrejection: ${String(event.reason)}`);
    };
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(' '));
      originalError(...args);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    try {
      render(VisualHarness, {
        props: { sharedTriple: true, openOnFocus: false, initialValue: ['apple', 'banana'] } as never,
      });
      await waitTrigger();
      // Use the third NeoSelect (with content snippet).
      const allTriggers = Array.from(document.querySelectorAll<HTMLElement>('.neo-input-group'));
      expect(allTriggers.length).toBeGreaterThanOrEqual(3);
      const trigger = allTriggers[2];
      await userEvent.click(trigger);
      const dropdown = await waitVisible();
      await waitForFloatingPosition(dropdown);
      const apple = dropdown.querySelector<HTMLElement>('button[data-value="apple"], .neo-list-item[data-value="apple"]')
        ?? Array.from(dropdown.querySelectorAll<HTMLElement>('.neo-list-item, button')).find(el => /apple/i.test(el.textContent ?? ''));
      expect(apple, 'apple option').toBeTruthy();
      await userEvent.click(apple!);
      await new Promise(r => setTimeout(r, 250));
      const runtimeErrors = errors.filter(e => /TypeError|ReferenceError|effect|lifecycle|teardown|destroyed|get_fn/i.test(e));
      expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
    } finally {
      console.error = originalError;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    }
  });

  it('alternating affix → input → affix clicks toggle the dropdown each time (openOnFocus=true)', async () => {
    // Regression: focus interaction with focusWithin:true used to fire during pointerdown,
    // contaminating popover.openEvent.type to 'focusin'. The trailing click then bailed
    // its toggle path (openEvent.type !== 'click'), requiring two clicks per state change.
    render(VisualHarness, { props: { openOnFocus: true } as never });
    const affix = await waitAffix();
    const trigger = await waitTrigger();
    await userEvent.click(affix);
    await waitVisible();
    await userEvent.click(trigger);
    await waitHidden();
    await userEvent.click(affix);
    await waitVisible();
  });
});
