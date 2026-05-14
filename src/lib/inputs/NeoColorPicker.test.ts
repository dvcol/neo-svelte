import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoColorPicker from './NeoColorPicker.svelte';

afterEach(() => {
  cleanup();
});

function getTextInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input[type="text"]');
}

function getColor(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-color-picker');
}

describe('neoColorPicker — render', () => {
  it('renders a <input type="text"> for the hex value and a color selector', async () => {
    const { container } = render(NeoColorPicker, {});
    await tick();
    expect(getTextInput(container)).not.toBeNull();
    expect(getColor(container)).not.toBeNull();
  });

  it('uses default hex pattern, minlength and maxlength', async () => {
    const { container } = render(NeoColorPicker, {});
    await tick();
    const input = getTextInput(container)!;
    expect(input.minLength).toBe(7);
    expect(input.maxLength).toBe(7);
    expect(input.pattern).toBeTruthy();
  });

  it('renders the toggle picker button by default', async () => {
    const { container } = render(NeoColorPicker, {});
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Toggle picker"]');
    expect(btn).not.toBeNull();
  });

  it('placeholder defaults to "Pick a color"', async () => {
    const { container } = render(NeoColorPicker, {});
    await tick();
    expect(getTextInput(container)?.placeholder).toBe('Pick a color');
  });
});
