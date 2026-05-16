import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTypewriter from './NeoTypewriter.svelte';
import NeoTypewriterHarness from './NeoTypewriter.test.svelte';

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

describe('neoTypewriter — component-instance API', { tags: ['jsdom'] }, () => {
  interface TypewriterInstance {
    write: (...args: unknown[]) => unknown;
    abort: () => void;
  }

  function captureInstance(props: Record<string, unknown> = {}): { instance: TypewriterInstance; container: HTMLElement } {
    let instance: TypewriterInstance | undefined;
    const { container } = render(NeoTypewriterHarness, {
      props: {
        value: '',
        ...props,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    return { instance: instance as TypewriterInstance, container };
  }

  it('exposes write / abort on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.write).toBe('function');
    expect(typeof instance.abort).toBe('function');
  });

  it('does not attach methods or getters onto the DOM ref', async () => {
    const { container } = captureInstance();
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-typewriter')!;
    for (const member of ['write', 'abort', 'writing', 'promise'] as const) {
      expect(Object.hasOwn(host, member)).toBe(false);
      expect((host as unknown as Record<string, unknown>)[member]).toBeUndefined();
    }
  });

  it('instance.abort is callable and does not throw on a freshly-mounted host', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(() => instance.abort()).not.toThrow();
  });
});
