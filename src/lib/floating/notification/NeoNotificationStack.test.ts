import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
import type { NeoNotification, NeoNotificationDeQueued, NeoNotificationQueued, NeoNotificationStatuses } from '~/floating/notification/neo-notification.model.js';

import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoNotificationStack.test.svelte';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// The runtime `remove` accepts an optional status arg the service-type Omits;
// declare the precise signature here so the tests can exercise it.
interface StackInstance extends Omit<NeoNotificationStackService, 'add' | 'remove'> {
  add: (item: NeoNotification) => NeoNotificationQueued;
  remove: (id: string, status?: NeoNotificationStatuses) => NeoNotificationDeQueued;
}

function mountStack(props: Record<string, unknown> = {}): { instance: StackInstance } {
  let instance!: StackInstance;
  renderWithPortalTarget(Harness, {
    ...props,
    onInstance: (i: StackInstance | undefined) => {
      if (i) instance = i;
    },
  } as never);
  if (!instance) throw new Error('Stack instance not captured');
  return { instance };
}

function mountStackWithRerender(props: Record<string, unknown> = {}): { instance: StackInstance; rerender: (p: Record<string, unknown>) => Promise<void> } {
  let instance!: StackInstance;
  const { rerender } = renderWithPortalTarget(Harness, {
    ...props,
    onInstance: (i: StackInstance | undefined) => {
      if (i) instance = i;
    },
  } as never);
  if (!instance) throw new Error('Stack instance not captured');
  return {
    instance,
    rerender: async (p: Record<string, unknown>) => rerender({
      ...p,
      onInstance: (i: StackInstance | undefined) => {
        if (i) instance = i;
      },
    } as never),
  };
}

function getStack(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-notification-stack');
}

describe('neoNotificationStack — render', { tags: ['jsdom'] }, () => {
  it('mounts an empty stack with aria-live="polite"', () => {
    mountStack();
    const stack = getStack();
    expect(stack).not.toBeNull();
    expect(stack?.getAttribute('aria-live')).toBe('polite');
    expect(stack?.getAttribute('data-setsize')).toBe('0');
    expect(stack?.getAttribute('data-visible')).toBe('0');
  });

  it('default placement is "bottom-end"', () => {
    mountStack();
    expect(getStack()?.getAttribute('data-placement')).toBe('bottom-end');
  });

  it('uses provided tag (default ol)', () => {
    mountStack();
    expect(getStack()?.tagName).toBe('OL');
  });

  it('honors a custom tag', () => {
    mountStack({ tag: 'ul' });
    expect(getStack()?.tagName).toBe('UL');
  });
});

