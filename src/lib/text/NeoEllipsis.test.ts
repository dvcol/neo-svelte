import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoEllipsis from './NeoEllipsis.svelte';

afterEach(() => {
  cleanup();
});

describe('neoEllipsis', () => {
  it('renders a span.neo-ellipsis with the provided value', async () => {
    const { container } = render(NeoEllipsis, { props: { value: 'hello world' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-ellipsis');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('SPAN');
    expect(host?.textContent?.trim()).toBe('hello world');
  });

  it('lines forwards as the --neo-ellipsis-lines CSS variable', async () => {
    const { container } = render(NeoEllipsis, { props: { value: 'x', lines: 3 } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-ellipsis')!;
    expect(host.style.cssText).toContain('--neo-ellipsis-lines: 3');
  });

  it('forwards arbitrary attrs (id, data-*) to the host', async () => {
    const { container } = render(NeoEllipsis, {
      props: { 'value': 'x', 'id': 'el-id', 'data-testid': 'el' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('#el-id');
    expect(host).not.toBeNull();
    expect(host?.getAttribute('data-testid')).toBe('el');
  });
});
