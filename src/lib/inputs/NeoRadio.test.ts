import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoRadio from './NeoRadio.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-radio-container');
}

function getNativeInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-radio-input');
}

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-radio-button');
}

describe('neoRadio — render', { tags: ['jsdom'] }, () => {
  it('renders container, hidden native radio and styled radio button', async () => {
    const { container } = render(NeoRadio, {});
    await tick();
    expect(getContainer(container)).not.toBeNull();
    const input = getNativeInput(container);
    expect(input?.type).toBe('radio');
    expect(input?.hidden).toBe(true);
    const button = getButton(container);
    expect(button).not.toBeNull();
    expect(button?.getAttribute('role')).toBe('radio');
  });

  it('renders a label when provided', async () => {
    const { container } = render(NeoRadio, { props: { label: 'Choice', id: 'r-1' } as never });
    await tick();
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(label?.textContent?.trim()).toBe('Choice');
    expect(label?.getAttribute('for')).toBe('r-1');
  });

  it('checked=true reflects aria-checked=true on the button', async () => {
    const { container } = render(NeoRadio, { props: { checked: true } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-checked')).toBe('true');
  });
});

describe('neoRadio — interaction', { tags: ['jsdom'] }, () => {
  it('clicking the radio button checks the native input', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoRadio, {});
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(true);
  });

  it('disabled blocks clicks from changing state', async () => {
    const user = userEvent.setup();
    // value=`'a'` keeps Svelte 5 `bind:group` from matching the default
    // `group === undefined`, which would otherwise render the input pre-checked.
    const { container } = render(NeoRadio, { props: { disabled: true, value: 'a' } as never });
    await tick();
    expect(getNativeInput(container)?.checked).toBe(false);
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(false);
  });

  it('disabled is reflected on the styled button class', async () => {
    const { container } = render(NeoRadio, { props: { disabled: true } as never });
    await tick();
    expect(getButton(container)?.classList.contains('neo-disabled')).toBe(true);
  });

  it('loading=true renders the suffix loading icon', async () => {
    const { container } = render(NeoRadio, { props: { loading: true } as never });
    await tick();
    expect(container.querySelector('.neo-radio-loading')).not.toBeNull();
  });
});