describe('neoNotificationStack — add / queue lifecycle', { tags: ['jsdom'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('add() returns a queued item with a generated id and pending status', async () => {
    const { instance } = mountStack();
    const queued = instance.add({ title: 'first', duration: 0 });
    await tick();
    expect(typeof queued.id).toBe('string');
    expect(queued.id.length).toBeGreaterThan(0);
    expect(queued.status).toBe('pending');
    expect(queued.title).toBe('first');
    expect(getStack()?.getAttribute('data-setsize')).toBe('1');
  });

  it('add() respects a caller-provided id', async () => {
    const { instance } = mountStack();
    const queued = instance.add({ id: 'fixed-id', duration: 0 });
    await tick();
    expect(queued.id).toBe('fixed-id');
    expect(instance.get('fixed-id')).toBe(queued);
  });

  it('get() returns the queued item by id; undefined for unknown ids', async () => {
    const { instance } = mountStack();
    const queued = instance.add({ id: 'a', duration: 0 });
    await tick();
    expect(instance.get('a')).toBe(queued);
    expect(instance.get('missing')).toBeUndefined();
  });

  it('remove(id) cancels the item, transitions status to "cancelled", and shrinks the queue', async () => {
    const { instance } = mountStack();
    const queued = instance.add({ id: 'r1', duration: 0 });
    await tick();
    const removed = instance.remove('r1');
    await tick();
    expect(removed.status).toBe('cancelled');
    expect(typeof removed.removed).toBe('number');
    expect(instance.get('r1')).toBeUndefined();
    expect(getStack()?.getAttribute('data-setsize')).toBe('0');
    await expect(queued.promise).resolves.toMatchObject({ id: 'r1', status: 'cancelled' });
  });

  it('remove(id, "dismissed") records the supplied status', async () => {
    const { instance } = mountStack();
    instance.add({ id: 'd1', duration: 0 });
    await tick();
    const removed = instance.remove('d1', 'dismissed');
    expect(removed.status).toBe('dismissed');
  });

  it('update(id, …) merges new fields and ignores attempts to overwrite the id', async () => {
    const { instance } = mountStack();
    instance.add({ id: 'u1', title: 'old', duration: 0 });
    await tick();
    const updated = instance.update('u1', { title: 'new', id: 'should-be-ignored' } as unknown as Omit<NeoNotification, 'id'>);
    expect(updated.id).toBe('u1');
    expect(updated.title).toBe('new');
    expect(instance.get('u1')?.title).toBe('new');
  });

  it('clear() empties the queue and resolves each item promise with status="cancelled"', async () => {
    const { instance } = mountStack();
    const a = instance.add({ id: 'a', duration: 0 });
    const b = instance.add({ id: 'b', duration: 0 });
    await tick();
    expect(getStack()?.getAttribute('data-setsize')).toBe('2');
    instance.clear();
    await tick();
    expect(getStack()?.getAttribute('data-setsize')).toBe('0');
    // The de-queued payload (resolved via the cancel/expire path) is the canonical
    // source of truth for the final status — see the it.skip below for the
    // queued-object staleness contract.
    await expect(a.promise).resolves.toMatchObject({ status: 'cancelled' });
    await expect(b.promise).resolves.toMatchObject({ status: 'cancelled' });
  });

  it('cancelled queued object exposes status="cancelled"', async () => {
    const { instance } = mountStack();
    const a = instance.add({ id: 'a', duration: 0 });
    await tick();
    instance.remove('a');
    await tick();
    expect(a.status).toBe('cancelled');
  });
});

describe('neoNotificationStack — duration / restart / expiry', { tags: ['jsdom'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('items with duration auto-expire and resolve their promise with status="expired"', async () => {
    const { instance } = mountStack();
    const queued = instance.add({ id: 'e1', duration: 1000 });
    await tick();
    expect(instance.get('e1')?.status).toBe('pending');
    vi.advanceTimersByTime(1000);
    await tick();
    expect(instance.get('e1')).toBeUndefined();
    await expect(queued.promise).resolves.toMatchObject({ status: 'expired' });
  });

  it('restart(id, { duration }) replaces the timeout with the new duration', async () => {
    const { instance } = mountStack();
    instance.add({ id: 'r2', duration: 1000 });
    await tick();
    vi.advanceTimersByTime(500);
    instance.restart('r2', { duration: 2000 });
    vi.advanceTimersByTime(1500);
    await tick();
    // 500ms (orig) + 1500ms = 2000ms total elapsed; restart reset the clock at 500ms,
    // and we've only advanced 1500ms post-restart against a 2000ms duration.
    expect(instance.get('r2')).not.toBeUndefined();
    vi.advanceTimersByTime(600);
    await tick();
    expect(instance.get('r2')).toBeUndefined();
  });

  it('items with duration=0 (or undefined) do not auto-expire', async () => {
    const { instance } = mountStack();
    instance.add({ id: 'sticky', duration: 0 });
    await tick();
    vi.advanceTimersByTime(60_000);
    await tick();
    expect(instance.get('sticky')).not.toBeUndefined();
  });
});

describe('neoNotificationStack — pause / resume', { tags: ['jsdom'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('pause(true) halts the duration timer for items where pauseOnHover is enabled', async () => {
    const { instance } = mountStack({ pauseOnHover: true });
    instance.add({ id: 'p1', duration: 1000 });
    await tick();
    vi.advanceTimersByTime(500);
    instance.pause(true);
    vi.advanceTimersByTime(2000);
    await tick();
    // Still queued — paused before the original duration would have elapsed.
    expect(instance.get('p1')).not.toBeUndefined();
  });

  it('pause(false) resumes pending items after the resume debounce', async () => {
    const { instance } = mountStack({ pauseOnHover: true, delay: 0 });
    instance.add({ id: 'p2', duration: 1000 });
    await tick();
    vi.advanceTimersByTime(400);
    instance.pause(true);
    vi.advanceTimersByTime(2000);
    instance.pause(false);
    // resume is debounced by `delay`; flush it.
    vi.advanceTimersByTime(0);
    // remaining duration after resume = 1000 - 400 = 600ms
    vi.advanceTimersByTime(700);
    await tick();
    expect(instance.get('p2')).toBeUndefined();
  });

  it('resume waits the configured delay before restarting paused items (delay > 0)', async () => {
    const { instance } = mountStack({ pauseOnHover: true, delay: 50 });
    instance.add({ id: 'p-delay', duration: 1000 });
    await tick();
    vi.advanceTimersByTime(400);
    instance.pause(true);
    instance.pause(false);
    // Within the resume debounce window — item should NOT have been restarted.
    vi.advanceTimersByTime(40);
    await tick();
    expect(instance.get('p-delay')).not.toBeUndefined();
    expect(instance.get('p-delay')?.paused).toBeTypeOf('number');
    // After the window, resume runs and re-arms the timeout for 600ms.
    vi.advanceTimersByTime(20);
    await tick();
    expect(instance.get('p-delay')?.paused).toBeUndefined();
    vi.advanceTimersByTime(700);
    await tick();
    expect(instance.get('p-delay')).toBeUndefined();
  });

  it('changing the delay prop after mount rebuilds the resume debounce window', async () => {
    const { instance, rerender } = mountStackWithRerender({ pauseOnHover: true, delay: 500 });
    instance.add({ id: 'p-rebuild', duration: 1000 });
    await tick();
    vi.advanceTimersByTime(400);
    instance.pause(true);
    await rerender({ pauseOnHover: true, delay: 10 });
    await tick();
    instance.pause(false);
    // Old delay was 500; if the debounce wasn't rebuilt, advancing 20ms wouldn't
    // be enough. New delay=10 means the resume should fire within that window.
    vi.advanceTimersByTime(20);
    await tick();
    expect(instance.get('p-rebuild')?.paused).toBeUndefined();
  });

  it('items with pauseOnHover=false are NOT halted by stack-level pause', async () => {
    const { instance } = mountStack({ pauseOnHover: true });
    instance.add({ id: 'p3', duration: 1000, pauseOnHover: false });
    await tick();
    vi.advanceTimersByTime(500);
    instance.pause(true);
    vi.advanceTimersByTime(600);
    await tick();
    // The per-item override means the timer kept running and fired at 1000ms.
    expect(instance.get('p3')).toBeUndefined();
  });
});

describe('neoNotificationStack — max / visible window', { tags: ['jsdom'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('default max=3 (collapsed) limits the visible window but keeps the queue intact', async () => {
    const { instance } = mountStack();
    instance.add({ id: 'm1', duration: 0 });
    instance.add({ id: 'm2', duration: 0 });
    instance.add({ id: 'm3', duration: 0 });
    instance.add({ id: 'm4', duration: 0 });
    instance.add({ id: 'm5', duration: 0 });
    await tick();
    const stack = getStack();
    expect(stack?.getAttribute('data-setsize')).toBe('5');
    expect(stack?.getAttribute('data-visible')).toBe('3');
    expect(stack?.getAttribute('data-max')).toBe('3');
  });

  it('explicit max overrides the default', async () => {
    const { instance } = mountStack({ max: 2 });
    instance.add({ id: 'm1', duration: 0 });
    instance.add({ id: 'm2', duration: 0 });
    instance.add({ id: 'm3', duration: 0 });
    await tick();
    const stack = getStack();
    expect(stack?.getAttribute('data-setsize')).toBe('3');
    expect(stack?.getAttribute('data-visible')).toBe('2');
  });

  it('expand=true bumps the default max to 6', async () => {
    const { instance } = mountStack({ expand: true });
    for (let i = 0; i < 7; i++) instance.add({ id: `e${i}`, duration: 0 });
    await tick();
    const stack = getStack();
    expect(stack?.getAttribute('data-max')).toBe('6');
    expect(stack?.getAttribute('data-visible')).toBe('6');
  });
});

describe('neoNotificationStack — onChange / status transitions', { tags: ['jsdom'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('cancel emits Status event with the cancelled status', async () => {
    const onChange = vi.fn();
    const { instance } = mountStack();
    instance.add({ id: 'c1', duration: 0, onChange });
    await tick();
    instance.remove('c1');
    expect(onChange).toHaveBeenCalledWith('status', expect.objectContaining({ id: 'c1' }));
  });

  it('expiry emits a Status event for the item', async () => {
    const onChange = vi.fn();
    const { instance } = mountStack();
    const queued = instance.add({ id: 'x1', duration: 500, onChange });
    await tick();
    vi.advanceTimersByTime(500);
    await tick();
    expect(onChange).toHaveBeenCalledWith('status', expect.objectContaining({ id: 'x1' }));
    // The de-queued promise carries the canonical final status.
    await expect(queued.promise).resolves.toMatchObject({ status: 'expired' });
  });

  it('expiry emits Status event with status="expired" on the payload', async () => {
    const onChange = vi.fn();
    const { instance } = mountStack();
    instance.add({ id: 'x1', duration: 500, onChange });
    await tick();
    vi.advanceTimersByTime(500);
    await tick();
    expect(onChange).toHaveBeenCalledWith(
      'status',
      expect.objectContaining({ id: 'x1', status: 'expired' }),
    );
  });

  it('update fires the Update event', async () => {
    const onChange = vi.fn();
    const { instance } = mountStack();
    instance.add({ id: 'u2', duration: 0, onChange });
    await tick();
    instance.update('u2', { title: 'changed' });
    expect(onChange).toHaveBeenCalledWith('update', expect.objectContaining({ id: 'u2', title: 'changed' }));
  });

  it('restart fires the Restart event', async () => {
    const onChange = vi.fn();
    const { instance } = mountStack();
    instance.add({ id: 'rs1', duration: 1000, onChange });
    await tick();
    onChange.mockClear();
    instance.restart('rs1', { duration: 2000 });
    expect(onChange).toHaveBeenCalledWith('restart', expect.objectContaining({ id: 'rs1' }));
  });
});

describe('neoNotificationStack — error paths', { tags: ['jsdom'] }, () => {
  it('remove(id) on a missing id throws NotFound', () => {
    const { instance } = mountStack();
    expect(() => instance.remove('nope')).toThrow();
  });

  it('update(id, …) on a missing id throws NotFound', () => {
    const { instance } = mountStack();
    expect(() => instance.update('nope', { title: 'x' })).toThrow();
  });

  it('restart(id) on a missing id throws NotFound', () => {
    const { instance } = mountStack();
    expect(() => instance.restart('nope')).toThrow();
  });
});
