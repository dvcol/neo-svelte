import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoPortal.test.svelte';

afterEach(() => {
  cleanup();
});

function getHost(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('[data-testid="portal-host"]');
}

function getContent(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('[data-testid="portal-content"]');
}

describe('neoPortal — enabled toggle', { tags: ['jsdom'] }, () => {
  it('renders inline (inside the host) when enabled=false (default)', async () => {
    const { container } = render(Harness, { props: { bodyText: 'inline' } });
    await tick();
    const host = getHost(container);
    const content = getContent(container);
    expect(host).not.toBeNull();
    expect(content).not.toBeNull();
    expect(host?.contains(content)).toBe(true);
  });

  it('mounts content into document.body (the default target) when enabled=true', async () => {
    const { container } = render(Harness, { props: { enabled: true, bodyText: 'portaled' } });
    await tick();
    const host = getHost(container);
    const content = getContent();
    expect(content).not.toBeNull();
    expect(host?.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);
  });

  it('mounts into a caller-supplied target element', async () => {
    const target = document.createElement('div');
    target.id = 'custom-portal-target';
    document.body.appendChild(target);
    try {
      render(Harness, { props: { enabled: true, target, bodyText: 'in-custom' } });
      await tick();
      const content = getContent(target);
      expect(content).not.toBeNull();
      expect(content?.textContent).toBe('in-custom');
    } finally {
      target.remove();
    }
  });

  it('removes portaled content when the host unmounts', async () => {
    const { unmount } = render(Harness, { props: { enabled: true, bodyText: 'cleanup' } });
    await tick();
    expect(getContent()).not.toBeNull();
    unmount();
    await tick();
    expect(getContent()).toBeNull();
  });

  it('multiple portals coexist without colliding', async () => {
    const { container: c1 } = render(Harness, { props: { enabled: true, bodyText: 'one' } });
    const { container: c2 } = render(Harness, { props: { enabled: true, bodyText: 'two' } });
    await tick();
    expect(getContent(c1)).toBeNull();
    expect(getContent(c2)).toBeNull();
    const portaled = document.querySelectorAll<HTMLElement>('[data-testid="portal-content"]');
    const texts = Array.from(portaled).map(el => el.textContent);
    expect(texts).toContain('one');
    expect(texts).toContain('two');
  });

  it('unmounting only one of multiple portals leaves the others intact', async () => {
    const { unmount: unmountA } = render(Harness, { props: { enabled: true, bodyText: 'A' } });
    render(Harness, { props: { enabled: true, bodyText: 'B' } });
    await tick();
    unmountA();
    await tick();
    const remaining = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="portal-content"]'))
      .map(el => el.textContent);
    expect(remaining).toEqual(['B']);
  });
});

describe('neoPortal — enabled flips at runtime', { tags: ['jsdom'] }, () => {
  it('switching enabled false → true → false moves the node out and back', async () => {
    const { container, rerender } = render(Harness, { props: { enabled: false, bodyText: 'flip' } });
    await tick();
    expect(getHost(container)?.contains(getContent(container))).toBe(true);

    await rerender({ enabled: true, bodyText: 'flip' });
    await tick();
    expect(getContent(container)).toBeNull();
    const portaled = getContent();
    expect(portaled).not.toBeNull();
    expect(document.body.contains(portaled)).toBe(true);

    await rerender({ enabled: false, bodyText: 'flip' });
    await tick();
    expect(getContent(container)).not.toBeNull();
  });
});
