import type { NeoInputMethods } from '~/inputs/common/neo-input.model.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
import Harness from './NeoTextarea.test.svelte';

afterEach(() => {
  cleanup();
});

function getTextarea(scope: ParentNode = document): HTMLTextAreaElement | null {
  return scope.querySelector<HTMLTextAreaElement>('textarea.neo-textarea');
}

function getGroup(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-textarea-group');
}

interface TextareaInstance extends NeoInputMethods<HTMLTextAreaElement> {
  resize: () => void;
}

function captureInstance(props: Record<string, unknown> = {}): { instance: TextareaInstance; container: HTMLElement } {
  let instance: TextareaInstance | undefined;
  const { container } = render(Harness, {
    props: {
      ...props,
      onInstance: (i: unknown) => {
        instance = i as never;
      },
    } as never,
  });
  return { instance: instance as TextareaInstance, container };
}

describe('neoTextarea — render', { tags: ['jsdom'] }, () => {
  it('renders a <textarea.neo-input>', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getTextarea(container)).not.toBeNull();
  });

  it('renders a <textarea> wrapped in .neo-textarea-group', async () => {
    const { container } = render(NeoTextarea, {});
    await tick();
    expect(getGroup(container)).not.toBeNull();
    expect(getTextarea(container)).not.toBeNull();
  });

  it('binds id to label[for] when label provided', async () => {
    const { container } = render(NeoTextarea, { props: { label: 'Bio', id: 'ta-bio' } as never });
    await tick();
    const label = container.querySelector<HTMLLabelElement>('label.neo-label');
    expect(label).not.toBeNull();
    expect(label?.getAttribute('for')).toBe('ta-bio');
  });

  it('exposes data-touched/data-dirty on the group', async () => {
    const { container } = render(NeoTextarea, {});
    await tick();
    const group = getGroup(container)!;
    expect(group.dataset.touched).toBe('false');
    expect(group.dataset.dirty).toBe('false');
  });

  it('rounded class is applied when rounded=true', async () => {
    const { container } = render(NeoTextarea, { props: { rounded: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-rounded')).toBe(true);
  });

  it('disabled flag toggles textarea disabled + neo-disabled on group', async () => {
    const { container } = render(NeoTextarea, { props: { disabled: true } as never });
    await tick();
    expect(getTextarea(container)?.disabled).toBe(true);
    expect(getGroup(container)?.classList.contains('neo-disabled')).toBe(true);
  });
});

describe('neoTextarea — bindable state flips', { tags: ['jsdom'] }, () => {
  it('focusing the textarea flips touched=true and fires onfocus', async () => {
    const onfocus = vi.fn();
    const { container } = render(NeoTextarea, { props: { onfocus } as never });
    await tick();
    const ta = getTextarea(container)!;
    ta.focus();
    await tick();
    expect(onfocus).toHaveBeenCalledTimes(1);
    expect(getGroup(container)?.dataset.touched).toBe('true');
  });

  it('typing flips dirty when dirtyOnInput=true', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoTextarea, { props: { dirtyOnInput: true, value: '' } as never });
    await tick();
    await user.type(getTextarea(container)!, 'hello');
    await tick();
    expect(getGroup(container)?.dataset.dirty).toBe('true');
  });

  it('validateOnInput=true sets data-valid=true for valid required input', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoTextarea, { props: { required: true, validateOnInput: true, value: '' } as never });
    await tick();
    await user.type(getTextarea(container)!, 'x');
    await tick();
    expect(getGroup(container)?.dataset.valid).toBe('true');
  });
});

