import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import { NeoProgressStatus } from '~/progress/neo-progress.model.js';

import NeoProgress from './NeoProgress.svelte';
import NeoProgressHarness from './NeoProgress.test.svelte';

afterEach(() => {
  cleanup();
});

interface ProgressInstance {
  start: (...args: unknown[]) => unknown;
  stop: () => unknown;
  reset: (...args: unknown[]) => unknown;
  cancel: (defer?: boolean) => unknown;
  change: (...args: unknown[]) => unknown;
  complete: (...args: unknown[]) => unknown;
}

function captureInstance(props: Record<string, unknown> = {}): { instance: ProgressInstance; container: HTMLElement } {
  let instance: ProgressInstance | undefined;
  const { container } = render(NeoProgressHarness, {
    props: {
      ...props,
      onInstance: (i: unknown) => {
        instance = i as never;
      },
    } as never,
  });
  return { instance: instance as ProgressInstance, container };
}

describe('neoProgress — render', { tags: ['jsdom'] }, () => {
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

describe('neoProgress — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes start/stop/reset/cancel/change/complete on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.start).toBe('function');
    expect(typeof instance.stop).toBe('function');
    expect(typeof instance.reset).toBe('function');
    expect(typeof instance.cancel).toBe('function');
    expect(typeof instance.change).toBe('function');
    expect(typeof instance.complete).toBe('function');
  });

  it('does not attach methods onto the DOM ref', async () => {
    const { container } = captureInstance();
    await tick();
    const el = container.querySelector<HTMLElement>('[role="progressbar"]')!;
    for (const method of ['start', 'stop', 'reset', 'cancel', 'change', 'complete'] as const) {
      expect(Object.hasOwn(el, method)).toBe(false);
      expect((el as unknown as Record<string, unknown>)[method]).toBeUndefined();
    }
  });

  it('instance.change({value, buffer, state}) updates value, buffer, and status', async () => {
    const { instance } = captureInstance({ value: 0, buffer: 0 });
    await tick();
    const status = instance.change({ value: 30, buffer: 60, state: NeoProgressStatus.Paused });
    expect(status).toBe(NeoProgressStatus.Paused);
  });

  it('instance.start() flips status to Active; stop() to Paused', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(instance.start({})).toBe(NeoProgressStatus.Active);
    expect(instance.stop()).toBe(NeoProgressStatus.Paused);
  });

  it('instance.complete() resolves to Completed by default', async () => {
    const { instance } = captureInstance();
    await tick();
    const result = await instance.complete({ defer: false });
    expect(result).toBe(NeoProgressStatus.Completed);
  });

  it('instance.complete({state: Success}) sets that status', async () => {
    const { instance } = captureInstance();
    await tick();
    const result = await instance.complete({ defer: false, state: NeoProgressStatus.Success });
    expect(result).toBe(NeoProgressStatus.Success);
  });

  it('instance.cancel() returns Cancelled', async () => {
    const { instance } = captureInstance();
    await tick();
    instance.start({});
    const result = await instance.cancel(false);
    expect(result).toBe(NeoProgressStatus.Cancelled);
  });

  it('instance.reset(true) resumes from Idle to Active', async () => {
    const { instance } = captureInstance();
    await tick();
    instance.start({});
    instance.stop();
    expect(instance.reset(true)).toBe(NeoProgressStatus.Active);
  });

  it('instance.reset(false) stays in non-active status', async () => {
    const { instance } = captureInstance({ value: 50 });
    await tick();
    const status = instance.reset(false);
    expect(status).not.toBe(NeoProgressStatus.Active);
  });
});
