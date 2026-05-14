import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoPortalTargetHarness.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoPortalTarget', () => {
  it('renders its children inline (no wrapper element)', async () => {
    const { container } = render(Harness, {});
    await tick();
    const host = container.querySelector<HTMLElement>('[data-testid="portal-target-host"]');
    const body = container.querySelector<HTMLElement>('[data-testid="portal-target-body"]');
    expect(host).not.toBeNull();
    expect(body).not.toBeNull();
    expect(host?.contains(body)).toBe(true);
    // No extra DOM element introduced between host and body
    expect(body?.parentElement).toBe(host);
  });

  it('renders nothing visible when no children are provided', async () => {
    const { container } = render(Harness, { props: { children: undefined } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('[data-testid="portal-target-host"]');
    expect(host).not.toBeNull();
    // Default fallback span is rendered when no body snippet supplied
    expect(host?.querySelector('[data-testid="portal-target-body"]')).not.toBeNull();
  });
});
