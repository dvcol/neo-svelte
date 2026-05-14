import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconAudio from './NeoIconAudio.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconAudio — defaults', () => {
  it('renders 6 path bars, each with an animate child', async () => {
    const { container } = render(NeoIconAudio, { props: {} as never });
    await tick();
    const paths = container.querySelectorAll<SVGPathElement>('svg > g > path');
    expect(paths.length).toBe(6);
    for (const p of paths) expect(p.querySelector('animate')).not.toBeNull();
  });

  it('default speed=0.5 + animated=true: first bar dur=4s, animate begin=0s', async () => {
    const { container } = render(NeoIconAudio, { props: {} as never });
    await tick();
    const first = container.querySelector<SVGAnimateElement>('svg > g > path animate')!;
    expect(first.getAttribute('dur')).toBe('4s');
    expect(first.getAttribute('begin')).toBe('0s');
  });

  it('speed=2 halves the dur on the first bar', async () => {
    const { container } = render(NeoIconAudio, { props: { speed: 2 } as never });
    await tick();
    const first = container.querySelector<SVGAnimateElement>('svg > g > path animate')!;
    expect(first.getAttribute('dur')).toBe('1s');
  });
});

describe('neoIconAudio — animated / repeat', () => {
  it('animated=false sets begin="indefinite" on every bar', async () => {
    const { container } = render(NeoIconAudio, { props: { animated: false } as never });
    await tick();
    const animates = container.querySelectorAll<SVGAnimateElement>('svg > g > path animate');
    expect(animates.length).toBe(6);
    for (const a of animates) expect(a.getAttribute('begin')).toBe('indefinite');
  });

  it('repeat=3 forwards repeatCount to every animate', async () => {
    const { container } = render(NeoIconAudio, { props: { repeat: 3 } as never });
    await tick();
    const animates = container.querySelectorAll<SVGAnimateElement>('svg > g > path animate');
    for (const a of animates) expect(a.getAttribute('repeatCount')).toBe('3');
  });

  it('default repeat="indefinite" forwards to every animate', async () => {
    const { container } = render(NeoIconAudio, { props: {} as never });
    await tick();
    const animates = container.querySelectorAll<SVGAnimateElement>('svg > g > path animate');
    for (const a of animates) expect(a.getAttribute('repeatCount')).toBe('indefinite');
  });
});
