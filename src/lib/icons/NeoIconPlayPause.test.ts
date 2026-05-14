import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconPlayPause from './NeoIconPlayPause.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconPlayPause — branch render', () => {
  it('default state="play" + enter=true renders a play triangle path', async () => {
    const { container } = render(NeoIconPlayPause, { props: {} as never });
    await tick();
    const path = container.querySelector<SVGPathElement>('svg > path')!;
    expect(path.getAttribute('d')).toBe('M8 6l10 6l-10 6Z');
    expect(path.getAttribute('stroke-dasharray')).toBe('40');
    expect(path.querySelector('animate[attributeName="stroke-dashoffset"]')).not.toBeNull();
  });

  it('state="pause" + enter=true renders two bar paths inside a <g>', async () => {
    const { container } = render(NeoIconPlayPause, { props: { state: 'pause' } as never });
    await tick();
    const paths = container.querySelectorAll<SVGPathElement>('svg > g > path');
    expect(paths.length).toBe(2);
    expect(paths[0].getAttribute('d')).toBe('M7 6h2v12h-2Z');
    expect(paths[1].getAttribute('d')).toBe('M15 6h2v12h-2Z');
  });

  it('state="play" + enter=false renders the play-rest morph path', async () => {
    const { container } = render(NeoIconPlayPause, {
      props: { state: 'play', enter: false } as never,
    });
    await tick();
    const path = container.querySelector<SVGPathElement>('svg > path')!;
    expect(path.getAttribute('d')).toBe('M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6');
  });

  it('state="pause" + enter=false renders the pause-rest morph path', async () => {
    const { container } = render(NeoIconPlayPause, {
      props: { state: 'pause', enter: false } as never,
    });
    await tick();
    const path = container.querySelector<SVGPathElement>('svg > path')!;
    expect(path.getAttribute('d')).toBe('M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15');
  });
});

describe('neoIconPlayPause — pass-through', () => {
  it('size, scale, stroke forward to svg / paths', async () => {
    const { container } = render(NeoIconPlayPause, {
      props: { size: '32px', scale: 2, stroke: 4 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.style.scale).toBe('2');
    expect(container.querySelector('svg > path')!.getAttribute('stroke-width')).toBe('4');
  });
});
