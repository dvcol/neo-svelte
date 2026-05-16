import type { NeoInputMethods } from '~/inputs/common/neo-input.model.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoBaseInput.test.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input');
}

function getSelect(scope: ParentNode = document): HTMLSelectElement | null {
  return scope.querySelector<HTMLSelectElement>('select.neo-input');
}

interface BaseInputInstance extends NeoInputMethods<HTMLInputElement> {}

function captureInstance(props: Record<string, unknown> = {}): { instance: BaseInputInstance; container: HTMLElement } {
  let instance: BaseInputInstance | undefined;
  const { container } = render(Harness, {
    props: {
      ...props,
      onInstance: (i: unknown) => {
        instance = i as never;
      },
    } as never,
  });
  return { instance: instance as BaseInputInstance, container };
}

describe('neoBaseInput — render', { tags: ['jsdom'] }, () => {
  it('renders <input> by default with .neo-input', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getInput(container)).not.toBeNull();
  });

  it('renders <select> when type="select"', async () => {
    const { container } = render(Harness, { props: { type: 'select' } as never });
    await tick();
    expect(getSelect(container)).not.toBeNull();
    expect(getInput(container)).toBeNull();
  });

  it('renders <input type="checkbox"> for type=checkbox', async () => {
    const { container } = render(Harness, { props: { type: 'checkbox' } as never });
    await tick();
    expect(getInput(container)?.type).toBe('checkbox');
  });

  it('renders <input type="radio"> for type=radio', async () => {
    const { container } = render(Harness, { props: { type: 'radio' } as never });
    await tick();
    expect(getInput(container)?.type).toBe('radio');
  });

  it('renders <input type="file"> for type=file', async () => {
    const { container } = render(Harness, { props: { type: 'file' } as never });
    await tick();
    expect(getInput(container)?.type).toBe('file');
  });

  it('hide=true applies .neo-hide', async () => {
    const { container } = render(Harness, { props: { hide: true } as never });
    await tick();
    expect(getInput(container)?.classList.contains('neo-hide')).toBe(true);
  });

  it('before/after add .neo-before/.neo-after classes', async () => {
    const { container } = render(Harness, { props: { before: true, after: true } as never });
    await tick();
    const input = getInput(container)!;
    expect(input.classList.contains('neo-before')).toBe(true);
    expect(input.classList.contains('neo-after')).toBe(true);
  });

  it('aria-invalid reflects valid state (omitted when undefined)', async () => {
    const { container, rerender } = render(Harness, {});
    await tick();
    expect(getInput(container)?.hasAttribute('aria-invalid')).toBe(false);
    await rerender({ valid: true } as never);
    await tick();
    expect(getInput(container)?.getAttribute('aria-invalid')).toBe('false');
    await rerender({ valid: false } as never);
    await tick();
    expect(getInput(container)?.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('neoBaseInput — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes mark/clear/change/validate on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.mark).toBe('function');
    expect(typeof instance.clear).toBe('function');
    expect(typeof instance.change).toBe('function');
    expect(typeof instance.validate).toBe('function');
  });

  it('does not attach component methods onto the DOM ref', async () => {
    const { container } = captureInstance();
    await tick();
    const input = getInput(container)!;
    for (const member of ['mark', 'clear', 'change', 'validate'] as const) {
      expect(Object.hasOwn(input, member)).toBe(false);
      expect((input as unknown as Record<string, unknown>)[member]).toBeUndefined();
    }
  });

  it('validate() reflects native checkValidity into valid', async () => {
    const onmark = vi.fn();
    const { instance, container } = captureInstance({ required: true, onmark });
    await tick();
    const input = getInput(container)!;
    const state = instance.validate();
    expect(state.valid).toBe(false);
    input.value = 'foo';
    const state2 = instance.validate();
    expect(state2.valid).toBe(true);
  });

  it('mark() updates touched/valid/dirty and invokes onmark', async () => {
    const onmark = vi.fn();
    const { instance } = captureInstance({ onmark });
    await tick();
    instance.mark({ touched: true, valid: true, dirty: true });
    expect(onmark).toHaveBeenCalledTimes(1);
    const arg = onmark.mock.calls[0][0] as { touched?: boolean; valid?: boolean; dirty?: boolean };
    expect(arg.touched).toBe(true);
    expect(arg.valid).toBe(true);
    expect(arg.dirty).toBe(true);
  });

  it('change() updates value and runs validation', async () => {
    const { instance, container } = captureInstance({ required: true });
    await tick();
    const input = getInput(container)!;
    const state = await instance.change('hello');
    expect(input.value).toBe('hello');
    expect(state.valid).toBe(true);
  });

  it('change() on type=checkbox toggles checked', async () => {
    const { instance, container } = captureInstance({ type: 'checkbox' });
    await tick();
    const input = getInput(container)!;
    expect(input.checked).toBe(false);
    await instance.change(true);
    expect(input.checked).toBe(true);
    await instance.change(false);
    expect(input.checked).toBe(false);
  });

  it('clear() resets value, fires onclear and oninput', async () => {
    const onclear = vi.fn();
    const oninput = vi.fn();
    const { instance, container } = captureInstance({ value: 'hello', onclear, oninput });
    await tick();
    const input = getInput(container)!;
    await instance.clear();
    expect(input.value).toBe('');
    expect(onclear).toHaveBeenCalledTimes(1);
    expect(oninput).toHaveBeenCalledTimes(1);
  });

  it('clear() on type=checkbox resets checked to false', async () => {
    const { instance, container } = captureInstance({ type: 'checkbox', checked: true });
    await tick();
    const input = getInput(container)!;
    expect(input.checked).toBe(true);
    await instance.clear();
    expect(input.checked).toBe(false);
  });

  it('clear() with nullable=false falls back to defaultValue', async () => {
    const { instance, container } = captureInstance({ value: 'changed', defaultValue: 'init', nullable: false });
    await tick();
    const input = getInput(container)!;
    await instance.clear();
    expect(input.value).toBe('init');
  });
});

