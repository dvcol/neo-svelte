import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
import type { NeoNotification, NeoNotificationDeQueued, NeoNotificationQueued, NeoNotificationStatuses } from '~/floating/notification/neo-notification.model.js';

import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from '~/floating/notification/NeoNotificationStack.test.svelte';

import VisualHarness from './TestNotificationStack.browser.test.svelte';

interface StackInstance extends Omit<NeoNotificationStackService, 'add' | 'remove'> {
  add: (item: NeoNotification) => NeoNotificationQueued;
  remove: (id: string, status?: NeoNotificationStatuses) => NeoNotificationDeQueued;
}

afterEach(() => {
  cleanup();
});

function getStack(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-notification-stack');
}

function getItems(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-notification-stack > *'));
}

async function mountStack(props: Record<string, unknown> = {}, harness: 'jsdom' | 'visual' = 'jsdom'): Promise<{ instance: StackInstance }> {
  let instance: StackInstance | undefined;
  const Component = harness === 'visual' ? VisualHarness : Harness;
  render(Component, {
    props: {
      ...props,
      onInstance: (i: StackInstance | undefined) => {
        if (i) instance = i;
      },
    } as never,
  });
  await vi.waitFor(() => {
    if (!instance) throw new Error('stack instance not captured');
    if (!getStack()) throw new Error('stack not mounted');
  }, { timeout: 1000, interval: 16 });
  return { instance: instance! };
}

describe('neoNotificationStack — placement (real layout)', { tags: ['browser'] }, () => {
  it.each(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'] as const)(
    'data-placement="%s" reflects on the stack root',
    async (placement) => {
      await mountStack({ placement });
      expect(getStack()?.getAttribute('data-placement')).toBe(placement);
    },
  );

  it.each(['top', 'bottom'] as const)('placement="%s" anchors the stack to that vertical edge of the viewport', async (placement) => {
    await setViewport('desktop');
    const { instance } = await mountStack({ placement });
    instance.add({ id: 'a1', title: 'one', duration: 0 });
    instance.add({ id: 'a2', title: 'two', duration: 0 });
    await vi.waitFor(() => {
      expect(getItems().length).toBeGreaterThanOrEqual(1);
    });
    const stack = getStack()!;
    const rect = stack.getBoundingClientRect();
    if (placement === 'top') expect(rect.top).toBeLessThanOrEqual(window.innerHeight / 2);
    if (placement === 'bottom') expect(rect.bottom).toBeGreaterThan(window.innerHeight / 2);
  });
});

describe('neoNotificationStack — stacking & visibility', { tags: ['browser'] }, () => {
  it('reflects the queue size in data-setsize and exposes a bounded data-visible window', async () => {
    const { instance } = await mountStack({ max: 2 });
    instance.add({ id: 'a', title: 'a', duration: 0 });
    instance.add({ id: 'b', title: 'b', duration: 0 });
    instance.add({ id: 'c', title: 'c', duration: 0 });
    await vi.waitFor(() => {
      const stack = getStack()!;
      expect(stack.getAttribute('data-setsize')).toBe('3');
      // data-visible is a numeric string capped by `max`.
      const visible = Number(stack.getAttribute('data-visible'));
      expect(visible).toBeGreaterThan(0);
      expect(visible).toBeLessThanOrEqual(2);
    });
  });

  it('expand=true broadens the default visible window from 3 to 6', async () => {
    const { instance } = await mountStack({ expand: true });
    for (let i = 0; i < 6; i++) instance.add({ id: `e${i}`, title: `e${i}`, duration: 0 });
    await vi.waitFor(() => {
      const stack = getStack()!;
      expect(stack.getAttribute('data-max')).toBe('6');
      expect(stack.getAttribute('data-setsize')).toBe('6');
    });
  });
});

