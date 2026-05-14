import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
import type { NeoNotification, NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

import { cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './NeoNotificationStackHarness.test.svelte';

afterEach(() => {
  cleanup();
});

interface StackInstance extends Omit<NeoNotificationStackService, 'add'> {
  add: (item: NeoNotification) => NeoNotificationQueued;
}

function mountStack(props: Record<string, unknown> = {}): StackInstance {
  let instance!: StackInstance;
  renderWithPortalTarget(Harness, {
    ...props,
    onInstance: (i: StackInstance | undefined) => {
      if (i) instance = i;
    },
  } as never);
  if (!instance) throw new Error('Stack instance not captured');
  return instance;
}

function getNotification(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-notification');
}

describe('neoNotification — render & content', () => {
  it('renders title / subtitle / content text from the queued item', async () => {
    const instance = mountStack();
    instance.add({
      id: 'n1',
      duration: 0,
      title: 'Heads up',
      subtitle: 'something happened',
      content: 'long content here',
    });
    await tick();
    const notif = getNotification();
    expect(notif).not.toBeNull();
    expect(notif?.querySelector('.neo-notification-title')?.textContent).toBe('Heads up');
    expect(notif?.querySelector('.neo-notification-subtitle')?.textContent).toBe('something happened');
    expect(notif?.querySelector('.neo-notification-content')?.textContent).toContain('long content here');
  });

  it('omits sections that aren\'t provided', async () => {
    const instance = mountStack();
    instance.add({ id: 'n2', duration: 0, title: 'only-title' });
    await tick();
    const notif = getNotification();
    expect(notif?.querySelector('.neo-notification-title')?.textContent).toBe('only-title');
    expect(notif?.querySelector('.neo-notification-subtitle')).toBeNull();
    expect(notif?.querySelector('.neo-notification-content')).toBeNull();
  });

  it('uses role="status" for non-error notifications', async () => {
    const instance = mountStack();
    instance.add({ id: 'n3', duration: 0, type: 'info' });
    await tick();
    expect(getNotification()?.getAttribute('role')).toBe('status');
  });

  it('uses role="alert" for error notifications', async () => {
    const instance = mountStack();
    instance.add({ id: 'n4', duration: 0, type: 'error' });
    await tick();
    expect(getNotification()?.getAttribute('role')).toBe('alert');
  });

  it.each([
    ['success'],
    ['error'],
    ['warning'],
    ['info'],
  ] as const)('renders an SVG icon in the before slot when type=%s', async (type) => {
    const instance = mountStack();
    instance.add({ id: `t-${type}`, duration: 0, type });
    await tick();
    const before = getNotification()?.querySelector('.neo-notification-before');
    expect(before).not.toBeNull();
    expect(before?.querySelector('svg')).not.toBeNull();
  });

  it('does not render the before slot when type=default and no loading/before', async () => {
    const instance = mountStack();
    instance.add({ id: 'n-def', duration: 0, type: 'default' });
    await tick();
    expect(getNotification()?.querySelector('.neo-notification-before')).toBeNull();
  });

  it('renders a loading spinner in the before slot when loading=true (overrides type)', async () => {
    const instance = mountStack();
    instance.add({ id: 'n-load', duration: 0, type: 'success', loading: true });
    await tick();
    const before = getNotification()?.querySelector('.neo-notification-before');
    expect(before?.querySelector('svg')).not.toBeNull();
  });

  it('aria-posinset / aria-setsize / data-index reflect the queue position', async () => {
    const instance = mountStack();
    instance.add({ id: 'p1', duration: 0 });
    instance.add({ id: 'p2', duration: 0 });
    await tick();
    const items = document.querySelectorAll<HTMLElement>('.neo-notification-stack-item');
    expect(items.length).toBe(2);
    items.forEach((el) => {
      expect(el.getAttribute('aria-setsize')).toBe('2');
      expect(el.getAttribute('aria-posinset')).not.toBeNull();
    });
  });
});

describe('neoNotification — close button', () => {
  it('renders a close button by default (close=true)', async () => {
    const instance = mountStack();
    instance.add({ id: 'c1', duration: 0 });
    await tick();
    expect(document.querySelector('.neo-notification-close-button')).not.toBeNull();
  });

  it('omits the close button when close=false (per-item)', async () => {
    const instance = mountStack();
    instance.add({ id: 'c2', duration: 0, close: false });
    await tick();
    expect(document.querySelector('.neo-notification-close-button')).toBeNull();
  });

  it('omits the close button when close=false (stack-level default)', async () => {
    const instance = mountStack({ close: false });
    instance.add({ id: 'c3', duration: 0 });
    await tick();
    expect(document.querySelector('.neo-notification-close-button')).toBeNull();
  });

  it('clicking close removes the item from the queue', async () => {
    const user = userEvent.setup();
    const instance = mountStack();
    const queued = instance.add({ id: 'c4', duration: 0 });
    await tick();
    const btn = document.querySelector<HTMLButtonElement>('.neo-notification-close-button');
    expect(btn).not.toBeNull();
    await user.click(btn!);
    await tick();
    // Queue is the source of truth; the DOM may linger during the out transition.
    await expect(queued.promise).resolves.toMatchObject({ status: 'dismissed' });
  });
});

describe('neoNotification — action button', () => {
  it('renders an action button when actionProps is provided on the item', async () => {
    const instance = mountStack();
    instance.add({
      id: 'a1',
      duration: 0,
      actionProps: { label: 'Retry', onclick: () => {} },
    });
    await tick();
    expect(document.querySelector('.neo-notification-action-button')).not.toBeNull();
  });

  it('clicking action invokes onclick and leaves the item queued when onclick returns falsy', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn(() => undefined);
    const instance = mountStack();
    instance.add({ id: 'a2', duration: 0, actionProps: { label: 'A', onclick } });
    await tick();
    const btn = document.querySelector<HTMLButtonElement>('.neo-notification-action-button');
    await user.click(btn!);
    await tick();
    expect(onclick).toHaveBeenCalledTimes(1);
    // Item still queued — onclick returned falsy.
    expect(document.querySelector('.neo-notification-stack-item')).not.toBeNull();
  });

  it('action onclick returning a non-string truthy status falls back to "dismissed"', async () => {
    // `NeoNotificationClickResult` only allows status strings | false | void,
    // but the runtime branch at NeoSimpleNotification.svelte:80 also handles
    // the historical `true` case — assert the fallback works.
    const user = userEvent.setup();
    const onclick = vi.fn(() => true as unknown as 'dismissed');
    const instance = mountStack();
    const queued = instance.add({ id: 'a3', duration: 0, actionProps: { label: 'A', onclick } });
    await tick();
    const btn = document.querySelector<HTMLButtonElement>('.neo-notification-action-button');
    await user.click(btn!);
    await tick();
    await expect(queued.promise).resolves.toMatchObject({ status: 'dismissed' });
  });

  it('action onclick returning a string sets that string as the final status', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn(() => 'cancelled' as const);
    const instance = mountStack();
    const queued = instance.add({ id: 'a4', duration: 0, actionProps: { label: 'A', onclick } });
    await tick();
    await user.click(document.querySelector<HTMLButtonElement>('.neo-notification-action-button')!);
    await tick();
    await expect(queued.promise).resolves.toMatchObject({ status: 'cancelled' });
  });
});
