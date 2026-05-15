import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoSwitchButton from './NeoSwitchButton.svelte';

afterEach(() => {
  cleanup();
});

function getSwitch(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-switch-button');
}

describe('neoSwitchButton — render', { tags: ['jsdom'] }, () => {
  it('renders <button role=switch> with aria-checked=false by default', async () => {
    const { container } = render(NeoSwitchButton, {});
    await tick();
    const sw = getSwitch(container);
    expect(sw).not.toBeNull();
    expect(sw?.getAttribute('role')).toBe('switch');
    expect(sw?.getAttribute('aria-checked')).toBe('false');
  });

  it('checked=true reflects aria-checked=true and .neo-checked', async () => {
    const { container } = render(NeoSwitchButton, { props: { checked: true } as never });
    await tick();
    const sw = getSwitch(container);
    expect(sw?.getAttribute('aria-checked')).toBe('true');
    expect(sw?.classList.contains('neo-checked')).toBe(true);
  });

  it('indeterminate=true reflects aria-checked="mixed" and .neo-indeterminate', async () => {
    const { container } = render(NeoSwitchButton, { props: { indeterminate: true } as never });
    await tick();
    const sw = getSwitch(container);
    expect(sw?.getAttribute('aria-checked')).toBe('mixed');
    expect(sw?.classList.contains('neo-indeterminate')).toBe(true);
  });

  it('valid=true applies .neo-valid; valid=false applies .neo-invalid', async () => {
    const { container, rerender } = render(NeoSwitchButton, { props: { valid: true } as never });
    await tick();
    expect(getSwitch(container)?.classList.contains('neo-valid')).toBe(true);
    expect(getSwitch(container)?.classList.contains('neo-invalid')).toBe(false);
    await rerender({ valid: false } as never);
    await tick();
    expect(getSwitch(container)?.classList.contains('neo-valid')).toBe(false);
    expect(getSwitch(container)?.classList.contains('neo-invalid')).toBe(true);
  });
});

describe('neoSwitchButton — click toggles', { tags: ['jsdom'] }, () => {
  it('click flips checked, clears indeterminate', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSwitchButton, { props: { indeterminate: true } as never });
    await tick();
    const sw = getSwitch(container)!;
    expect(sw.getAttribute('aria-checked')).toBe('mixed');
    await user.click(sw);
    await tick();
    expect(sw.getAttribute('aria-checked')).toBe('true');
    expect(sw.classList.contains('neo-indeterminate')).toBe(false);
  });

  it('click on checked flips back to unchecked', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSwitchButton, { props: { checked: true } as never });
    await tick();
    const sw = getSwitch(container)!;
    await user.click(sw);
    await tick();
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('disabled blocks click from changing state', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSwitchButton, { props: { disabled: true } as never });
    await tick();
    const sw = getSwitch(container)!;
    await user.click(sw);
    await tick();
    expect(sw.getAttribute('aria-checked')).toBe('false');
    expect(sw.classList.contains('neo-disabled')).toBe(true);
  });
});

describe('neoSwitchButton — onclick passthrough', { tags: ['jsdom'] }, () => {
  it('onclick prop fires per click', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoSwitchButton, { props: { onclick } as never });
    await tick();
    await user.click(getSwitch(container)!);
    await user.click(getSwitch(container)!);
    expect(onclick).toHaveBeenCalledTimes(2);
  });
});
