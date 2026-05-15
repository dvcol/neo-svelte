import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTypewriter from './NeoTypewriter.svelte';

afterEach(() => {
  cleanup();
});

describe('neoTypewriter — host & class modifiers', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host with .neo-typewriter and .neo-caret', async () => {
    const { container } = render(NeoTypewriter, { props: { value: '' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-typewriter');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
    expect(host?.classList.contains('neo-caret')).toBe(true);
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoTypewriter, {
      props: { tag: 'span', value: '' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-typewriter')?.tagName).toBe('SPAN');
  });

  it('caret=false omits the .neo-caret class', async () => {
    const { container } = render(NeoTypewriter, {
      props: { caret: false, value: '' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-typewriter')!;
    expect(host.classList.contains('neo-caret')).toBe(false);
  });

  it('initial render reflects data-writing="true" while typing has not finished', async () => {
    const { container } = render(NeoTypewriter, {
      props: { value: 'hello', speed: 1000 } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-typewriter')!;
    expect(['true', 'false']).toContain(host.dataset.writing);
  });

  it('forwards arbitrary attrs (id, data-*) to the host', async () => {
    const { container } = render(NeoTypewriter, {
      props: { 'value': '', 'id': 'tw', 'data-testid': 'typewriter' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('#tw');
    expect(host).not.toBeNull();
    expect(host?.getAttribute('data-testid')).toBe('typewriter');
  });
});
