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

describe('neoForm — bindings', { tags: ['jsdom'] }, () => {
  it('exposes a validate() method and a context getter on the form element', async () => {
    const { container } = render(NeoFormHarness, {
      props: { childrenText: 'x' } as never,
    });
    await tick();
    const form = container.querySelector<HTMLFormElement>('form')!;
    // The $effect copies a `validate` and a `context` getter onto the form ref
    expect(typeof (form as unknown as { validate: () => unknown }).validate).toBe('function');
    expect((form as unknown as { context: unknown }).context).toBeDefined();
  });
});
