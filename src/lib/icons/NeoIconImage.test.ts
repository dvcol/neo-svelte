import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconImage from './NeoIconImage.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconImage — defaults', () => {
  it('renders the frame + line and the fill group', async () => {
    const { container } = render(NeoIconImage, { props: {} as never });
    await tick();
    expect(container.querySelectorAll('svg > g').length).toBe(2);
    // first group (frame) has 2 paths
    expect(container.querySelectorAll('svg > g')[0].querySelectorAll('path').length).toBe(2);
    // second group (fill) has a circle and a path
    const fillGroup = container.querySelectorAll('svg > g')[1];
    expect(fillGroup.querySelector('circle')).not.toBeNull();
    expect(fillGroup.querySelector('path')).not.toBeNull();
  });

  it('default enter=true: frame stroke-dashoffset starts hidden, has stroke-dashoffset animate', async () => {
    const { container } = render(NeoIconImage, { props: {} as never });
    await tick();
    const frame = container.querySelector<SVGPathElement>('svg > g:first-of-type path:first-of-type')!;
    expect(frame.getAttribute('stroke-dashoffset')).toBe('72');
    expect(frame.querySelector('animate')).not.toBeNull();
    const fill = container.querySelectorAll('svg > g')[1] as SVGGElement;
    expect(fill.getAttribute('fill-opacity')).toBe('0');
  });

  it('enter=false: stroke-dashoffset=0 and fill-opacity=1 (rest state)', async () => {
    const { container } = render(NeoIconImage, { props: { enter: false } as never });
    await tick();
    const frame = container.querySelector<SVGPathElement>('svg > g:first-of-type path:first-of-type')!;
    expect(frame.getAttribute('stroke-dashoffset')).toBe('0');
    expect(frame.querySelector('animate')).toBeNull();
    const fill = container.querySelectorAll('svg > g')[1] as SVGGElement;
    expect(fill.getAttribute('fill-opacity')).toBe('1');
  });
});

describe('neoIconImage — delay', () => {
  it('delay forwards into begin attributes (delay=0 ⇒ "0s", "0.6s", "1s", "1.3s")', async () => {
    const { container } = render(NeoIconImage, { props: {} as never });
    await tick();
    const animates = container.querySelectorAll<SVGAnimateElement>('animate');
    expect(animates[0].getAttribute('begin')).toBe('0s');
    expect(animates[1].getAttribute('begin')).toBe('0.6s');
    expect(animates[2].getAttribute('begin')).toBe('1s');
    expect(animates[3].getAttribute('begin')).toBe('1.3s');
  });

  it('delay=0.5 shifts every animate begin by +0.5s', async () => {
    const { container } = render(NeoIconImage, { props: { delay: 0.5 } as never });
    await tick();
    const animates = container.querySelectorAll<SVGAnimateElement>('animate');
    expect(animates[0].getAttribute('begin')).toBe('0.5s');
    expect(animates[1].getAttribute('begin')).toBe('1.1s');
    expect(animates[2].getAttribute('begin')).toBe('1.5s');
    expect(animates[3].getAttribute('begin')).toBe('1.8s');
  });
});
