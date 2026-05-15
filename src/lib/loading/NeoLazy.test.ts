import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoLazyHarness from './NeoLazy.test.svelte';
import NeoLazyTarget from './NeoLazyTarget.test.svelte';

afterEach(() => {
  cleanup();
});

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
}

describe('neoLazy', { tags: ['jsdom'] }, () => {
  it('renders the default loader while the component promise is pending', async () => {
    const component = new Promise<{ default: typeof NeoLazyTarget }>(() => {});
    const { container } = render(NeoLazyHarness, {
      props: { component, delay: 0 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')).not.toBeNull();
  });

  it('renders the target component once the promise resolves and forwards props', async () => {
    const component = Promise.resolve({ default: NeoLazyTarget });
    const { container } = render(NeoLazyHarness, {
      props: { component, delay: 0, componentProps: { label: 'foo' } } as never,
    });
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    const target = container.querySelector<HTMLElement>('[data-testid="lazy-target"]');
    expect(target).not.toBeNull();
    expect(target?.getAttribute('data-label')).toBe('foo');
    expect(container.querySelector('.neo-loading-matrix')).toBeNull();
  });

  it('forwards children to the lazy-loaded target component', async () => {
    const component = Promise.resolve({ default: NeoLazyTarget });
    const { container } = render(NeoLazyHarness, {
      props: { component, delay: 0, childrenText: 'kids' } as never,
    });
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    expect(container.querySelector('[data-testid="lazy-children"]')?.textContent).toBe('kids');
  });
});
