import type { NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoInputHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input');
}

function getGroup(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-input-group');
}

describe('neoInput — render', () => {
  it('renders an <input> wrapped in .neo-input-group', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getGroup(container)).not.toBeNull();
    expect(getInput(container)).not.toBeNull();
  });

  it('renders a label when label string is provided', async () => {
    const { container } = render(Harness, { props: { label: 'Email', id: 'inp-email' } as never });
    await tick();
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(label).not.toBeNull();
    expect(label?.textContent?.trim()).toBe('Email');
    expect(label?.getAttribute('for')).toBe('inp-email');
  });

  it('auto-generates an id when none provided and label uses it', async () => {
    const { container } = render(Harness, { props: { label: 'L' } as never });
    await tick();
    const input = getInput(container)!;
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(input.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input.id);
  });

  it('exposes data-touched/data-dirty/data-valid on the group', async () => {
    const { container } = render(Harness, {});
    await tick();
    const group = getGroup(container)!;
    expect(group.dataset.touched).toBe('false');
    expect(group.dataset.dirty).toBe('false');
  });

  it('floating defaults to true and switches off once value is present', async () => {
    const { container, rerender } = render(Harness, { props: { label: 'L' } as never });
    await tick();
    let labelContainer = container.querySelector<HTMLElement>('.neo-label-container');
    expect(labelContainer?.classList.contains('neo-floating')).toBe(true);
    await rerender({ label: 'L', value: 'hi' } as never);
    await tick();
    labelContainer = container.querySelector<HTMLElement>('.neo-label-container');
    expect(labelContainer?.classList.contains('neo-floating')).toBe(false);
  });
});

describe('neoInput — bindable state flips', () => {
  it('focusing the input flips touched=true and focused=true', async () => {
    const onfocus = vi.fn();
    const { container } = render(Harness, { props: { onfocus } as never });
    await tick();
    const input = getInput(container)!;
    input.focus();
    await tick();
    expect(onfocus).toHaveBeenCalledTimes(1);
    expect(getGroup(container)?.dataset.touched).toBe('true');
  });

  it('typing flips dirty when dirtyOnInput=true', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { dirtyOnInput: true, value: '' } as never });
    await tick();
    const input = getInput(container)!;
    await user.type(input, 'a');
    await tick();
    expect(getGroup(container)?.dataset.dirty).toBe('true');
  });

  it('validateOnInput=true updates valid on each input', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { required: true, validateOnInput: true, value: '' } as never });
    await tick();
    const input = getInput(container)!;
    await user.type(input, 'x');
    await tick();
    expect(getGroup(container)?.dataset.valid).toBe('true');
  });
});

describe('neoInput — clearable', () => {
  it('clearable adds an affix clear button when input has value and is focused', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { clearable: true, value: 'hi' } as never });
    await tick();
    await user.click(getInput(container)!);
    await new Promise(resolve => setTimeout(resolve, 150));
    await tick();
    expect(container.querySelector('button.neo-affix-clear')).not.toBeNull();
  });

  it('clicking clear button resets value', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { clearable: true, value: 'hi' } as never });
    await tick();
    await user.click(getInput(container)!);
    await new Promise(resolve => setTimeout(resolve, 150));
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button.neo-affix-clear')!;
    await user.click(btn);
    await tick();
    expect(getInput(container)?.value).toBe('');
  });

  it('disabled prevents the clearable button from appearing', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { clearable: true, value: 'hi', disabled: true } as never });
    await tick();
    // disabled inputs cannot be focused, but hover should still gate visibility off via debounced affix
    await user.hover(getGroup(container)!);
    await new Promise(resolve => setTimeout(resolve, 150));
    await tick();
    expect(container.querySelector('button.neo-affix-clear')).toBeNull();
  });
});

describe('neoInput — affix snippets / before / after', () => {
  it('aria-invalid is wired on the input from valid state', async () => {
    const { container, rerender } = render(Harness, {});
    await tick();
    expect(getInput(container)?.hasAttribute('aria-invalid')).toBe(false);
    await rerender({ valid: false } as never);
    await tick();
    expect(getInput(container)?.getAttribute('aria-invalid')).toBe('true');
  });

  it('aria-describedby points at the validation message id when validation visible', async () => {
    const { container } = render(Harness, {
      props: { validation: true, valid: false, message: 'help' } as never,
    });
    await tick();
    const desc = container.querySelector<HTMLElement>('.neo-validation-description, .neo-validation-error');
    const input = getInput(container)!;
    expect(input.getAttribute('aria-describedby')).toBe(desc?.id);
  });
});

describe('neoInput — methods passthrough on ref', () => {
  it('ref exposes mark/clear/change/validate', async () => {
    const { container } = render(Harness, {});
    await tick();
    const input = getInput(container) as NeoInputHTMLElement;
    expect(typeof input.mark).toBe('function');
    expect(typeof input.clear).toBe('function');
    expect(typeof input.change).toBe('function');
    expect(typeof input.validate).toBe('function');
  });

  it('change() updates input value and validates', async () => {
    const { container } = render(Harness, { props: { required: true } as never });
    await tick();
    const input = getInput(container) as NeoInputHTMLElement;
    const state = await input.change!('hello');
    expect(input.value).toBe('hello');
    expect(state.valid).toBe(true);
  });
});

describe('neoInput — disabled / readonly', () => {
  it('disabled adds .neo-disabled to the group and disables input', async () => {
    const { container } = render(Harness, { props: { disabled: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-disabled')).toBe(true);
    expect(getInput(container)?.disabled).toBe(true);
  });

  it('readonly adds .neo-readonly to the group and readonly to input', async () => {
    const { container } = render(Harness, { props: { readonly: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-readonly')).toBe(true);
    expect(getInput(container)?.readOnly).toBe(true);
  });
});

describe('neoInput — style flags', () => {
  it('rounded=true sets .neo-rounded on the group', async () => {
    const { container } = render(Harness, { props: { rounded: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-rounded')).toBe(true);
  });

  it('glass=true sets .neo-glass on the group', async () => {
    const { container } = render(Harness, { props: { glass: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-glass')).toBe(true);
  });

  it('tinted=true sets .neo-tinted on the group', async () => {
    const { container } = render(Harness, { props: { tinted: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-tinted')).toBe(true);
  });

  it('skeleton=true sets .neo-skeleton on the group', async () => {
    const { container } = render(Harness, { props: { skeleton: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-skeleton')).toBe(true);
  });

  it('borderless=true sets .neo-borderless on the group', async () => {
    const { container } = render(Harness, { props: { borderless: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-borderless')).toBe(true);
  });
});
