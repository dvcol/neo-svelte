import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSwitch from './NeoSwitch.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-switch-container');
}

function getNativeInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-switch-input');
}

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-switch-button');
}

describe('neoSwitch — render', { tags: ['jsdom'] }, () => {
  it('renders container, hidden native checkbox and styled switch button', async () => {
    const { container } = render(NeoSwitch, {});
    await tick();
    expect(getContainer(container)).not.toBeNull();
    const input = getNativeInput(container);
    expect(input?.type).toBe('checkbox');
    expect(input?.hidden).toBe(true);
    const button = getButton(container);
    expect(button).not.toBeNull();
    expect(button?.getAttribute('role')).toBe('switch');
  });

  it('renders a label when provided and links via for', async () => {
    const { container } = render(NeoSwitch, { props: { label: 'Notif', id: 'sw-1' } as never });
    await tick();
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(label?.textContent?.trim()).toBe('Notif');
    expect(label?.getAttribute('for')).toBe('sw-1');
  });

  it('checked=true reflects aria-checked=true on the button', async () => {
    const { container } = render(NeoSwitch, { props: { checked: true } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-checked')).toBe('true');
  });

  it('indeterminate=true reflects aria-checked="mixed"', async () => {
    const { container } = render(NeoSwitch, { props: { indeterminate: true } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-checked')).toBe('mixed');
  });
});

describe('neoSwitch — interaction', { tags: ['jsdom'] }, () => {
  it('clicking the switch button toggles checked through the native input', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSwitch, {});
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(true);
  });

  it('disabled blocks clicks from changing state', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSwitch, { props: { disabled: true } as never });
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(false);
  });

  it('loading=true renders the suffix loading icon', async () => {
    const { container } = render(NeoSwitch, { props: { loading: true } as never });
    await tick();
    expect(container.querySelector('.neo-switch-loading')).not.toBeNull();
  });
});