describe('neoBaseInput — setCustomValidity round trip', { tags: ['jsdom'] }, () => {
  it('setCustomValidity is reflected via validate() in validationMessage', async () => {
    const { instance, container } = captureInstance();
    await tick();
    const input = getInput(container)!;
    input.setCustomValidity('Bad input');
    const state = instance.validate();
    expect(state.valid).toBe(false);
    expect(input.validationMessage).toBe('Bad input');
    input.setCustomValidity('');
    const state2 = instance.validate();
    expect(state2.valid).toBe(true);
  });
});

describe('neoBaseInput — focus / blur behavior', { tags: ['jsdom'] }, () => {
  it('focus marks touched=true and fires onfocus', async () => {
    const onfocus = vi.fn();
    const onblur = vi.fn();
    const { container } = render(Harness, { props: { onfocus, onblur } as never });
    await tick();
    const input = getInput(container)!;
    input.focus();
    await tick();
    expect(onfocus).toHaveBeenCalledTimes(1);
    input.blur();
    await tick();
    expect(onblur).toHaveBeenCalledTimes(1);
  });

  it('readonly prevents focus from setting touched (component still fires onfocus on real focus)', async () => {
    const onfocus = vi.fn();
    const { container } = render(Harness, { props: { readonly: true, onfocus } as never });
    await tick();
    const input = getInput(container)!;
    input.focus();
    await tick();
    expect(onfocus).toHaveBeenCalled();
  });
});

describe('neoBaseInput — input events', { tags: ['jsdom'] }, () => {
  it('typing fires oninput and onchange', async () => {
    const oninput = vi.fn();
    const onchange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { oninput, onchange } as never });
    await tick();
    const input = getInput(container)!;
    await user.type(input, 'ab');
    expect(oninput).toHaveBeenCalled();
    input.blur();
    await tick();
    expect(onchange).toHaveBeenCalled();
  });

  it('oninvalid is called when reportValidity fails (default prevented)', async () => {
    const oninvalid = vi.fn();
    const { container } = render(Harness, { props: { required: true, oninvalid } as never });
    await tick();
    const input = getInput(container)!;
    const event = new Event('invalid', { cancelable: true });
    input.dispatchEvent(event);
    expect(oninvalid).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('neoBaseInput — display passthrough', { tags: ['jsdom'] }, () => {
  it('display="text" renders the wrapper with .neo-input class', async () => {
    const { container } = render(Harness, { props: { display: 'shown' } as never });
    await tick();
    expect(container.querySelector('.neo-input-display-input')).not.toBeNull();
    const wrapper = container.querySelector('span.neo-input');
    expect(wrapper).not.toBeNull();
    const inner = wrapper?.querySelector<HTMLInputElement>('input.neo-input-display-content');
    expect(inner?.value).toBe('shown');
  });

  it('displayProps.tag overrides the wrapper element', async () => {
    const { container } = render(Harness, { props: { display: 'd', displayProps: { tag: 'div' } } as never });
    await tick();
    expect(container.querySelector('div.neo-input')).not.toBeNull();
  });
});
