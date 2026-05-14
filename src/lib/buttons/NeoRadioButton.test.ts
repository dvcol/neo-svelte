import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoRadioButtonHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getRadio(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-radio-button');
}

describe('neoRadioButton — render', () => {
  it('renders <button role=radio> with aria-checked=false by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    const rb = getRadio(container);
    expect(rb).not.toBeNull();
    expect(rb?.getAttribute('role')).toBe('radio');
    expect(rb?.getAttribute('aria-checked')).toBe('false');
    expect(rb?.classList.contains('neo-checked')).toBe(false);
  });

  it('checked=true reflects aria-checked=true and .neo-checked', async () => {
    const { container } = render(Harness, { props: { checked: true } as never });
    await tick();
    const rb = getRadio(container);
    expect(rb?.getAttribute('aria-checked')).toBe('true');
    expect(rb?.classList.contains('neo-checked')).toBe(true);
  });

  it('disabled=true applies .neo-disabled', async () => {
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    expect(getRadio(container)?.classList.contains('neo-disabled')).toBe(true);
  });
});

describe('neoRadioButton — click toggles checked', () => {
  it('click on unchecked sets checked=true and aria-checked=true', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, {});
    await tick();
    const rb = getRadio(container)!;
    await user.click(rb);
    await tick();
    expect(rb.getAttribute('aria-checked')).toBe('true');
  });

  it('click on checked toggles back to unchecked', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { checked: true } as never });
    await tick();
    const rb = getRadio(container)!;
    await user.click(rb);
    await tick();
    expect(rb.getAttribute('aria-checked')).toBe('false');
  });

  it('disabled blocks click from changing state', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    const rb = getRadio(container)!;
    await user.click(rb);
    await tick();
    expect(rb.getAttribute('aria-checked')).toBe('false');
  });
});
