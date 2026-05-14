import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconCheckbox from './NeoIconCheckbox.svelte';

afterEach(() => {
  cleanup();
});

const circlePath = 'M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z';
const squarePath = 'M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z';
const checkPath = 'M8 12l3 3l5 -5';
const indeterminatePath = 'M7 12h10';

describe('neoIconCheckbox — defaults', () => {
  it('renders an svg with the check path and no border path', async () => {
    const { container } = render(NeoIconCheckbox, { props: {} as never });
    await tick();
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector(`path[d="${checkPath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${squarePath}"]`)).toBeNull();
    expect(container.querySelector(`path[d="${indeterminatePath}"]`)).toBeNull();
  });

  it('size, scale forward to the svg', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { size: '24px', scale: 2 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('24px');
    expect(svg.style.scale).toBe('2');
  });
});

describe('neoIconCheckbox — border + circle/square', () => {
  it('border=true adds the square border path by default', async () => {
    const { container } = render(NeoIconCheckbox, { props: { border: true } as never });
    await tick();
    expect(container.querySelector(`path[d="${squarePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${circlePath}"]`)).toBeNull();
  });

  it('border=true + circle=true uses the circle border path', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { border: true, circle: true } as never,
    });
    await tick();
    expect(container.querySelector(`path[d="${circlePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${squarePath}"]`)).toBeNull();
  });

  it('border=false renders no border path even with circle=true', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { border: false, circle: true } as never,
    });
    await tick();
    expect(container.querySelector(`path[d="${circlePath}"]`)).toBeNull();
    expect(container.querySelector(`path[d="${squarePath}"]`)).toBeNull();
  });
});

describe('neoIconCheckbox — checked / indeterminate', () => {
  it('indeterminate=true renders the dash path instead of the check path', async () => {
    const { container } = render(NeoIconCheckbox, { props: { indeterminate: true } as never });
    await tick();
    expect(container.querySelector(`path[d="${indeterminatePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${checkPath}"]`)).toBeNull();
  });

  it('checked=true (without enter) renders the check path with stroke-dasharray=0 (already drawn)', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { checked: true, enter: false } as never,
    });
    await tick();
    const check = container.querySelector<SVGPathElement>(`path[d="${checkPath}"]`)!;
    expect(check.getAttribute('stroke-dasharray')).toBe('0');
  });

  it('checked=false renders the check path with stroke-dasharray=14 (hidden)', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { checked: false } as never,
    });
    await tick();
    const check = container.querySelector<SVGPathElement>(`path[d="${checkPath}"]`)!;
    expect(check.getAttribute('stroke-dasharray')).toBe('14');
  });

  it('indeterminate=true takes precedence over checked', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { checked: true, indeterminate: true } as never,
    });
    await tick();
    expect(container.querySelector(`path[d="${indeterminatePath}"]`)).not.toBeNull();
    expect(container.querySelector(`path[d="${checkPath}"]`)).toBeNull();
  });
});

describe('neoIconCheckbox — draw + enter combinations', () => {
  it('border=true + checked=true + draw=true: border stroke-dashoffset=64 (will animate)', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { border: true, checked: true, draw: true } as never,
    });
    await tick();
    const border = container.querySelector<SVGPathElement>(`path[d="${squarePath}"]`)!;
    expect(border.getAttribute('stroke-dashoffset')).toBe('64');
    expect(border.querySelector('animate')).not.toBeNull();
  });

  it('border=true + checked=false + draw=true: border stroke-dashoffset=0 (visible at rest)', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { border: true, checked: false, draw: true } as never,
    });
    await tick();
    const border = container.querySelector<SVGPathElement>(`path[d="${squarePath}"]`)!;
    expect(border.getAttribute('stroke-dashoffset')).toBe('0');
  });

  it('border=true + draw=false: no animate child on border', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { border: true, draw: false } as never,
    });
    await tick();
    const border = container.querySelector<SVGPathElement>(`path[d="${squarePath}"]`)!;
    expect(border.querySelector('animate')).toBeNull();
  });

  it('enter=false + checked=false + indeterminate=false: indeterminate animate has dur=0', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { indeterminate: true, enter: false } as never,
    });
    await tick();
    const ind = container.querySelector<SVGPathElement>(`path[d="${indeterminatePath}"]`)!;
    const animate = ind.querySelector('animate')!;
    expect(animate.getAttribute('dur')).toBe('0');
    expect(animate.getAttribute('values')).toBe('0;12');
  });

  it('enter=true + indeterminate=true: animate plays values 12;0 with dur=0.2s', async () => {
    const { container } = render(NeoIconCheckbox, {
      props: { indeterminate: true, enter: true } as never,
    });
    await tick();
    const animate = container.querySelector<SVGAnimateElement>(`path[d="${indeterminatePath}"] animate`)!;
    expect(animate.getAttribute('values')).toBe('12;0');
    expect(animate.getAttribute('dur')).toBe('0.2s');
  });
});
