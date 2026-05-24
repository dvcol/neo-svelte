import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoFormHarness from './NeoForm.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoForm — render', { tags: ['jsdom'] }, () => {
  it('renders a <form> with class .neo-form and the children content', async () => {
    const { container } = render(NeoFormHarness, {
      props: { childrenText: 'fields' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form.neo-form')!;
    expect(form).not.toBeNull();
    expect(form.querySelector('[data-testid="form-content"]')?.textContent).toBe('fields');
    // No fieldset / legend without legend prop
    expect(container.querySelector('fieldset')).toBeNull();
  });

  it('auto-generates an id starting with neo-form-', async () => {
    const { container } = render(NeoFormHarness, {
      props: { childrenText: 'x' } as never,
    });
    await tick();
    expect(container.querySelector<HTMLFormElement>('form')!.id).toMatch(/^neo-form-/);
  });

  it('explicit id is honored on the form', async () => {
    const { container } = render(NeoFormHarness, {
      props: { id: 'my-form', childrenText: 'x' } as never,
    });
    await tick();
    expect(container.querySelector<HTMLFormElement>('form')!.id).toBe('my-form');
  });

  it('legend prop wraps the form content in a <fieldset> with a <legend>', async () => {
    const { container } = render(NeoFormHarness, {
      props: { legend: 'Sign in', childrenText: 'fields' } as never,
    });
    await tick();
    expect(container.querySelector('fieldset.neo-fieldset')).not.toBeNull();
    const legend = container.querySelector<HTMLLegendElement>('legend.neo-fieldset-legend')!;
    expect(legend.textContent?.trim()).toBe('Sign in');
    // form has aria-labelledby pointing at the legend
    const form = container.querySelector<HTMLFormElement>('form')!;
    expect(form.getAttribute('aria-labelledby')).toBe(legend.id);
  });

  it('without legend, aria-labelledby is omitted', async () => {
    const { container } = render(NeoFormHarness, {
      props: { childrenText: 'x' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form')!;
    expect(form.getAttribute('aria-labelledby')).toBeNull();
  });
});

describe('neoForm — events', { tags: ['jsdom'] }, () => {
  it('onsubmit is invoked when the form is submitted', async () => {
    const onsubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    const { container } = render(NeoFormHarness, {
      props: { onsubmit, childrenText: 'x' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(onsubmit).toHaveBeenCalledOnce();
  });

  it('onreset is invoked when the form is reset', async () => {
    const onreset = vi.fn();
    const { container } = render(NeoFormHarness, {
      props: { onreset, childrenText: 'x' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('reset', { bubbles: true }));
    expect(onreset).toHaveBeenCalledOnce();
  });
});

describe('neoForm — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes validate() and context on the component instance', async () => {
    let instance: { validate: () => unknown; context: unknown } | undefined;
    render(NeoFormHarness, {
      props: {
        childrenText: 'x',
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    expect(instance).toBeDefined();
    expect(typeof instance!.validate).toBe('function');
    expect(instance!.context).toBeDefined();
  });

  it('does not attach validate/context onto the DOM form element', async () => {
    const { container } = render(NeoFormHarness, {
      props: { childrenText: 'x' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form')!;
    expect(Object.hasOwn(form, 'validate')).toBe(false);
    expect(Object.hasOwn(form, 'context')).toBe(false);
    expect((form as unknown as { validate?: unknown }).validate).toBeUndefined();
    expect((form as unknown as { context?: unknown }).context).toBeUndefined();
  });

  it('instance.context is a NeoFormContext object exposed on the instance', async () => {
    let instance: { context: { register: unknown; validate: unknown } } | undefined;
    render(NeoFormHarness, {
      props: {
        childrenText: 'x',
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    expect(instance!.context).toBeDefined();
    expect(typeof instance!.context.register).toBe('function');
    expect(typeof instance!.context.validate).toBe('function');
  });

  it('instance.validate() returns the aggregated NeoValidationState', async () => {
    let instance: { validate: () => unknown } | undefined;
    render(NeoFormHarness, {
      props: {
        childrenText: 'x',
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    const state = instance!.validate() as Record<string, unknown>;
    expect(state).toMatchObject({ touched: false, dirty: false, valid: true });
    expect(state.value).toBeDefined();
    expect(state.initial).toBeDefined();
  });

  it('instance.context identity is captured at mount and survives id prop changes', async () => {
    let instance: { context: unknown } | undefined;
    const onInstance = (i: unknown) => {
      if (i) instance = i as never;
    };
    const { rerender } = render(NeoFormHarness, {
      props: { id: 'first', childrenText: 'x', onInstance } as never,
    });
    await tick();
    const initialContext = instance!.context;
    expect(initialContext).toBeDefined();
    await rerender({ id: 'second', childrenText: 'x', onInstance } as never);
    await tick();
    // setNeoFormContext is called once at mount with the initial id.
    // A re-init on id change would orphan every getNeoFormContext consumer.
    expect(instance!.context).toBe(initialContext);
  });

  it('instance.validate() invokes registered fields validate hooks (via context.register)', async () => {
    let instance: { validate: () => unknown; context: { register: (f: unknown) => void } } | undefined;
    render(NeoFormHarness, {
      props: {
        childrenText: 'x',
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    const validateA = vi.fn();
    const validateB = vi.fn();
    instance!.context.register({
      id: 'a',
      ref: { validate: validateA } as never,
      state: { touched: false, dirty: false, valid: true, value: undefined, initial: undefined },
    });
    instance!.context.register({
      id: 'b',
      ref: { validate: validateB } as never,
      state: { touched: false, dirty: false, valid: true, value: undefined, initial: undefined },
    });
    instance!.validate();
    expect(validateA).toHaveBeenCalledOnce();
    expect(validateB).toHaveBeenCalledOnce();
  });
});
