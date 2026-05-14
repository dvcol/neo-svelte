import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoCheckboxButtonHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getCheckbox(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-checkbox-button');
}

describe('neoCheckboxButton — render', () => {
  it('renders a <button role=checkbox> with aria-checked=false by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    const cb = getCheckbox(container);
    expect(cb).not.toBeNull();
    expect(cb?.getAttribute('role')).toBe('checkbox');
    expect(cb?.getAttribute('aria-checked')).toBe('false');
    expect(cb?.classList.contains('neo-checked')).toBe(false);
  });

  it('checked=true reflects aria-checked=true and .neo-checked', async () => {
    const { container } = render(Harness, { props: { checked: true } as never });
    await tick();
    const cb = getCheckbox(container);
    expect(cb?.getAttribute('aria-checked')).toBe('true');
    expect(cb?.classList.contains('neo-checked')).toBe(true);
  });

  it('indeterminate=true reflects aria-checked="mixed" and .neo-checked', async () => {
    const { container } = render(Harness, { props: { indeterminate: true } as never });
    await tick();
    const cb = getCheckbox(container);
    expect(cb?.getAttribute('aria-checked')).toBe('mixed');
    expect(cb?.classList.contains('neo-checked')).toBe(true);
  });

  it('disabled=true applies .neo-disabled', async () => {
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    expect(getCheckbox(container)?.classList.contains('neo-disabled')).toBe(true);
  });
});

describe('neoCheckboxButton — click cycles state', () => {
  it('click on unchecked toggles to checked, sets touched=true, leaves aria-checked=true', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, {});
    await tick();
    const cb = getCheckbox(container)!;
    await user.click(cb);
    await tick();
    expect(cb.getAttribute('aria-checked')).toBe('true');
  });

  it('click on checked toggles back to unchecked', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { checked: true } as never });
    await tick();
    const cb = getCheckbox(container)!;
    await user.click(cb);
    await tick();
    expect(cb.getAttribute('aria-checked')).toBe('false');
  });

  it('click on indeterminate clears indeterminate and sets checked=true', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { indeterminate: true } as never });
    await tick();
    const cb = getCheckbox(container)!;
    expect(cb.getAttribute('aria-checked')).toBe('mixed');
    await user.click(cb);
    await tick();
    // clicking flips checked from false→true and clears indeterminate
    expect(cb.getAttribute('aria-checked')).toBe('true');
  });

  it('disabled prevents click from changing state', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    const cb = getCheckbox(container)!;
    await user.click(cb);
    await tick();
    expect(cb.getAttribute('aria-checked')).toBe('false');
  });
});

describe('neoCheckboxButton — onclick passthrough', () => {
  it('onclick prop fires on every click, regardless of checked state', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { onclick } as never });
    await tick();
    const cb = getCheckbox(container)!;
    await user.click(cb);
    await user.click(cb);
    expect(onclick).toHaveBeenCalledTimes(2);
  });

  it('disabled does not block onclick prop (browser-level click still occurs since aria-only)', async () => {
    // The component only guards internal state on disabled; onclick attr fires still.
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { disabled: true, onclick } as never });
    await tick();
    await user.click(getCheckbox(container)!);
    expect(onclick).toHaveBeenCalled();
  });
});
