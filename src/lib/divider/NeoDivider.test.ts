import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoDivider from './NeoDivider.svelte';

afterEach(() => {
  cleanup();
});

describe('neoDivider — render & ARIA', { tags: ['jsdom'] }, () => {
  it('renders a div with role="separator" and default horizontal orientation', async () => {
    const { container } = render(NeoDivider, { props: {} as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-divider');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
    expect(host?.getAttribute('role')).toBe('separator');
    expect(host?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('vertical=true sets aria-orientation="vertical" and adds .neo-vertical', async () => {
    const { container } = render(NeoDivider, { props: { vertical: true } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-divider')!;
    expect(host.getAttribute('aria-orientation')).toBe('vertical');
    expect(host.classList.contains('neo-vertical')).toBe(true);
  });

  it('rounded=true (default) adds .neo-rounded', async () => {
    const { container } = render(NeoDivider, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-divider.neo-rounded')).not.toBeNull();
  });

  it('rounded=false removes .neo-rounded', async () => {
    const { container } = render(NeoDivider, { props: { rounded: false } as never });
    await tick();
    expect(container.querySelector('.neo-divider')?.classList.contains('neo-rounded')).toBe(false);
  });

  it('elevation=0 (default) adds .neo-flat', async () => {
    const { container } = render(NeoDivider, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-divider.neo-flat')).not.toBeNull();
  });

  it('elevation>0 removes .neo-flat and reflects data-elevation', async () => {
    const { container } = render(NeoDivider, { props: { elevation: 3 } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-divider')!;
    expect(host.classList.contains('neo-flat')).toBe(false);
    expect(host.dataset.elevation).toBe('3');
  });

  it('skeleton=true adds .neo-skeleton', async () => {
    const { container } = render(NeoDivider, { props: { skeleton: true } as never });
    await tick();
    expect(container.querySelector('.neo-divider.neo-skeleton')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoDivider, { props: { glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-divider.neo-glass')).not.toBeNull();
  });

  it('width/height/margin forward as CSS variables', async () => {
    const { container } = render(NeoDivider, {
      props: { width: '50%', height: '4px', margin: '0.5rem' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-divider')!;
    expect(host.style.cssText).toContain('--neo-divider-width: 50%');
    expect(host.style.cssText).toContain('--neo-divider-height: 4px');
    expect(host.style.cssText).toContain('--neo-divider-margin: 0.5rem');
  });
});
