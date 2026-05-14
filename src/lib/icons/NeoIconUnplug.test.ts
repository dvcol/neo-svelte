import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconUnplug from './NeoIconUnplug.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconUnplug — plug toggle', () => {
  it('default plug=false: line-1 dashoffset=8 (hidden), line-2 dashoffset=8 (extending)', async () => {
    const { container } = render(NeoIconUnplug, { props: {} as never });
    await tick();
    const line1 = container.querySelector<SVGPathElement>('.line-1')!;
    const line2 = container.querySelector<SVGPathElement>('.line-2')!;
    expect(line1.getAttribute('stroke-dashoffset')).toBe('8');
    expect(line2.getAttribute('stroke-dashoffset')).toBe('8');
    // animate plays "0;8" for line-1 (retract) and "8;0" for line-2 (extend)
    expect(line1.querySelector('animate')!.getAttribute('values')).toBe('0;8');
    expect(line2.querySelector('animate')!.getAttribute('values')).toBe('8;0');
  });

  it('plug=true: line-1 dashoffset=0 (visible), line-2 dashoffset=16 (retracted)', async () => {
    const { container } = render(NeoIconUnplug, { props: { plug: true } as never });
    await tick();
    const line1 = container.querySelector<SVGPathElement>('.line-1')!;
    const line2 = container.querySelector<SVGPathElement>('.line-2')!;
    expect(line1.getAttribute('stroke-dashoffset')).toBe('0');
    expect(line2.getAttribute('stroke-dashoffset')).toBe('16');
    expect(line1.querySelector('animate')!.getAttribute('values')).toBe('8;0');
    expect(line2.querySelector('animate')!.getAttribute('values')).toBe('0;8');
  });

  it('plug=true translates the socket and plug paths inward', async () => {
    const { container } = render(NeoIconUnplug, { props: { plug: true } as never });
    await tick();
    const socket = container.querySelector<SVGPathElement>('.socket')!;
    const plug = container.querySelector<SVGPathElement>('.plug')!;
    expect(socket.getAttribute('transform')).toBe('translate(3px, -3px)');
    expect(plug.getAttribute('transform')).toBe('translate(-3px, 3px)');
  });

  it('plug=false leaves transforms at 0,0', async () => {
    const { container } = render(NeoIconUnplug, { props: { plug: false } as never });
    await tick();
    const socket = container.querySelector<SVGPathElement>('.socket')!;
    const plug = container.querySelector<SVGPathElement>('.plug')!;
    expect(socket.getAttribute('transform')).toBe('translate(0, 0)');
    expect(plug.getAttribute('transform')).toBe('translate(0, 0)');
  });
});

describe('neoIconUnplug — pass-through', () => {
  it('size, scale, stroke forward', async () => {
    const { container } = render(NeoIconUnplug, {
      props: { size: '32px', scale: 2, stroke: 4 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.style.scale).toBe('2');
    expect(container.querySelector('svg > g')!.getAttribute('stroke-width')).toBe('4');
  });
});
