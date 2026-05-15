import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoRange from '~/inputs/NeoRange.svelte';

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
