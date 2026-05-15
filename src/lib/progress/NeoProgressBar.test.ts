import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoProgressBar from './NeoProgressBar.svelte';

afterEach(() => {
  cleanup();
});

describe('neoProgressBar — render', { tags: ['jsdom'] }, () => {
  it('renders the bar wrapper with .neo-progress-bar and inner .neo-progress', async () => {
    const { container } = render(NeoProgressBar, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar')).not.toBeNull();
    expect(container.querySelector('.neo-progress-bar > .neo-progress')).not.toBeNull();
  });

  it('forwards value/buffer to the inner NeoProgress', async () => {
    const { container } = render(NeoProgressBar, { props: { value: 42, buffer: 80 } as never });
    await tick();
    const valueEl = container.querySelector<HTMLElement>('.neo-progress-value')!;
    const bufferEl = container.querySelector<HTMLElement>('.neo-progress-buffer')!;
    expect(valueEl.style.cssText).toContain('--neo-progress-value: 42%');
    expect(bufferEl.style.cssText).toContain('--neo-progress-buffer: 80%');
  });

  it('rounded=true adds .neo-rounded', async () => {
    const { container } = render(NeoProgressBar, { props: { rounded: true } as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar.neo-rounded')).not.toBeNull();
  });

  it('borderless=true adds .neo-borderless', async () => {
    const { container } = render(NeoProgressBar, { props: { borderless: true } as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar.neo-borderless')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoProgressBar, { props: { glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar.neo-glass')).not.toBeNull();
  });

  it('track=false also adds .neo-borderless (track implies border)', async () => {
    const { container } = render(NeoProgressBar, { props: { track: false } as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar.neo-borderless')).not.toBeNull();
    expect(container.querySelector('.neo-progress-bar.neo-track')).toBeNull();
  });

  it('direction reflects on data-direction (default right)', async () => {
    const { container, rerender } = render(NeoProgressBar, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-progress-bar')?.getAttribute('data-direction')).toBe('right');
    await rerender({ direction: 'top' } as never);
    await tick();
    expect(container.querySelector('.neo-progress-bar')?.getAttribute('data-direction')).toBe('top');
  });

  it('marks render one .neo-progress-bar-mark per defined position', async () => {
    const { container } = render(NeoProgressBar, { props: { marks: [25, 50, 75] } as never });
    await tick();
    expect(container.querySelectorAll('.neo-progress-bar-mark')).toHaveLength(3);
  });

  it('marks default to displaying their position percentage', async () => {
    const { container } = render(NeoProgressBar, { props: { marks: [33] } as never });
    await tick();
    const mark = container.querySelector('.neo-progress-bar-mark');
    expect(mark?.textContent?.trim()).toBe('33');
    expect(mark?.getAttribute('style') ?? '').toContain('--neo-progress-bar-mark-position: 33%');
  });
});
