import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoNumberStep from './NeoNumberStep.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input-number-step');
}

function getButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('button.neo-button'));
}

describe('neoNumberStep — render', { tags: ['jsdom'] }, () => {
  it('renders a number input wrapped in .neo-number-step', async () => {
    const { container } = render(NeoNumberStep, {});
    await tick();
    const input = getInput(container);
    expect(input).not.toBeNull();
    expect(input?.type).toBe('number');
  });

  it('renders an increment and decrement button (aria-labels)', async () => {
    const { container } = render(NeoNumberStep, {});
    await tick();
    const labels = getButtons(container).map(b => b.getAttribute('aria-label'));
    expect(labels).toContain('Increment number');
    expect(labels).toContain('Decrement number');
  });

  it('uses the default placeholder', async () => {
    const { container } = render(NeoNumberStep, {});
    await tick();
    expect(getInput(container)?.placeholder).toBe('0');
  });

  it('defaultValue propagates as the initial value', async () => {
    const { container } = render(NeoNumberStep, { props: { defaultValue: 5 } as never });
    await tick();
    expect(getInput(container)?.value).toBe('5');
  });
});

describe('neoNumberStep — interaction', { tags: ['jsdom'] }, () => {
  it('increment button increases value by step and fires onStepUp', async () => {
    const onStepUp = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoNumberStep, { props: { defaultValue: 0, step: 2, onStepUp } as never });
    await tick();
    const inc = getButtons(container).find(b => b.getAttribute('aria-label') === 'Increment number')!;
    await user.click(inc);
    await tick();
    expect(getInput(container)?.value).toBe('2');
    expect(onStepUp).toHaveBeenCalledTimes(1);
  });

  it('decrement button decreases value by step and fires onStepDown', async () => {
    const onStepDown = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoNumberStep, { props: { defaultValue: 10, step: 3, onStepDown } as never });
    await tick();
    const dec = getButtons(container).find(b => b.getAttribute('aria-label') === 'Decrement number')!;
    await user.click(dec);
    await tick();
    expect(getInput(container)?.value).toBe('7');
    expect(onStepDown).toHaveBeenCalledTimes(1);
  });

  it('disabled prevents stepping the value', async () => {
    const onStepUp = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoNumberStep, { props: { defaultValue: 0, disabled: true, onStepUp } as never });
    await tick();
    const inc = getButtons(container).find(b => b.getAttribute('aria-label') === 'Increment number')!;
    await user.click(inc);
    await tick();
    expect(getInput(container)?.value).toBe('0');
    expect(onStepUp).not.toHaveBeenCalled();
  });
});
