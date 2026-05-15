import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSkeletonMedia from './NeoSkeletonMedia.svelte';

afterEach(() => {
  cleanup();
});

describe('neoSkeletonMedia — render & default classes', { tags: ['jsdom'] }, () => {
  it('rounded=true adds .neo-rounded', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { rounded: true } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media.neo-rounded')).not.toBeNull();
  });

  it('circle=true adds .neo-circle', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { circle: true } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media.neo-circle')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media.neo-glass')).not.toBeNull();
  });
});

describe('neoSkeletonMedia — type → icon', { tags: ['jsdom'] }, () => {
  it('default type=empty renders no icon SVG', async () => {
    const { container } = render(NeoSkeletonMedia, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media-icon svg')).toBeNull();
  });

  it('type="image" renders an SVG inside .neo-skeleton-media-icon', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'image' } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media-icon svg')).not.toBeNull();
  });

  it('type="video" renders an SVG inside .neo-skeleton-media-icon', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'video' } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media-icon svg')).not.toBeNull();
  });

  it('type="audio" renders an SVG inside .neo-skeleton-media-icon', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'audio' } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media-icon svg')).not.toBeNull();
  });

  it('type="avatar" renders an SVG inside .neo-skeleton-media-icon', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'avatar' } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-media-icon svg')).not.toBeNull();
  });
});

describe('neoSkeletonMedia — sizing forwarded to inner element', { tags: ['jsdom'] }, () => {
  it('aspect-ratio defaults to "4 / 3" for non-video types', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'image' } as never });
    await tick();
    const el = container.querySelector<HTMLElement>('.neo-skeleton-media')!;
    expect(el.style.aspectRatio).toBe('4 / 3');
  });

  it('aspect-ratio defaults to "16 / 9" for type="video"', async () => {
    const { container } = render(NeoSkeletonMedia, { props: { type: 'video' } as never });
    await tick();
    const el = container.querySelector<HTMLElement>('.neo-skeleton-media')!;
    expect(el.style.aspectRatio).toBe('16 / 9');
  });

  it('explicit ratio overrides the default', async () => {
    const { container } = render(NeoSkeletonMedia, {
      props: { type: 'video', ratio: '1 / 1' } as never,
    });
    await tick();
    const el = container.querySelector<HTMLElement>('.neo-skeleton-media')!;
    expect(el.style.aspectRatio).toBe('1 / 1');
  });

  it('size prop reflects on --neo-skeleton-media-icon-size CSS var', async () => {
    const { container } = render(NeoSkeletonMedia, {
      props: { type: 'image', size: '40%' } as never,
    });
    await tick();
    const icon = container.querySelector<HTMLElement>('.neo-skeleton-media-icon')!;
    expect(icon.style.cssText).toContain('--neo-skeleton-media-icon-size: 40%');
  });

  it('width as plain string forwards as inline width', async () => {
    const { container } = render(NeoSkeletonMedia, {
      props: { width: '200px' } as never,
    });
    await tick();
    const el = container.querySelector<HTMLElement>('.neo-skeleton-media')!;
    expect(el.style.width).toBe('200px');
  });
});

describe('neoSkeletonMedia — disabled bypass', { tags: ['jsdom'] }, () => {
  it('disabled=true (with no content slot) suppresses the skeleton render', async () => {
    const { container } = render(NeoSkeletonMedia, {
      props: { disabled: true } as never,
    });
    await tick();
    // disabled bypass renders only the content snippet — none was provided, so the skeleton media disappears
    expect(container.querySelector('.neo-skeleton-media')).toBeNull();
  });
});
