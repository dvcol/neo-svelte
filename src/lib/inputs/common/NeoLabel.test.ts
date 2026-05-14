import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoLabel from './NeoLabel.svelte';

afterEach(() => {
  cleanup();
});

function getLabel(scope: ParentNode = document): HTMLLabelElement | null {
  return scope.querySelector<HTMLLabelElement>('label.neo-label');
}

describe('neoLabel — render', () => {
  it('renders a <label> with .neo-label inside .neo-label-container', async () => {
    const { container } = render(NeoLabel, { props: { label: 'Email' } });
    await tick();
    expect(container.querySelector('.neo-label-container')).not.toBeNull();
    expect(getLabel(container)?.textContent?.trim()).toBe('Email');
  });

  it('passes for attribute through to <label>', async () => {
    const { container } = render(NeoLabel, { props: { label: 'L', for: 'my-id' } as never });
    await tick();
    expect(getLabel(container)?.getAttribute('for')).toBe('my-id');
  });

  it('required=true adds .neo-required (renders asterisk via ::after)', async () => {
    const { container } = render(NeoLabel, { props: { label: 'L', required: true } });
    await tick();
    expect(getLabel(container)?.classList.contains('neo-required')).toBe(true);
  });

  it('required not set leaves .neo-required off', async () => {
    const { container } = render(NeoLabel, { props: { label: 'L' } });
    await tick();
    expect(getLabel(container)?.classList.contains('neo-required')).toBe(false);
  });

  it('disabled=true adds .neo-disabled', async () => {
    const { container } = render(NeoLabel, { props: { label: 'L', disabled: true } });
    await tick();
    expect(getLabel(container)?.classList.contains('neo-disabled')).toBe(true);
  });

  it('valid=true → .neo-valid; valid=false → .neo-invalid; undefined → neither', async () => {
    const { container, rerender } = render(NeoLabel, { props: { label: 'L' } });
    await tick();
    let label = getLabel(container);
    expect(label?.classList.contains('neo-valid')).toBe(false);
    expect(label?.classList.contains('neo-invalid')).toBe(false);
    await rerender({ label: 'L', valid: true });
    await tick();
    label = getLabel(container);
    expect(label?.classList.contains('neo-valid')).toBe(true);
    expect(label?.classList.contains('neo-invalid')).toBe(false);
    await rerender({ label: 'L', valid: false });
    await tick();
    label = getLabel(container);
    expect(label?.classList.contains('neo-valid')).toBe(false);
    expect(label?.classList.contains('neo-invalid')).toBe(true);
  });

  it('containerProps.tag overrides the wrapper element', async () => {
    const { container } = render(NeoLabel, { props: { label: 'L', containerProps: { tag: 'span' } } });
    await tick();
    expect(container.querySelector('span.neo-label-container')).not.toBeNull();
  });
});

describe('neoLabel — for/click semantics', () => {
  it('clicking the label focuses the associated <input> via for', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoLabel, { props: { label: 'L', for: 'inp-1' } as never });
    await tick();
    const input = document.createElement('input');
    input.id = 'inp-1';
    document.body.appendChild(input);
    try {
      await user.click(getLabel(container)!);
      expect(document.activeElement).toBe(input);
    } finally {
      input.remove();
    }
  });
});
