import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTransitionContainer from './NeoTransitionContainer.svelte';

afterEach(() => {
  cleanup();
});

describe('neoTransitionContainer — host & class modifiers', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host with .neo-transition-container', async () => {
    const { container } = render(NeoTransitionContainer, { props: {} as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-transition-container');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoTransitionContainer, {
      props: { tag: 'section' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-transition-container')?.tagName).toBe('SECTION');
  });

  it('reverse=true adds .neo-reverse', async () => {
    const { container } = render(NeoTransitionContainer, {
      props: { reverse: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-transition-container.neo-reverse')).not.toBeNull();
  });

  it('forwards width/height/ratio/overflow as inline styles', async () => {
    const { container } = render(NeoTransitionContainer, {
      props: { width: '50%', height: '4rem', ratio: '16 / 9', overflow: 'hidden' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-transition-container')!;
    expect(host.style.width).toBe('50%');
    expect(host.style.height).toBe('4rem');
    expect(host.style.aspectRatio).toBe('16 / 9');
    expect(host.style.overflow).toBe('hidden');
  });

  it('overflowX and overflowY map to their own axes', async () => {
    const { container } = render(NeoTransitionContainer, {
      props: { overflowX: 'auto', overflowY: 'scroll' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-transition-container')!;
    expect(host.style.overflowX).toBe('auto');
    expect(host.style.overflowY).toBe('scroll');
  });
});
