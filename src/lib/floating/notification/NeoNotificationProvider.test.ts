import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
import type { NeoNotification, NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoNotificationProvider.test.svelte';

afterEach(() => {
  cleanup();
});

interface Service extends Omit<NeoNotificationStackService, 'add' | 'id'> {
  id: string;
  add: (item: NeoNotification) => NeoNotificationQueued;
}

async function captureService(props: Record<string, unknown> = {}): Promise<{
  service?: Service;
  error?: unknown;
}> {
  let resolveOnce!: (value: { service?: Service; error?: unknown }) => void;
  const settled = new Promise<{ service?: Service; error?: unknown }>((resolve) => {
    resolveOnce = resolve;
  });
  renderWithPortalTarget(Harness, {
    ...props,
    onService: (service: Service | undefined, error?: unknown) => {
      resolveOnce({ service, error });
    },
  } as never);
  await tick();
  await tick();
  return settled;
}

describe('neoNotificationProvider — default stack registration', { tags: ['jsdom'] }, () => {
  it('registers a default stack and exposes it via useNotificationService()', async () => {
    const { service, error } = await captureService();
    expect(error).toBeUndefined();
    expect(service).toBeDefined();
    expect(typeof service?.id).toBe('string');
    expect(service?.id.startsWith('default-')).toBe(true);
  });

  it('honors a caller-supplied default stack id', async () => {
    const { service } = await captureService({ stack: { id: 'main' } });
    await tick();
    expect(service?.id).toBe('main');
  });

  it('omits the default stack when stack=false', async () => {
    const { service, error } = await captureService({ stack: false });
    await tick();
    expect(service).toBeUndefined();
    expect(error).toBeDefined();
  });
});

describe('neoNotificationProvider — service lookup', { tags: ['jsdom'] }, () => {
  it('retrieves a specific stack by id', async () => {
    const { service } = await captureService({
      stack: { id: 'a' },
      extraStacks: [{ id: 'b' }],
      serviceId: 'b',
    });
    await tick();
    expect(service?.id).toBe('b');
  });

  it('returns the first registered stack when no id is provided', async () => {
    // Children mount before the provider's default stack, so the extra stack
    // registers first and wins the no-id lookup.
    const { service } = await captureService({
      stack: { id: 'late' },
      extraStacks: [{ id: 'early' }],
    });
    await tick();
    expect(service?.id).toBe('early');
  });

  it('throws ServiceNotFound when the requested id does not exist', async () => {
    const { service, error } = await captureService({
      stack: { id: 'a' },
      serviceId: 'missing',
    });
    await tick();
    expect(service).toBeUndefined();
    expect(error).toBeDefined();
    expect((error as Error).message).toMatch(/missing/i);
  });
});

describe('neoNotificationProvider — duplicate id', { tags: ['jsdom'] }, () => {
  it('throws DuplicateId when two stacks register the same id', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderWithPortalTarget(Harness, {
        stack: { id: 'dup' },
        extraStacks: [{ id: 'dup' }],
      } as never);
    }).toThrow();
    errorSpy.mockRestore();
  });
});

describe('neoNotificationProvider — service contract', { tags: ['jsdom'] }, () => {
  it('the service exposes add/remove/get/update/restart/clear/pause', async () => {
    const { service } = await captureService();
    await tick();
    expect(typeof service?.add).toBe('function');
    expect(typeof service?.remove).toBe('function');
    expect(typeof service?.get).toBe('function');
    expect(typeof service?.update).toBe('function');
    expect(typeof service?.restart).toBe('function');
    expect(typeof service?.clear).toBe('function');
    expect(typeof service?.pause).toBe('function');
  });

  it('add() through the service queues an item retrievable via get()', async () => {
    const { service } = await captureService();
    await tick();
    const queued = service!.add({ id: 'x', duration: 0, title: 'hi' });
    expect(queued.id).toBe('x');
    expect(service!.get('x')).toBe(queued);
  });
});
