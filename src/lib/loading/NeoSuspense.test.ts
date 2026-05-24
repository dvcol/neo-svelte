import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoSuspenseHarness from './NeoSuspense.test.svelte';

afterEach(() => {
  cleanup();
});

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
}

describe('neoSuspense — loading state', { tags: ['jsdom'] }, () => {
  it('delay=0 shows the default loader (NeoLoadingMatrix) immediately while pending', async () => {
    const promise = new Promise<string>(() => {}); // never resolves
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')).not.toBeNull();
  });

  it('delay>0 hides the loader on initial render', async () => {
    const promise = new Promise<string>(() => {});
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 1000 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')).toBeNull();
  });

  it('delay>0 reveals the loader after the onMount timer fires', async () => {
    /*
     * Pins the seeded-state contract documented in NeoSuspense.svelte: the
     * initial false comes from the prop, and the onMount timer flips it to
     * true. A `$derived(!delay)` regression would leave the loader hidden
     * forever for any non-zero delay.
     */
    vi.useFakeTimers();
    try {
      const promise = new Promise<string>(() => {});
      const { container } = render(NeoSuspenseHarness, {
        props: { promise, delay: 500 } as never,
      });
      await tick();
      expect(container.querySelector('.neo-loading-matrix')).toBeNull();
      await vi.advanceTimersByTimeAsync(500);
      await tick();
      expect(container.querySelector('.neo-loading-matrix')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('loading=false suppresses the loader while pending', async () => {
    const promise = new Promise<string>(() => {});
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, showLoading: false } as never,
    });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')).toBeNull();
    expect(container.querySelector('[data-testid="suspense-loading"]')).toBeNull();
  });

  it('custom loading snippet renders in place of NeoLoadingMatrix', async () => {
    const promise = new Promise<string>(() => {});
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, showLoading: 'snippet', loadingText: 'spin' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')).toBeNull();
    expect(container.querySelector('[data-testid="suspense-loading"]')?.textContent).toBe('spin');
  });

  it('matrixProps forwards width via CSS variable to the default loader', async () => {
    const promise = new Promise<string>(() => {});
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, matrixProps: { width: 24 } } as never,
    });
    await tick();
    const matrix = container.querySelector<HTMLElement>('.neo-loading-matrix')!;
    expect(matrix.style.cssText).toContain('--neo-loader-width: 24px');
  });
});

describe('neoSuspense — resolved state', { tags: ['jsdom'] }, () => {
  it('renders the result snippet with resolved.default when result is provided', async () => {
    // NeoSuspense passes `resolved?.default` to the result snippet — designed
    // for `import('./X.svelte')` style module promises.
    const promise = Promise.resolve({ default: 'hello' });
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, resultText: 'r' } as never,
    });
    // Two microtasks — one for the promise, one for the rerender
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    expect(container.querySelector('[data-testid="suspense-result"]')?.textContent).toBe('r:hello');
    expect(container.querySelector('.neo-loading-matrix')).toBeNull();
  });

  it('falls back to children when no result snippet is provided', async () => {
    const promise = Promise.resolve('hello');
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, childrenText: 'child' } as never,
    });
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    expect(container.querySelector('[data-testid="suspense-children"]')?.textContent).toBe('child');
  });
});

describe('neoSuspense — error state', { tags: ['jsdom'] }, () => {
  it('renders the error snippet when the promise rejects', async () => {
    const promise = Promise.reject(new Error('boom'));
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0, errorText: 'err' } as never,
    });
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    expect(container.querySelector('[data-testid="suspense-error"]')?.textContent).toBe('err:boom');
  });

  it('renders a fallback red error <p> when no error snippet is provided', async () => {
    const promise = Promise.reject(new Error('explode'));
    const { container } = render(NeoSuspenseHarness, {
      props: { promise, delay: 0 } as never,
    });
    await flushMicrotasks();
    await flushMicrotasks();
    await tick();
    const ps = container.querySelectorAll('p');
    expect(ps.length).toBeGreaterThanOrEqual(1);
    expect(Array.from(ps).some(p => p.textContent?.includes('explode'))).toBe(true);
  });
});
