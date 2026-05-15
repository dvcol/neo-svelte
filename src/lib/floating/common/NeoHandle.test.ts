import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoHandle.test.svelte';

afterEach(() => {
  cleanup();
});

function getGroup(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-handle-group');
}

function getHandles(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('button.neo-handle'));
}

function getHandle(placement: string, scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>(`button.neo-handle[data-placement="${placement}"]`);
}

describe('neoHandle — enabled toggle', { tags: ['jsdom'] }, () => {
  it('renders the handle group + a single top handle by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getGroup(container)).not.toBeNull();
    const handles = getHandles(container);
    expect(handles).toHaveLength(1);
    expect(handles[0].dataset.placement).toBe('top');
    expect(container.querySelector('[data-testid="handle-body"]')).not.toBeNull();
  });

  it('does not render the group or any handle when enabled=false (children still rendered)', async () => {
    const { container } = render(Harness, { props: { enabled: false } as never });
    await tick();
    expect(getGroup(container)).toBeNull();
    expect(getHandles(container)).toHaveLength(0);
    expect(container.querySelector('[data-testid="handle-body"]')).not.toBeNull();
  });
});

describe('neoHandle — placement prop', { tags: ['jsdom'] }, () => {
  it('placement="bottom" renders a single bottom handle', async () => {
    const { container } = render(Harness, { props: { placement: 'bottom' } as never });
    await tick();
    expect(getHandles(container).map(h => h.dataset.placement)).toEqual(['bottom']);
  });

  it('placement={top:true,right:true} renders both handles', async () => {
    const { container } = render(Harness, { props: { placement: { top: true, right: true } } as never });
    await tick();
    const placements = getHandles(container).map(h => h.dataset.placement);
    expect(placements).toContain('top');
    expect(placements).toContain('right');
    expect(placements).toHaveLength(2);
  });

  it('placement entries with falsy value are filtered out', async () => {
    const { container } = render(Harness, {
      props: { placement: { top: true, right: false, bottom: true, left: false } } as never,
    });
    await tick();
    const placements = getHandles(container).map(h => h.dataset.placement);
    expect(placements.sort()).toEqual(['bottom', 'top']);
  });

  it('all four placements true renders four handles', async () => {
    const { container } = render(Harness, {
      props: { placement: { top: true, right: true, bottom: true, left: true } } as never,
    });
    await tick();
    expect(getHandles(container)).toHaveLength(4);
  });
});

describe('neoHandle — outside adds the opposite handle', { tags: ['jsdom'] }, () => {
  it('outside="left" adds the right handle when default placement="top"', async () => {
    const { container } = render(Harness, { props: { outside: 'left' } as never });
    await tick();
    const placements = getHandles(container).map(h => h.dataset.placement).sort();
    expect(placements).toEqual(['right', 'top']);
  });

  it('outside="top" adds the bottom handle when placement="left"', async () => {
    const { container } = render(Harness, { props: { placement: 'left', outside: 'top' } as never });
    await tick();
    const placements = getHandles(container).map(h => h.dataset.placement).sort();
    expect(placements).toEqual(['bottom', 'left']);
  });

  it('outside="bottom" overlapping placement="top" renders just the top handle (set semantics)', async () => {
    const { container } = render(Harness, { props: { placement: 'top', outside: 'bottom' } as never });
    await tick();
    const placements = getHandles(container).map(h => h.dataset.placement);
    expect(placements).toEqual(['top']);
  });
});

describe('neoHandle — position prop', { tags: ['jsdom'] }, () => {
  it('position defaults to "inside" and is reflected on group + handles', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getGroup(container)?.dataset.position).toBe('inside');
    expect(getHandles(container)[0].dataset.position).toBe('inside');
  });

  it('position="outside" is reflected on group + handles', async () => {
    const { container } = render(Harness, { props: { position: 'outside' } as never });
    await tick();
    expect(getGroup(container)?.dataset.position).toBe('outside');
    expect(getHandles(container)[0].dataset.position).toBe('outside');
  });
});

describe('neoHandle — axis prop', { tags: ['jsdom'] }, () => {
  it('axis is omitted by default', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getHandles(container)[0].dataset.axis).toBeUndefined();
  });

  it('axis="x" propagates to the handle data attribute', async () => {
    const { container } = render(Harness, { props: { axis: 'x' } as never });
    await tick();
    expect(getHandles(container)[0].dataset.axis).toBe('x');
  });

  it('axis="y" propagates to the handle data attribute', async () => {
    const { container } = render(Harness, { props: { axis: 'y' } as never });
    await tick();
    expect(getHandles(container)[0].dataset.axis).toBe('y');
  });
});

describe('neoHandle — visible prop', { tags: ['jsdom'] }, () => {
  it('visible=true (default) renders the inner divider in the handle', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getHandle('top', container)?.querySelector('.neo-divider')).not.toBeNull();
  });

  it('visible=false omits the inner divider', async () => {
    const { container } = render(Harness, { props: { visible: false } as never });
    await tick();
    expect(getHandle('top', container)?.querySelector('.neo-divider')).toBeNull();
  });
});

describe('neoHandle — accessibility', { tags: ['jsdom'] }, () => {
  it('handles expose an aria-label and title for assistive tech', async () => {
    const { container } = render(Harness, { props: { placement: 'right' } as never });
    await tick();
    const handle = getHandle('right', container);
    expect(handle?.getAttribute('aria-label')).toBe('Drag handle (right)');
    expect(handle?.getAttribute('title')).toBe('Draggable');
  });
});
