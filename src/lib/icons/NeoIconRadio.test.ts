import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconRadio from './NeoIconRadio.svelte';

afterEach(() => {
  cleanup();
});

const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
const squarePath = 'm 3 12 v -4 c 0 -3 1 -5 4 -5 H 16 c 3 0 5 2 5 5 V 16 C 21 19 19 21 16 21 h -8 C 5 21 3 19 3 16 Z';

describe('neoIconRadio — shape selection', { tags: ['jsdom'] }, () => {
  it('default circle=false uses the rounded-square path', async () => {
    const { container } = render(NeoIconRadio, { props: {} as never });
    await tick();
    expect(container.querySelector(`path[d="${squarePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${circlePath}"]`)).toBeNull();
  });

  it('circle=true uses the circle path', async () => {
    const { container } = render(NeoIconRadio, { props: { circle: true } as never });
    await tick();
    expect(container.querySelector(`path[d="${circlePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${squarePath}"]`)).toBeNull();
  });
});

describe('neoIconRadio — checked + enter combinations', { tags: ['jsdom'] }, () => {
  it('checked=true + enter=false renders fill-opacity=1 (no animation)', async () => {
    const { container } = render(NeoIconRadio, {
      props: { checked: true, enter: false } as never,
    });
    await tick();
    const path = container.querySelector<SVGPathElement>('path[fill="currentColor"]')!;
    expect(path.getAttribute('fill-opacity')).toBe('1');
    expect(path.querySelector('animate')).toBeNull();
  });

  it('checked=false + enter=false renders fill-opacity=0', async () => {
    const { container } = render(NeoIconRadio, {
      props: { checked: false, enter: false } as never,
    });
    await tick();
    const path = container.querySelector<SVGPathElement>('path[fill="currentColor"]')!;
    expect(path.getAttribute('fill-opacity')).toBe('0');
    expect(path.querySelector('animate')).toBeNull();
  });

  it('checked=true + enter=true plays the fill-in animation values "0;1"', async () => {
    const { container } = render(NeoIconRadio, {
      props: { checked: true, enter: true } as never,
    });
    await tick();
    const animate = container.querySelector<SVGAnimateElement>('path animate')!;
    expect(animate.getAttribute('values')).toBe('0;1');
  });

  it('checked=false + enter=true plays the fill-out animation values "1;0"', async () => {
    const { container } = render(NeoIconRadio, {
      props: { checked: false, enter: true } as never,
    });
    await tick();
    const animate = container.querySelector<SVGAnimateElement>('path animate')!;
    expect(animate.getAttribute('values')).toBe('1;0');
  });
});
