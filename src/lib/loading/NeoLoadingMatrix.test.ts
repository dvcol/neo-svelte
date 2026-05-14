import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoLoadingMatrix from './NeoLoadingMatrix.svelte';

afterEach(() => {
  cleanup();
});

describe('neoLoadingMatrix', () => {
  it('renders a div.neo-loading-matrix containing the loader icon by default', async () => {
    const { container } = render(NeoLoadingMatrix, { props: {} as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-loading-matrix');
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    // The internal NeoIconLoadingMatrix renders an svg with class neo-loader
    expect(root?.querySelector('.neo-loader')).not.toBeNull();
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoLoadingMatrix, { props: { tag: 'section' } as never });
    await tick();
    expect(container.querySelector('.neo-loading-matrix')?.tagName).toBe('SECTION');
  });

  it('flex/align/justify reflect on inline style', async () => {
    const { container } = render(NeoLoadingMatrix, {
      props: { flex: '1 0 auto', align: 'flex-start', justify: 'space-between' } as never,
    });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-loading-matrix')!;
    expect(root.style.flex).toBe('1 0 auto');
    expect(root.style.alignItems).toBe('flex-start');
    expect(root.style.justifyContent).toBe('space-between');
  });

  it('width=number sets the loader-width CSS variable as px', async () => {
    const { container } = render(NeoLoadingMatrix, { props: { width: 64 } as never });
    await tick();
    const cssText = container.querySelector<HTMLElement>('.neo-loading-matrix')!.style.cssText;
    expect(cssText).toContain('--neo-loader-width: 64px');
  });

  it('height={ min, max } sets min/max CSS variables', async () => {
    const { container } = render(NeoLoadingMatrix, {
      props: { height: { min: 16, max: 128 } } as never,
    });
    await tick();
    const cssText = container.querySelector<HTMLElement>('.neo-loading-matrix')!.style.cssText;
    expect(cssText).toContain('--neo-loader-min-height: 16px');
    expect(cssText).toContain('--neo-loader-max-height: 128px');
  });

  it('forwards arbitrary attrs (id, data-*) to the host', async () => {
    const { container } = render(NeoLoadingMatrix, {
      props: { 'id': 'lm', 'data-testid': 'matrix' } as never,
    });
    await tick();
    const root = container.querySelector<HTMLElement>('#lm');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-testid')).toBe('matrix');
  });
});
