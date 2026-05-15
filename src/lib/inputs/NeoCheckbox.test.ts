import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoCheckbox from './NeoCheckbox.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-checkbox-container');
}

function getNativeInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-checkbox-input');
}

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-checkbox-button');
}

describe('neoCheckbox — render', { tags: ['jsdom'] }, () => {
  it('renders container, hidden native checkbox and styled button', async () => {
    const { container } = render(NeoCheckbox, {});
    await tick();
    expect(getContainer(container)).not.toBeNull();
    const input = getNativeInput(container);
    expect(input?.type).toBe('checkbox');
    expect(input?.hidden).toBe(true);
    expect(getButton(container)).not.toBeNull();
  });

  it('renders a label when provided and links it to the input via for', async () => {
    const { container } = render(NeoCheckbox, { props: { label: 'Accept', id: 'cb-1' } as never });
    await tick();
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(label?.textContent?.trim()).toBe('Accept');
    expect(label?.getAttribute('for')).toBe('cb-1');
  });

  it('reflects checked state on the styled button', async () => {
    const { container } = render(NeoCheckbox, { props: { checked: true } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-checked')).toBe('true');
  });

  it('reflects indeterminate via aria-checked="mixed"', async () => {
    const { container } = render(NeoCheckbox, { props: { indeterminate: true } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-checked')).toBe('mixed');
  });

  it('rounded=true applies .neo-rounded on the container', async () => {
    const { container } = render(NeoCheckbox, { props: { rounded: true } as never });
    await tick();
    expect(getContainer(container)?.classList.contains('neo-rounded')).toBe(true);
  });
});

describe('neoCheckbox — interaction', { tags: ['jsdom'] }, () => {
  it('clicking the button toggles checked through the native input', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCheckbox, {});
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(true);
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(false);
  });

  it('disabled blocks clicks from changing state', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCheckbox, { props: { disabled: true } as never });
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(getNativeInput(container)?.checked).toBe(false);
  });

  it('loading=true renders a loading icon, undefined omits the suffix', async () => {
    const { container, rerender } = render(NeoCheckbox, { props: { loading: true } as never });
    await tick();
    expect(container.querySelector('.neo-checkbox-loading')).not.toBeNull();
    expect(container.querySelector('.neo-checkbox-suffix')).not.toBeNull();
    await rerender({ loading: undefined } as never);
    await tick();
    expect(container.querySelector('.neo-checkbox-suffix')).toBeNull();
  });
});
