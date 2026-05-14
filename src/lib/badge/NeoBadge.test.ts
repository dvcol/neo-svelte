import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoBadgeHarness from './NeoBadgeHarness.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoBadge — host & content', () => {
  it('default container tag=div with .neo-badge-container and default placement="top-right"', async () => {
    const { container } = render(NeoBadgeHarness, { props: { value: '1' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-badge-container');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
    expect(host?.dataset.placement).toBe('top-right');
  });

  it('renders the inner pill with .neo-badge-pill class and the string value as content', async () => {
    const { container } = render(NeoBadgeHarness, { props: { value: '42' } as never });
    await tick();
    const pill = container.querySelector('.neo-badge-pill');
    expect(pill).not.toBeNull();
    expect(pill?.textContent?.trim()).toContain('42');
  });

  it('renders the children snippet alongside the pill', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', childrenText: 'avatar' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="badge-children"]')?.textContent).toBe('avatar');
    expect(container.querySelector('.neo-badge-pill')).not.toBeNull();
  });

  it('containerProps.tag overrides the wrapper tag', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', containerProps: { tag: 'span' } } as never,
    });
    await tick();
    expect(container.querySelector('.neo-badge-container')?.tagName).toBe('SPAN');
  });
});

describe('neoBadge — placement matrix', () => {
  const placements = ['top', 'top-right', 'top-left', 'bottom', 'bottom-right', 'bottom-left', 'right', 'left'] as const;
  for (const placement of placements) {
    it(`placement="${placement}" reflects on data-placement`, async () => {
      const { container } = render(NeoBadgeHarness, {
        props: { value: '1', placement } as never,
      });
      await tick();
      expect(container.querySelector<HTMLElement>('.neo-badge-container')?.dataset.placement).toBe(placement);
    });
  }
});

describe('neoBadge — offset normalization', () => {
  it('numeric offset → "<n>px" on both x and y CSS vars', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', offset: 4 } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-badge-container')!;
    expect(host.style.cssText).toContain('--neo-badge-offset-x: 4px');
    expect(host.style.cssText).toContain('--neo-badge-offset-y: 4px');
  });

  it('string offset → forwarded verbatim on both axes', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', offset: '0.5rem' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-badge-container')!;
    expect(host.style.cssText).toContain('--neo-badge-offset-x: 0.5rem');
    expect(host.style.cssText).toContain('--neo-badge-offset-y: 0.5rem');
  });

  it('{x,y} object with mixed number/string maps each axis independently', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', offset: { x: 2, y: '1em' } } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-badge-container')!;
    expect(host.style.cssText).toContain('--neo-badge-offset-x: 2px');
    expect(host.style.cssText).toContain('--neo-badge-offset-y: 1em');
  });

  it('partial {x} only sets x var, leaves y unset', async () => {
    const { container } = render(NeoBadgeHarness, {
      props: { value: '1', offset: { x: 5 } } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-badge-container')!;
    expect(host.style.cssText).toContain('--neo-badge-offset-x: 5px');
    expect(host.style.cssText).not.toContain('--neo-badge-offset-y:');
  });
});
