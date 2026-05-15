import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoCursorPointer from './NeoCursorPointer.svelte';

afterEach(() => {
  cleanup();
});

describe('neoCursorPointer — render gating', { tags: ['jsdom'] }, () => {
  it('renders nothing when show=false', async () => {
    const { container } = render(NeoCursorPointer, { props: { show: false } as never });
    await tick();
    expect(container.querySelector('.neo-cursor')).toBeNull();
  });

  it('renders the .neo-cursor span when show=true', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, position: { x: 10, y: 20 } } as never,
    });
    await tick();
    expect(container.querySelector('.neo-cursor')).not.toBeNull();
  });
});

describe('neoCursorPointer — data attributes & CSS vars', { tags: ['jsdom'] }, () => {
  it('reflects cursor type on data-cursor', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, cursor: 'text', position: { x: 0, y: 0 } } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-cursor')?.dataset.cursor).toBe('text');
  });

  it('reflects transition state on data-transition', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, transition: 'in', position: { x: 0, y: 0 } } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-cursor')?.dataset.transition).toBe('in');
  });

  it('reflects snapping flag on data-snapping', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, snapping: true, position: { x: 0, y: 0 } } as never,
    });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-cursor')?.dataset.snapping).toBe('true');
  });

  it('forwards x/y position as CSS variables in pixels', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, position: { x: 12, y: 34 } } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-cursor')!;
    expect(host.style.cssText).toContain('--neo-cursor-x: 12px');
    expect(host.style.cssText).toContain('--neo-cursor-y: 34px');
  });

  it('snapping=true with width/height in position forwards width/height vars', async () => {
    const { container } = render(NeoCursorPointer, {
      props: { show: true, snapping: true, position: { x: 0, y: 0, width: 50, height: 60 } } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-cursor')!;
    expect(host.style.cssText).toContain('--neo-cursor-width: 50px');
    expect(host.style.cssText).toContain('--neo-cursor-height: 60px');
  });
});

describe('neoCursorPointer — pressure & tilt classes', { tags: ['jsdom'] }, () => {
  it('pressure flag + touching + contact.pressure.point > 0 → .neo-pressure', async () => {
    const { container } = render(NeoCursorPointer, {
      props: {
        show: true,
        pressure: true,
        touching: true,
        position: { x: 0, y: 0 },
        contact: { size: { width: 0, height: 0 }, pressure: { point: 0.5, tangential: 0 }, tilt: { x: 0, y: 0 }, twist: 0, angle: { azimuth: 0, altitude: Math.PI / 2 } },
      } as never,
    });
    await tick();
    expect(container.querySelector('.neo-cursor.neo-pressure')).not.toBeNull();
  });

  it('pressure=true but touching=false → no .neo-pressure', async () => {
    const { container } = render(NeoCursorPointer, {
      props: {
        show: true,
        pressure: true,
        touching: false,
        position: { x: 0, y: 0 },
        contact: { size: { width: 0, height: 0 }, pressure: { point: 0.5, tangential: 0 }, tilt: { x: 0, y: 0 }, twist: 0, angle: { azimuth: 0, altitude: Math.PI / 2 } },
      } as never,
    });
    await tick();
    expect(container.querySelector('.neo-cursor')?.classList.contains('neo-pressure')).toBe(false);
  });
});
