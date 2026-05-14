import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectSide, waitForFloatingPosition } from '../../../test/helpers/floating.js';
import Harness from './NeoSelectHarness.test.svelte';

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
  // NeoSelect.svelte:241 passes containerRef as the floating reference. NeoInput
  // assigns containerRef to its `.neo-input-group` element (NeoInput.svelte:350)
  // and NeoSelect overrides containerProps.tag to `'button'` (NeoSelect.svelte:228).
  return document.querySelector<HTMLElement>('button.neo-input-group');
}

async function openSelect(extra: Record<string, unknown> = {}) {
  const result = render(Harness, {
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

describe('neoSelect — dropdown layout (real DOM)', () => {
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
