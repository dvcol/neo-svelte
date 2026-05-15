import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconAddress from './NeoIconAddress.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconAddress — defaults', { tags: ['jsdom'] }, () => {
  it('renders the pin path, dot circle, and base path', async () => {
    const { container } = render(NeoIconAddress, { props: {} as never });
    await tick();
    expect(container.querySelector('svg > g > path')).not.toBeNull();
    expect(container.querySelector('svg > g > circle')).not.toBeNull();
  });

  it('dot prop drives circle fill when filled=true', async () => {
    const { container } = render(NeoIconAddress, {
      props: { filled: true, enter: false, dot: 'red' } as never,
    });
    await tick();
    expect(container.querySelector('circle')!.getAttribute('fill')).toBe('red');
  });

  it('default dot="white" applies when filled=true', async () => {
    const { container } = render(NeoIconAddress, {
      props: { filled: true, enter: false } as never,
    });
    await tick();
    expect(container.querySelector('circle')!.getAttribute('fill')).toBe('white');
  });

  it('filled=false uses currentColor for the dot circle', async () => {
    const { container } = render(NeoIconAddress, {
      props: { filled: false } as never,
    });
    await tick();
    expect(container.querySelector('circle')!.getAttribute('fill')).toBe('currentColor');
  });
});

describe('neoIconAddress — enter / filled combinations', { tags: ['jsdom'] }, () => {
  it('enter=true: pin stroke-dashoffset starts at 40 with stroke-dashoffset animate', async () => {
    const { container } = render(NeoIconAddress, { props: {} as never });
    await tick();
    const pin = container.querySelector<SVGPathElement>('svg > g > path[fill="currentColor"]')!;
    expect(pin.getAttribute('stroke-dashoffset')).toBe('40');
    expect(pin.querySelector('animate[attributeName="stroke-dashoffset"]')).not.toBeNull();
  });

  it('enter=false: pin stroke-dashoffset starts at 0 (no draw-in)', async () => {
    const { container } = render(NeoIconAddress, { props: { enter: false } as never });
    await tick();
    const pin = container.querySelector<SVGPathElement>('svg > g > path[fill="currentColor"]')!;
    expect(pin.getAttribute('stroke-dashoffset')).toBe('0');
    expect(pin.querySelector('animate[attributeName="stroke-dashoffset"]')).toBeNull();
  });

  it('filled=true + enter=false: pin runs fill-opacity animate "0;1"', async () => {
    const { container } = render(NeoIconAddress, {
      props: { filled: true, enter: false } as never,
    });
    await tick();
    const fillAnim = container.querySelector<SVGAnimateElement>('svg > g > path[fill="currentColor"] animate[attributeName="fill-opacity"]')!;
    expect(fillAnim.getAttribute('values')).toBe('0;1');
  });

  it('filled=false + enter=false: pin runs fill-opacity animate "1;0"', async () => {
    const { container } = render(NeoIconAddress, {
      props: { filled: false, enter: false } as never,
    });
    await tick();
    const fillAnim = container.querySelector<SVGAnimateElement>('svg > g > path[fill="currentColor"] animate[attributeName="fill-opacity"]')!;
    expect(fillAnim.getAttribute('values')).toBe('1;0');
  });
});

describe('neoIconAddress — repeat prop', { tags: ['jsdom'] }, () => {
  it('repeat="indefinite" (default) sets repeatCount on the rotation animateTransform', async () => {
    const { container } = render(NeoIconAddress, { props: {} as never });
    await tick();
    const rotate = container.querySelector<SVGAnimateTransformElement>('animateTransform[type="rotate"]')!;
    expect(rotate.getAttribute('repeatCount')).toBe('indefinite');
  });

  it('repeat=3 sets repeatCount to "3"', async () => {
    const { container } = render(NeoIconAddress, { props: { repeat: 3 } as never });
    await tick();
    const rotate = container.querySelector<SVGAnimateTransformElement>('animateTransform[type="rotate"]')!;
    expect(rotate.getAttribute('repeatCount')).toBe('3');
  });
});
