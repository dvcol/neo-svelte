import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoInputValidation from './NeoInputValidation.svelte';

afterEach(() => {
  cleanup();
});

describe('neoInputValidation — visibility / disabled propagation', () => {
  it('with no validation, no message, no error → wrapper is omitted (disabled)', async () => {
    const { container } = render(NeoInputValidation, {});
    await tick();
    expect(container.querySelector('.neo-validation-group-wrapper')).toBeNull();
  });

  it('with message → wrapper is rendered', async () => {
    const { container } = render(NeoInputValidation, { props: { message: 'help' } as never });
    await tick();
    expect(container.querySelector('.neo-validation-group-wrapper')).not.toBeNull();
    expect(container.querySelector('.neo-validation-description')?.textContent?.trim()).toBe('help');
  });

  it('with validation=true → wrapper is rendered even without message', async () => {
    const { container } = render(NeoInputValidation, { props: { validation: true } as never });
    await tick();
    expect(container.querySelector('.neo-validation-group-wrapper')).not.toBeNull();
  });
});

describe('neoInputValidation — error gating', () => {
  it('validation=true + valid=false → exposes validationMessage as error', async () => {
    const { container } = render(NeoInputValidation, {
      props: { validation: true, valid: false, validationMessage: 'native bad' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-validation-error')?.textContent?.trim()).toBe('native bad');
  });

  it('validation=true + valid=true → no error rendered', async () => {
    const { container } = render(NeoInputValidation, {
      props: { validation: true, valid: true, validationMessage: 'should-not-show' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-validation-error')).toBeNull();
  });

  it('validation="success" never renders error even when invalid', async () => {
    const { container } = render(NeoInputValidation, {
      props: { validation: 'success', valid: false, validationMessage: 'hidden' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-validation-error')).toBeNull();
  });

  it('validation="error" + valid=false renders error', async () => {
    const { container } = render(NeoInputValidation, {
      props: { validation: 'error', valid: false, validationMessage: 'show-this' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-validation-error')?.textContent?.trim()).toBe('show-this');
  });

  it('explicit error prop overrides validationMessage when validation=true and invalid', async () => {
    const { container } = render(NeoInputValidation, {
      props: { validation: true, valid: false, validationMessage: 'native', error: 'custom' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-validation-error')?.textContent?.trim()).toBe('custom');
  });
});
