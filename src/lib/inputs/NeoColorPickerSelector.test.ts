import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoColorPickerSelector from './NeoColorPickerSelector.svelte';

afterEach(() => {
  cleanup();
});

function getColor(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-color-picker');
}

describe('neoColorPickerSelector', () => {
  it('renders an <input type="color">', async () => {
    const { container } = render(NeoColorPickerSelector, { props: { value: '#abcdef' } as never });
    await tick();
    expect(getColor(container)?.type).toBe('color');
    expect(getColor(container)?.value).toBe('#abcdef');
  });

  it('rounded=true applies .neo-rounded', async () => {
    const { container } = render(NeoColorPickerSelector, { props: { value: '#000000', rounded: true } as never });
    await tick();
    expect(getColor(container)?.classList.contains('neo-rounded')).toBe(true);
  });

  it('forwards height prop as inline style', async () => {
    const { container } = render(NeoColorPickerSelector, { props: { value: '#000000', height: '2rem' } as never });
    await tick();
    expect(getColor(container)?.style.height).toBe('2rem');
  });

  it('disabled and readonly are reflected on the input', async () => {
    const { container } = render(NeoColorPickerSelector, { props: { value: '#000000', disabled: true, readonly: true } as never });
    await tick();
    const input = getColor(container)!;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
  });
});
