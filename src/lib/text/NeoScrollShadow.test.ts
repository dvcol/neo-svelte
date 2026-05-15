import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoScrollShadow from './NeoScrollShadow.svelte';

afterEach(() => {
  cleanup();
});

describe('neoScrollShadow — render & modifiers', { tags: ['jsdom'] }, () => {
  it('default tag=div with class neo-scroll-shadow + neo-vertical (default direction)', async () => {
    const { container } = render(NeoScrollShadow, { props: {} as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.tagName).toBe('DIV');
    expect(host.classList.contains('neo-vertical')).toBe(true);
    expect(host.classList.contains('neo-horizontal')).toBe(false);
  });

  it('direction="right" toggles to neo-horizontal', async () => {
    const { container } = render(NeoScrollShadow, {
      props: { direction: 'right' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.classList.contains('neo-horizontal')).toBe(true);
    expect(host.classList.contains('neo-vertical')).toBe(false);
  });

  it('shadow=true (default) adds .neo-shadow', async () => {
    const { container } = render(NeoScrollShadow, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-scroll-shadow.neo-shadow')).not.toBeNull();
  });

  it('shadow=false removes .neo-shadow', async () => {
    const { container } = render(NeoScrollShadow, { props: { shadow: false } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.classList.contains('neo-shadow')).toBe(false);
  });

  it('scrollbar=true (default) adds .neo-scroll', async () => {
    const { container } = render(NeoScrollShadow, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-scroll-shadow.neo-scroll')).not.toBeNull();
  });

  it('scrollbar=false removes .neo-scroll', async () => {
    const { container } = render(NeoScrollShadow, { props: { scrollbar: false } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.classList.contains('neo-scroll')).toBe(false);
  });

  it('width=number sets style.width to px', async () => {
    const { container } = render(NeoScrollShadow, { props: { width: 320 } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.style.width).toBe('320px');
  });

  it('height={ min, max } sets min/max-height', async () => {
    const { container } = render(NeoScrollShadow, {
      props: { height: { min: 16, max: 200 } } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.style.minHeight).toBe('16px');
    expect(host.style.maxHeight).toBe('200px');
  });

  it('flex/overflow/shadowSize forward as inline styles / CSS vars', async () => {
    const { container } = render(NeoScrollShadow, {
      props: { flex: '1 0 auto', overflow: 'auto', shadowSize: '0.5rem' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-scroll-shadow')!;
    expect(host.style.flex).toBe('1 0 auto');
    expect(host.style.cssText).toContain('--neo-scroll-overflow: auto');
    expect(host.style.cssText).toContain('--neo-scroll-shadow-size: 0.5rem');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoScrollShadow, { props: { tag: 'section' } as never });
    await tick();
    expect(container.querySelector('.neo-scroll-shadow')?.tagName).toBe('SECTION');
  });
});
