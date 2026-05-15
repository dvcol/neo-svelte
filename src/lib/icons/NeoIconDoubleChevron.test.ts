import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconDoubleChevron from './NeoIconDoubleChevron.svelte';

afterEach(() => {
  cleanup();
});

describe('neoIconDoubleChevron — defaults', { tags: ['jsdom'] }, () => {
  it('renders two chevron paths', async () => {
    const { container } = render(NeoIconDoubleChevron, { props: {} as never });
    await tick();
    const paths = container.querySelectorAll('svg > path.neo-icon-double-chevron');
    expect(paths.length).toBe(2);
  });

  it('default space=7 sets translate=-7px on top, +7px on bottom', async () => {
    const { container } = render(NeoIconDoubleChevron, { props: {} as never });
    await tick();
    const [top, bottom] = Array.from(container.querySelectorAll<SVGPathElement>('svg > path'));
    expect(top.style.translate).toBe('0 -7px');
    expect(bottom.style.translate).toBe('0 7px');
  });

  it('space=12 forwards into translate', async () => {
    const { container } = render(NeoIconDoubleChevron, { props: { space: 12 } as never });
    await tick();
    const [top, bottom] = Array.from(container.querySelectorAll<SVGPathElement>('svg > path'));
    expect(top.style.translate).toBe('0 -12px');
    expect(bottom.style.translate).toBe('0 12px');
  });
});
