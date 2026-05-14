import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconArrow from './NeoIconArrow.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconArrow — defaults', () => {
  it('renders an svg with both line + chevron paths and direction="right"', async () => {
    const { container } = render(NeoIconArrow, { props: {} as never });
    await tick();
    const svg = container.querySelector('svg')!;
    expect(svg).not.toBeNull();
    const line = container.querySelector<SVGPathElement>('.neo-icon-arrow-line')!;
    const chevron = container.querySelector<SVGPathElement>('.neo-icon-arrow-chevron')!;
    expect(line.getAttribute('data-direction')).toBe('right');
    expect(chevron.getAttribute('data-direction')).toBe('right');
    expect(line.getAttribute('d')).toBe('M3 12h17.5');
    expect(chevron.getAttribute('d')).toBe('M21 12l-7 7M21 12l-7 -7');
  });

  it('size, scale, stroke pass through to the svg', async () => {
    const { container } = render(NeoIconArrow, {
      props: { size: '32px', scale: 2, stroke: 4 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.getAttribute('height')).toBe('32px');
    expect(svg.style.scale).toBe('2');
    const g = container.querySelector<SVGGElement>('svg > g')!;
    expect(g.getAttribute('stroke-width')).toBe('4');
  });
});

describe('neoIconArrow — direction matrix', () => {
  const matrix: Record<string, { line: string; chevron: string }> = {
    right: { line: 'M3 12h17.5', chevron: 'M21 12l-7 7M21 12l-7 -7' },
    left: { line: 'M21 12h-17.5', chevron: 'M3 12l7 7M3 12l7 -7' },
    up: { line: 'M12 21l0 -17.5', chevron: 'M12 3l7 7M12 3l-7 7' },
    down: { line: 'M12 3l0 17.5', chevron: 'M12 21l7 -7M12 21l-7 -7' },
  };
  for (const [direction, { line, chevron }] of Object.entries(matrix)) {
    it(`direction="${direction}" renders the expected line + chevron paths`, async () => {
      const { container } = render(NeoIconArrow, { props: { direction } as never });
      await tick();
      expect(container.querySelector<SVGPathElement>('.neo-icon-arrow-line')!.getAttribute('d')).toBe(line);
      expect(container.querySelector<SVGPathElement>('.neo-icon-arrow-chevron')!.getAttribute('d')).toBe(chevron);
      expect(container.querySelector('.neo-icon-arrow-line')!.getAttribute('data-direction')).toBe(direction);
    });
  }
});

describe('neoIconArrow — modifiers', () => {
  it('expanded=true adds .neo-expanded on both line and chevron', async () => {
    const { container } = render(NeoIconArrow, { props: { expanded: true } as never });
    await tick();
    expect(container.querySelector('.neo-icon-arrow-line.neo-expanded')).not.toBeNull();
    expect(container.querySelector('.neo-icon-arrow-chevron.neo-expanded')).not.toBeNull();
  });

  it('expanded=false does not add .neo-expanded', async () => {
    const { container } = render(NeoIconArrow, { props: { expanded: false } as never });
    await tick();
    expect(container.querySelector('.neo-icon-arrow-line.neo-expanded')).toBeNull();
    expect(container.querySelector('.neo-icon-arrow-chevron.neo-expanded')).toBeNull();
  });

  it('chevron=true adds .neo-chevron on both line and chevron', async () => {
    const { container } = render(NeoIconArrow, { props: { chevron: true } as never });
    await tick();
    expect(container.querySelector('.neo-icon-arrow-line.neo-chevron')).not.toBeNull();
    expect(container.querySelector('.neo-icon-arrow-chevron.neo-chevron')).not.toBeNull();
  });

  it('enter=true (default) adds .neo-enter on chevron and renders <animate>', async () => {
    const { container } = render(NeoIconArrow, { props: {} as never });
    await tick();
    const chevron = container.querySelector('.neo-icon-arrow-chevron')!;
    expect(chevron.classList.contains('neo-enter')).toBe(true);
    expect(chevron.querySelector('animate')).not.toBeNull();
    expect(chevron.getAttribute('stroke-dashoffset')).toBe('12');
  });

  it('enter=false omits .neo-enter and the <animate> element', async () => {
    const { container } = render(NeoIconArrow, { props: { enter: false } as never });
    await tick();
    const chevron = container.querySelector('.neo-icon-arrow-chevron')!;
    expect(chevron.classList.contains('neo-enter')).toBe(false);
    expect(chevron.querySelector('animate')).toBeNull();
    expect(chevron.getAttribute('stroke-dashoffset')).toBe('0');
  });
});

describe('neoIconArrow — css custom properties', () => {
  it('start, end, delay forward as CSS custom properties', async () => {
    const { container } = render(NeoIconArrow, {
      props: { start: '10%', end: '20%', delay: 0.4 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.style.getPropertyValue('--neo-arrow-offset-start')).toBe('10%');
    expect(svg.style.getPropertyValue('--neo-arrow-offset-end')).toBe('20%');
    expect(svg.style.getPropertyValue('--neo-arrow-delay')).toBe('0.4');
  });
});
