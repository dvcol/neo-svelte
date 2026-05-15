import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoNativeSelect from './NeoNativeSelect.svelte';

afterEach(() => {
  cleanup();
});

describe('neoNativeSelect — render', { tags: ['jsdom'] }, () => {
  it('renders <option> per options entry, supports {value} primitives', async () => {
    const { container } = render(NeoNativeSelect, {
      props: { options: ['a', 'b', { value: 'c', label: 'C-label' }] } as never,
    });
    await tick();
    const opts = container.querySelectorAll<HTMLOptionElement>('option');
    expect(opts).toHaveLength(3);
    expect(opts[0].value).toBe('a');
    expect(opts[1].value).toBe('b');
    expect(opts[2].value).toBe('c');
    expect(opts[2].textContent?.trim()).toBe('C-label');
  });

  it('uses option.label as text when provided, falls back to value', async () => {
    const { container } = render(NeoNativeSelect, {
      props: { options: [{ value: 'x' }, { value: 'y', label: 'Y' }] } as never,
    });
    await tick();
    const opts = container.querySelectorAll<HTMLOptionElement>('option');
    expect(opts[0].textContent?.trim()).toBe('x');
    expect(opts[1].textContent?.trim()).toBe('Y');
  });

  it('renders a toggle button (after-affix) by default', async () => {
    const { container } = render(NeoNativeSelect, {});
    await tick();
    expect(container.querySelector('button.neo-select-toggle')).not.toBeNull();
  });

  it('multiple=true hides the toggle and disables floating', async () => {
    const { container } = render(NeoNativeSelect, { props: { multiple: true } as never });
    await tick();
    expect(container.querySelector('button.neo-select-toggle')).toBeNull();
  });
});
