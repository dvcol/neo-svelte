import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSkeletonContainerHarness from './NeoSkeletonContainer.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoSkeletonContainer — disabled (bypass)', { tags: ['jsdom'] }, () => {
  it('disabled=true renders the content slot directly without skeleton wrapper', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { disabled: true, contentText: 'real', skeletonText: 'sk' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="skeleton-content"]')?.textContent).toBe('real');
    expect(container.querySelector('.neo-skeleton-container')).toBeNull();
  });
});

describe('neoSkeletonContainer — loading branch', { tags: ['jsdom'] }, () => {
  it('loading=true (default) with content + skeleton renders skeleton inside .neo-skeleton-container', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { contentText: 'real', skeletonText: 'sk' } as never,
    });
    await tick();
    const wrapper = container.querySelector('.neo-skeleton-container');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector('[data-testid="skeleton-children"]')?.textContent).toBe('sk');
    expect(container.querySelector('[data-testid="skeleton-content"]')).toBeNull();
  });

  it('loading=true without content renders skeleton snippet bare (no transition container)', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { skeletonText: 'sk' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="skeleton-children"]')?.textContent).toBe('sk');
    expect(container.querySelector('.neo-transition-container')).toBeNull();
  });

  it('default tag=div on the skeleton wrapper, override via tag prop', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { contentText: 'r', skeletonText: 's', tag: 'section' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-container')?.tagName).toBe('SECTION');
  });

  it('flex prop forwards as inline style on the skeleton wrapper', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { contentText: 'r', skeletonText: 's', flex: '0 0 100px' } as never,
    });
    await tick();
    const wrapper = container.querySelector<HTMLElement>('.neo-skeleton-container')!;
    expect(wrapper.style.flex).toBe('0 0 100px');
  });
});

describe('neoSkeletonContainer — loaded branch', { tags: ['jsdom'] }, () => {
  it('loading=false renders the content snippet inside .neo-skeleton-content-container', async () => {
    const { container } = render(NeoSkeletonContainerHarness, {
      props: { loading: false, contentText: 'real', skeletonText: 'sk' } as never,
    });
    await tick();
    const wrapper = container.querySelector('.neo-skeleton-content-container');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector('[data-testid="skeleton-content"]')?.textContent).toBe('real');
    expect(container.querySelector('.neo-skeleton-container')).toBeNull();
  });
});