describe('neoNotificationStack — auto-dismiss & manual remove (real timers)', { tags: ['browser'] }, () => {
  it('items with duration auto-expire', async () => {
    const { instance } = await mountStack();
    const queued = instance.add({ id: 'expiring', title: 'tick', duration: 200 });
    await vi.waitFor(() => {
      expect(instance.get('expiring')).toBeUndefined();
    }, { timeout: 1500 });
    await expect(queued.promise).resolves.toMatchObject({ status: 'expired' });
  });

  it('items with duration=0 do not auto-expire', async () => {
    const { instance } = await mountStack();
    instance.add({ id: 'sticky', title: 'sticky', duration: 0 });
    await new Promise(r => setTimeout(r, 200));
    expect(instance.get('sticky')).toBeDefined();
  });

  it('remove(id, "dismissed") empties the slot and resolves the promise', async () => {
    const { instance } = await mountStack();
    const queued = instance.add({ id: 'r1', title: 'manual', duration: 0 });
    await vi.waitFor(() => {
      expect(getItems().length).toBeGreaterThan(0);
    });
    instance.remove('r1', 'dismissed');
    await expect(queued.promise).resolves.toMatchObject({ status: 'dismissed' });
    await vi.waitFor(() => {
      expect(getStack()?.getAttribute('data-setsize')).toBe('0');
    });
  });
});

describe('neoNotificationStack — pauseOnHover (real pointer)', { tags: ['browser'] }, () => {
  it('hovering a notification with pauseOnHover=true halts the auto-expire timer', async () => {
    const user = userEvent.setup();
    const { instance } = await mountStack({ pauseOnHover: true });
    instance.add({ id: 'h1', title: 'hover me', duration: 250 });
    const item = await vi.waitFor(() => {
      const [el] = getItems();
      if (!el) throw new Error('item not mounted');
      return el;
    });
    await user.hover(item);
    // Wait past the original duration; the timer should have been paused.
    await new Promise(r => setTimeout(r, 400));
    expect(instance.get('h1')).toBeDefined();
    await user.unhover(item);
    // Resume is debounced 900ms; remaining duration runs on top — give it 2.5s headroom.
    await vi.waitFor(() => {
      expect(instance.get('h1')).toBeUndefined();
    }, { timeout: 2500 });
  });

  it('pauseOnHover=false keeps the timer running while hovered', async () => {
    const user = userEvent.setup();
    const { instance } = await mountStack({ pauseOnHover: false });
    instance.add({ id: 'h2', title: 'no pause', duration: 200 });
    const item = await vi.waitFor(() => {
      const [el] = getItems();
      if (!el) throw new Error('item not mounted');
      return el;
    });
    await user.hover(item);
    await vi.waitFor(() => {
      expect(instance.get('h2')).toBeUndefined();
    }, { timeout: 1500 });
  });
});

describe('neoNotificationStack — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  for (const placement of ['top-end', 'bottom-end'] as const) {
    it(`stack of three notifications at ${placement} (desktop)`, async () => {
      await setViewport('desktop');
      const { instance } = await mountStack({ placement, expand: true, rounded: true }, 'visual');
      // Richer content matrix mirrors DemoNotification.svelte: severity icon
      // + title + subtitle + content + action + progress + close states.
      instance.add({
        id: 'v1',
        type: 'info',
        title: 'Update available',
        subtitle: 'v2.4.0',
        content: 'A new version is ready to install. Restart to apply.',
        actionProps: { label: 'Restart', onclick: () => undefined },
        close: true,
        duration: 0,
      });
      instance.add({
        id: 'v2',
        type: 'success',
        title: 'Saved',
        content: 'Your changes were saved successfully.',
        close: true,
        duration: 0,
      });
      instance.add({
        id: 'v3',
        type: 'warning',
        title: 'Uploading…',
        content: 'Large file transfer in progress.',
        progress: true,
        close: false,
        duration: 10000,
      });
      instance.add({
        id: 'v4',
        type: 'error',
        title: 'Sync failed',
        subtitle: 'connection lost',
        content: 'Unable to reach the server. Will retry automatically.',
        actionProps: { label: 'Retry now', onclick: () => undefined },
        close: true,
        duration: 0,
      });
      await vi.waitFor(() => {
        expect(getItems().length).toBeGreaterThanOrEqual(4);
      });
      // Wait for opacity to settle.
      await vi.waitFor(() => {
        for (const item of getItems()) {
          expect(getComputedStyle(item).opacity).toBe('1');
        }
      });
      // CircleLoading SMIL spinners + lingering Svelte fly-ins; wait & freeze.
      await new Promise(r => setTimeout(r, 600));
      const stack = getStack();
      if (stack) freezeSvgAnimations(stack);
      if (stack) await waitForVisualStability(stack);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoNotificationStack', `stack-${placement}`, 'desktop'),
      );
    });
  }
});
