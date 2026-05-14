import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconSunMoon from './NeoIconSunMoon.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconSunMoon — initial render branches', () => {
  it('default state="sun" + enter=true renders the sun-enter branch (3 paths in <g>)', async () => {
    const { container } = render(NeoIconSunMoon, { props: {} as never });
    await tick();
    const groups = container.querySelectorAll<SVGGElement>('svg > g');
    expect(groups.length).toBe(1);
    expect(groups[0].querySelectorAll('path').length).toBe(3);
    expect(container.querySelector('mask')).toBeNull();
  });

  it('state="moon" + enter=true renders the moon-enter branch (no mask, with stars + crescent)', async () => {
    const { container } = render(NeoIconSunMoon, { props: { state: 'moon' } as never });
    await tick();
    expect(container.querySelector('mask')).toBeNull();
    // Two star paths in opacity=0 group, plus the crescent path
    const stars = container.querySelectorAll('svg > g[fill="currentColor"] path');
    expect(stars.length).toBe(2);
  });

  it('state="sun" + enter=false renders the sun-rest branch (with a transition mask)', async () => {
    const { container } = render(NeoIconSunMoon, {
      props: { state: 'sun', enter: false } as never,
    });
    await tick();
    expect(container.querySelector('mask#lineMdMoonFilledToSunnyFilledLoopTransition0')).not.toBeNull();
  });

  it('state="moon" + enter=false renders the moon-rest branch (with a different transition mask)', async () => {
    const { container } = render(NeoIconSunMoon, {
      props: { state: 'moon', enter: false } as never,
    });
    await tick();
    expect(container.querySelector('mask#lineMdSunnyFilledLoopToMoonFilledLoopTransition1')).not.toBeNull();
  });
});

describe('neoIconSunMoon — pass-through props', () => {
  it('size and scale forward to the svg', async () => {
    const { container } = render(NeoIconSunMoon, {
      props: { size: '32px', scale: 2 } as never,
    });
    await tick();
    const svg = container.querySelector<SVGSVGElement>('svg')!;
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.style.scale).toBe('2');
  });
});
