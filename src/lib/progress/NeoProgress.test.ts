import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoProgress from './NeoProgress.svelte';

afterEach(() => {
  cleanup();
});

describe('neoProgress — render', () => {
  it('renders an element with role=progressbar and .neo-progress', async () => {
    const { container } = render(NeoProgress, { props: {} as never });
    await tick();
    const el = container.querySelector('[role="progressbar"]');
    expect(el).not.toBeNull();
    expect(el?.classList.contains('neo-progress')).toBe(true);
  });

  it('reflects min/max/value via data attributes', async () => {
    const { container } = render(NeoProgress, { props: { min: 0, max: 200, value: 50 } as never });
    await tick();
    const el = container.querySelector<HTMLElement>('[role="progressbar"]')!;
    expect(el.dataset.min).toBe('0');
    expect(el.dataset.max).toBe('200');
    expect(el.dataset.value).toBe('50');
  });

  it('value=50 (50% of default 100) sets the --neo-progress-value to 50%', async () => {
    const { container } = render(NeoProgress, { props: { value: 50 } as never });
    await tick();
    const valueEl = container.querySelector<HTMLElement>('.neo-progress-value')!;
    expect(valueEl.style.cssText).toContain('--neo-progress-value: 50%');
  });

  it('buffer >= value sets --neo-progress-buffer above value', async () => {
    const { container } = render(NeoProgress, { props: { value: 30, buffer: 70 } as never });
    await tick();
    const bufferEl = container.querySelector<HTMLElement>('.neo-progress-buffer')!;
    expect(bufferEl.style.cssText).toContain('--neo-progress-buffer: 70%');
  });

  it('value clamps to max when above', async () => {
    const { container } = render(NeoProgress, { props: { value: 9999 } as never });
    await tick();
    const valueEl = container.querySelector<HTMLElement>('.neo-progress-value')!;
    expect(valueEl.style.cssText).toContain('--neo-progress-value: 100%');
  });

  it('indeterminate=true adds .neo-indeterminate and reads 100% width', async () => {
    const { container } = render(NeoProgress, { props: { indeterminate: true } as never });
    await tick();
    const el = container.querySelector('[role="progressbar"]')!;
    expect(el.classList.contains('neo-indeterminate')).toBe(true);
    const valueEl = container.querySelector<HTMLElement>('.neo-progress-value')!;
    expect(valueEl.style.cssText).toContain('--neo-progress-value: 100%');
  });

  it('track defaults to true (.neo-track); track=false omits it', async () => {
    const { container, rerender } = render(NeoProgress, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-progress.neo-track')).not.toBeNull();
    await rerender({ track: false } as never);
    await tick();
    expect(container.querySelector('.neo-progress.neo-track')).toBeNull();
  });

  it('immediate=true adds .neo-immediate', async () => {
    const { container } = render(NeoProgress, { props: { immediate: true } as never });
    await tick();
    expect(container.querySelector('.neo-progress.neo-immediate')).not.toBeNull();
  });

  it('direction reflects on data-direction (default right)', async () => {
    const { container, rerender } = render(NeoProgress, { props: {} as never });
    await tick();
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('data-direction')).toBe('right');
    await rerender({ direction: 'left' } as never);
    await tick();
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('data-direction')).toBe('left');
  });

  it('status=active reflects in .neo-controlled and data-status', async () => {
    const { container } = render(NeoProgress, { props: { status: 'active', value: 25 } as never });
    await tick();
    const el = container.querySelector<HTMLElement>('[role="progressbar"]')!;
    expect(el.classList.contains('neo-controlled')).toBe(true);
    expect(el.dataset.status).toBe('active');
  });
});
