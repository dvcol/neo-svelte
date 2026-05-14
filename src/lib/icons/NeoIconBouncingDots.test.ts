import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconBouncingDots from './NeoIconBouncingDots.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconBouncingDots — defaults', () => {
  it('renders three circles', async () => {
    const { container } = render(NeoIconBouncingDots, { props: {} as never });
    await tick();
    expect(container.querySelectorAll('svg > circle').length).toBe(3);
  });

  it('default bounce=true + enter=true: each circle has opacity=0 and 4 animate elements', async () => {
    const { container } = render(NeoIconBouncingDots, { props: {} as never });
    await tick();
    const circles = container.querySelectorAll<SVGCircleElement>('svg > circle');
    for (const c of circles) {
      expect(c.getAttribute('opacity')).toBe('0');
      // 1 enter animate + 4 bounce animates (cy, ry, rx, fill-opacity)
      expect(c.querySelectorAll('animate').length).toBe(5);
    }
  });

  it('fill prop applies to each circle', async () => {
    const { container } = render(NeoIconBouncingDots, {
      props: { fill: 'red' } as never,
    });
    await tick();
    const circles = container.querySelectorAll<SVGCircleElement>('svg > circle');
    for (const c of circles) {
      expect(c.getAttribute('fill')).toBe('red');
    }
  });
});

describe('neoIconBouncingDots — bounce / enter combinations', () => {
  it('enter=false: circle opacity=1 and no enter <animate>', async () => {
    const { container } = render(NeoIconBouncingDots, { props: { enter: false } as never });
    await tick();
    const circles = container.querySelectorAll<SVGCircleElement>('svg > circle');
    for (const c of circles) {
      expect(c.getAttribute('opacity')).toBe('1');
      // bounce only — 4 animates per circle
      expect(c.querySelectorAll('animate').length).toBe(4);
    }
  });

  it('bounce=false + enter=true: only the opacity-enter <animate> per circle', async () => {
    const { container } = render(NeoIconBouncingDots, { props: { bounce: false } as never });
    await tick();
    const circles = container.querySelectorAll<SVGCircleElement>('svg > circle');
    for (const c of circles) {
      expect(c.querySelectorAll('animate').length).toBe(1);
      expect(c.querySelector('animate')!.getAttribute('attributeName')).toBe('opacity');
    }
  });

  it('bounce=false + enter=false: no <animate> children at all', async () => {
    const { container } = render(NeoIconBouncingDots, {
      props: { bounce: false, enter: false } as never,
    });
    await tick();
    expect(container.querySelectorAll('svg > circle animate').length).toBe(0);
  });

  it('steps prop drives the fill-opacity animation values', async () => {
    const { container } = render(NeoIconBouncingDots, {
      props: { steps: [0.2, 0.5, 0.9] } as never,
    });
    await tick();
    const fillAnim = container.querySelector<SVGAnimateElement>('animate[attributeName="fill-opacity"]')!;
    expect(fillAnim.getAttribute('values')).toBe('0.2;0.5;0.9');
  });
});

describe('neoIconBouncingDots — pass-through', () => {
  it('size, scale, stroke forward to svg', async () => {
    const { container } = render(NeoIconBouncingDots, {
      props: { size: '2rem', scale: 2, stroke: 3 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('2rem');
    expect(svg.style.scale).toBe('2');
    expect(svg.getAttribute('stroke-width')).toBe('3');
  });
});
