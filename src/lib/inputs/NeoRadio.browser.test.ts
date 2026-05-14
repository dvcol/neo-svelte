import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoRadioHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getNativeInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-radio-input');
}

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-radio-button');
}

describe('neoRadio — disabled (real browser)', () => {
  it('clicking the styled button on a disabled NeoRadio does not check the underlying input', async () => {
    const user = userEvent.setup();
    // Use a non-default value so Svelte 5 `bind:group` machinery does not
    // treat `undefined === undefined` (the default group) as a match, which
    // would render the input pre-checked regardless of `checked={false}`.
    const { container } = render(Harness, { props: { disabled: true, value: 'a' } as never });
    await tick();

    const input = getNativeInput(container)!;
    expect(input).not.toBeNull();
    expect(input.disabled).toBe(true);
    expect(input.checked).toBe(false);

    const button = getButton(container)!;
    expect(button).not.toBeNull();
    await user.click(button);
    await tick();

    expect(input.checked).toBe(false);
  });

  it('clicking the styled button on an enabled NeoRadio still checks the input', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, {});
    await tick();

    await user.click(getButton(container)!);
    await tick();

    expect(getNativeInput(container)?.checked).toBe(true);
  });
});
