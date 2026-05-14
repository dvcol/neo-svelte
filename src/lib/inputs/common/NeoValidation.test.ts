import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoValidation from './NeoValidation.svelte';

afterEach(() => {
  cleanup();
});

describe('neoValidation — render', () => {
  it('disabled=true renders only children (no wrapper)', async () => {
    const { container } = render(NeoValidation, { props: { disabled: true } as never });
    await tick();
    expect(container.querySelector('.neo-validation-group-wrapper')).toBeNull();
  });

  it('disabled=false renders the wrapper container', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false } as never });
    await tick();
    expect(container.querySelector('.neo-validation-group-wrapper')).not.toBeNull();
  });

  it('renders error message when error string is provided and disabled=false', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, error: 'Required' } as never });
    await tick();
    const err = container.querySelector('.neo-validation-error');
    expect(err).not.toBeNull();
    expect(err?.textContent?.trim()).toBe('Required');
  });

  it('renders message text as description when no error', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, message: 'Hint' } as never });
    await tick();
    const desc = container.querySelector('.neo-validation-description');
    expect(desc).not.toBeNull();
    expect(desc?.textContent?.trim()).toBe('Hint');
  });

  it('error takes precedence over message', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, error: 'Bad', message: 'Hint' } as never });
    await tick();
    expect(container.querySelector('.neo-validation-error')?.textContent?.trim()).toBe('Bad');
    expect(container.querySelector('.neo-validation-description')).toBeNull();
  });

  it('messageId is wired onto the rendered message element', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, message: 'm', messageId: 'custom-id' } as never });
    await tick();
    expect(container.querySelector('#custom-id')).not.toBeNull();
  });

  it('tag prop overrides the wrapper tag', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, tag: 'section' } as never });
    await tick();
    expect(container.querySelector('section.neo-validation-group-wrapper')).not.toBeNull();
  });

  it('messageProps.tag overrides the message tag', async () => {
    const { container } = render(NeoValidation, { props: { disabled: false, message: 'm', messageProps: { tag: 'p' } } as never });
    await tick();
    expect(container.querySelector('p.neo-validation-description')).not.toBeNull();
  });
});
