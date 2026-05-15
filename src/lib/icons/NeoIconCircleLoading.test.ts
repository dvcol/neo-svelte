import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconCircleLoading from './NeoIconCircleLoading.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconCircleLoading — animations', { tags: ['jsdom'] }, () => {
  it('renders two paths inside <g>: spinner (transform-rotate) + base ring', async () => {
    const { container } = render(NeoIconCircleLoading, { props: {} as never });
    await tick();
    const paths = container.querySelectorAll('svg > g > path');
    expect(paths.length).toBe(2);
    expect(paths[0].querySelector('animateTransform[type="rotate"]')).not.toBeNull();
    expect(paths[1].querySelector('animate[attributeName="stroke-dashoffset"]')).not.toBeNull();
  });

  it('default speed=1.2: spinner enter dur=0.3s, rotate dur=1.5s, base ring dur=1.2s', async () => {
    const { container } = render(NeoIconCircleLoading, { props: {} as never });
    await tick();
    const [spinner, ring] = Array.from(container.querySelectorAll('svg > g > path'));
    expect(spinner.querySelector<SVGAnimateElement>('animate')!.getAttribute('dur')).toBe('0.3s');
    expect(spinner.querySelector<SVGAnimateTransformElement>('animateTransform')!.getAttribute('dur')).toBe('1.5s');
    expect(ring.querySelector<SVGAnimateElement>('animate')!.getAttribute('dur')).toBe('1.2s');
  });

  it('speed prop scales the durations linearly', async () => {
    const { container } = render(NeoIconCircleLoading, { props: { speed: 4 } as never });
    await tick();
    const [spinner, ring] = Array.from(container.querySelectorAll('svg > g > path'));
    expect(spinner.querySelector<SVGAnimateElement>('animate')!.getAttribute('dur')).toBe('1s');
    expect(spinner.querySelector<SVGAnimateTransformElement>('animateTransform')!.getAttribute('dur')).toBe('5s');
    expect(ring.querySelector<SVGAnimateElement>('animate')!.getAttribute('dur')).toBe('4s');
  });

  it('animate=true: base ring fills in with values "64;0"', async () => {
    const { container } = render(NeoIconCircleLoading, { props: { animate: true } as never });
    await tick();
    const ring = container.querySelectorAll('svg > g > path')[1];
    expect(ring.querySelector('animate')!.getAttribute('values')).toBe('64;0');
  });

  it('animate=false: base ring sets values "0;64" with dur=0', async () => {
    const { container } = render(NeoIconCircleLoading, { props: { animate: false } as never });
    await tick();
    const ring = container.querySelectorAll('svg > g > path')[1];
    const anim = ring.querySelector('animate')!;
    expect(anim.getAttribute('values')).toBe('0;64');
    expect(anim.getAttribute('dur')).toBe('0');
  });
});

describe('neoIconCircleLoading — pass-through', { tags: ['jsdom'] }, () => {
  it('size and stroke forward', async () => {
    const { container } = render(NeoIconCircleLoading, {
      props: { size: '32px', stroke: 4 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.querySelector('g')!.getAttribute('stroke-width')).toBe('4');
  });
});