describe('neoTextarea — clearable', { tags: ['jsdom'] }, () => {
  it('clearable adds an affix clear button when value present and focused', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoTextarea, { props: { clearable: true, value: 'draft' } as never });
    await tick();
    await user.click(getTextarea(container)!);
    await new Promise(resolve => setTimeout(resolve, 150));
    await tick();
    expect(container.querySelector('button.neo-affix-clear')).not.toBeNull();
  });

  it('clicking the clear button resets value and fires onclear', async () => {
    const user = userEvent.setup();
    const onclear = vi.fn();
    const { container } = render(NeoTextarea, { props: { clearable: true, value: 'draft', onclear } as never });
    await tick();
    await user.click(getTextarea(container)!);
    await new Promise(resolve => setTimeout(resolve, 150));
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button.neo-affix-clear')!;
    await user.click(btn);
    await tick();
    expect(getTextarea(container)?.value).toBe('');
    expect(onclear).toHaveBeenCalledTimes(1);
  });
});

describe('neoTextarea — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes mark/clear/change/validate/resize on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.mark).toBe('function');
    expect(typeof instance.clear).toBe('function');
    expect(typeof instance.change).toBe('function');
    expect(typeof instance.validate).toBe('function');
    expect(typeof instance.resize).toBe('function');
  });

  it('does not attach component methods onto the DOM ref', async () => {
    const { container } = captureInstance();
    await tick();
    const ta = getTextarea(container)!;
    for (const member of ['mark', 'clear', 'change', 'validate', 'resize'] as const) {
      expect(Object.hasOwn(ta, member)).toBe(false);
      expect((ta as unknown as Record<string, unknown>)[member]).toBeUndefined();
    }
  });

  it('change() updates value and runs validation', async () => {
    const { instance, container } = captureInstance({ required: true });
    await tick();
    const ta = getTextarea(container)!;
    const state = await instance.change('hello');
    expect(ta.value).toBe('hello');
    expect(state.valid).toBe(true);
  });

  it('clear() resets the textarea value and fires onclear', async () => {
    const onclear = vi.fn();
    const oninput = vi.fn();
    const { instance, container } = captureInstance({ value: 'hello', onclear, oninput });
    await tick();
    const ta = getTextarea(container)!;
    await instance.clear();
    expect(ta.value).toBe('');
    expect(onclear).toHaveBeenCalledTimes(1);
    expect(oninput).toHaveBeenCalledTimes(1);
  });

  it('clear() with nullable=false falls back to defaultValue', async () => {
    const { instance, container } = captureInstance({ value: 'changed', defaultValue: 'init', nullable: false });
    await tick();
    const ta = getTextarea(container)!;
    await instance.clear();
    expect(ta.value).toBe('init');
  });

  it('mark() updates touched/valid/dirty and invokes onmark', async () => {
    const onmark = vi.fn();
    const { instance } = captureInstance({ onmark });
    await tick();
    instance.mark({ touched: true, valid: true, dirty: true });
    expect(onmark).toHaveBeenCalledTimes(1);
  });

  it('mark({ touched, dirty }) reflects on group dataset', async () => {
    const { instance, container } = captureInstance({});
    await tick();
    instance.mark({ touched: true, dirty: true });
    await tick();
    const group = getGroup(container)!;
    expect(group.dataset.touched).toBe('true');
    expect(group.dataset.dirty).toBe('true');
  });

  it('validate() reflects native checkValidity', async () => {
    const { instance, container } = captureInstance({ required: true });
    await tick();
    const ta = getTextarea(container)!;
    expect(instance.validate().valid).toBe(false);
    ta.value = 'something';
    expect(instance.validate().valid).toBe(true);
  });

  it('resize() does not throw when invoked on a freshly-mounted textarea', async () => {
    const { instance } = captureInstance({ autoResize: true });
    await tick();
    expect(() => instance.resize()).not.toThrow();
  });
});

describe('neoTextarea — option combinations', { tags: ['jsdom'] }, () => {
  const matrix = [
    { rounded: true, glass: true },
    { rounded: false, tinted: true },
    { rounded: true, pressed: true },
    { rounded: false, borderless: true },
  ] as const;

  it.each(matrix)('renders style combination %o without crashing', async (props) => {
    const { container } = render(NeoTextarea, { props: props as never });
    await tick();
    expect(getGroup(container)).not.toBeNull();
    expect(getTextarea(container)).not.toBeNull();
  });
});
