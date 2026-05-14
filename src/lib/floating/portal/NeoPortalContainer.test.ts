import type { NeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoPortalContainerHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-portal-container');
}

async function captureContext(props: Record<string, unknown> = {}): Promise<NeoPortalContext> {
  let ctx: NeoPortalContext | undefined;
  render(Harness, {
    props: {
      ...props,
      onContext: (c: NeoPortalContext | undefined) => {
        ctx = c;
      },
    } as never,
  });
  await tick();
  await tick();
  if (!ctx) throw new Error('No portal context captured');
  return ctx;
}

describe('neoPortalContainer — render', () => {
  it('renders the body inside a div tagged .neo-portal-container by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    const root = getContainer(container);
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.querySelector('[data-testid="portal-container-body"]')).not.toBeNull();
  });

  it('honors a caller-supplied tag', async () => {
    const { container } = render(Harness, { props: { tag: 'section' } as never });
    await tick();
    expect(getContainer(container)?.tagName).toBe('SECTION');
  });

  it('uses a caller-supplied id', async () => {
    const { container } = render(Harness, { props: { id: 'my-portal' } as never });
    await tick();
    expect(getContainer(container)?.id).toBe('my-portal');
  });

  it('reflects the .neo-scale class when scale=true (default)', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getContainer(container)?.classList.contains('neo-scale')).toBe(true);
  });

  it('drops the .neo-scale class when scale=false', async () => {
    const { container } = render(Harness, { props: { scale: false } as never });
    await tick();
    expect(getContainer(container)?.classList.contains('neo-scale')).toBe(false);
  });
});

describe('neoPortalContainer — context', () => {
  it('exposes a NeoPortalContext via getNeoPortalContext()', async () => {
    const ctx = await captureContext();
    expect(ctx).toBeDefined();
    expect(typeof ctx.id).toBe('string');
    expect(ctx.open).toBe(0);
  });

  it('uses the provided id on the context', async () => {
    const ctx = await captureContext({ id: 'ctx-id' });
    expect(ctx.id).toBe('ctx-id');
  });

  it('open derives from openDialog/closeDialog calls', async () => {
    const ctx = await captureContext();
    expect(ctx.open).toBe(0);
    ctx.openDialog('a', 'top');
    expect(ctx.open).toBe(1);
    ctx.openDialog('b', 'right');
    expect(ctx.open).toBe(2);
    ctx.closeDialog('a');
    expect(ctx.open).toBe(1);
    ctx.closeDialog('b');
    expect(ctx.open).toBe(0);
  });

  it('placement reflects the most recently opened dialog', async () => {
    const ctx = await captureContext();
    ctx.openDialog('a', 'top');
    expect(ctx.placement).toBe('top');
    ctx.openDialog('b', 'bottom-end');
    expect(ctx.placement).toBe('bottom-end');
  });

  it('closeDialog on an unknown id is a no-op', async () => {
    const ctx = await captureContext();
    expect(() => ctx.closeDialog('does-not-exist')).not.toThrow();
    expect(ctx.open).toBe(0);
  });

  it('container reflects open count via data-open / .neo-open', async () => {
    let ctx: NeoPortalContext | undefined;
    const { container } = render(Harness, {
      props: {
        onContext: (c: NeoPortalContext | undefined) => {
          ctx = c;
        },
      } as never,
    });
    await tick();
    await tick();
    expect(ctx).toBeDefined();
    const root = getContainer(container);
    expect(root?.getAttribute('data-open')).toBe('0');
    expect(root?.classList.contains('neo-open')).toBe(false);
    ctx!.openDialog('x', 'top');
    await tick();
    expect(root?.getAttribute('data-open')).toBe('1');
    expect(root?.classList.contains('neo-open')).toBe(true);
  });
});
