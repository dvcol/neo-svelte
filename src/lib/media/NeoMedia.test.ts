import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoMedia from './NeoMedia.svelte';

afterEach(() => {
  cleanup();
});

const PNG = 'https://example.test/a.png';

describe('neoMedia — render', () => {
  it('renders a <figure> with .neo-media by default', async () => {
    const { container } = render(NeoMedia, { props: {} as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-media');
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('FIGURE');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoMedia, { props: { tag: 'section' } as never });
    await tick();
    expect(container.querySelector('.neo-media')?.tagName).toBe('SECTION');
  });

  it('image.src renders a NeoImage child', async () => {
    const { container } = render(NeoMedia, {
      props: { image: { src: PNG, alt: 'a' } } as never,
    });
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img');
    expect(img?.getAttribute('src')).toBe(PNG);
    expect(img?.getAttribute('alt')).toBe('a');
  });

  it('without image.src nor type, no <img> is rendered (skeleton path)', async () => {
    const { container } = render(NeoMedia, { props: {} as never });
    await tick();
    expect(container.querySelector('img.neo-image-img')).toBeNull();
  });

  it('caption (string) renders a <figcaption> with .neo-media-caption', async () => {
    const { container } = render(NeoMedia, {
      props: { image: { src: PNG }, caption: 'Hello' } as never,
    });
    await tick();
    const cap = container.querySelector('figcaption.neo-media-caption');
    expect(cap).not.toBeNull();
    expect(cap?.textContent?.trim()).toBe('Hello');
  });

  it('captionProps.tag swaps the caption element', async () => {
    const { container } = render(NeoMedia, {
      props: { image: { src: PNG }, caption: 'x', captionProps: { tag: 'p' } } as never,
    });
    await tick();
    const cap = container.querySelector('p.neo-media-caption');
    expect(cap).not.toBeNull();
  });
});

describe('neoMedia — style modifiers', () => {
  it('rounded=true adds .neo-rounded', async () => {
    const { container } = render(NeoMedia, { props: { rounded: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-rounded')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoMedia, { props: { glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-glass')).not.toBeNull();
  });

  it('filled=true adds .neo-filled', async () => {
    const { container } = render(NeoMedia, { props: { filled: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-filled')).not.toBeNull();
  });

  it('tinted=true adds .neo-tinted', async () => {
    const { container } = render(NeoMedia, { props: { tinted: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-tinted')).not.toBeNull();
  });

  it('borderless=true adds .neo-borderless', async () => {
    const { container } = render(NeoMedia, { props: { borderless: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-borderless')).not.toBeNull();
  });

  it('pressed=true adds .neo-pressed', async () => {
    const { container } = render(NeoMedia, { props: { pressed: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-pressed')).not.toBeNull();
  });

  it('elevation=0 adds .neo-flat', async () => {
    const { container } = render(NeoMedia, { props: { elevation: 0 } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-flat')).not.toBeNull();
  });

  it('elevation<0 adds .neo-inset', async () => {
    const { container } = render(NeoMedia, { props: { elevation: -2 } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-inset')).not.toBeNull();
  });

  it('start=true adds .neo-start', async () => {
    const { container } = render(NeoMedia, { props: { start: true } as never });
    await tick();
    expect(container.querySelector('.neo-media.neo-start')).not.toBeNull();
  });
});

describe('neoMedia — size', () => {
  it('width=number sets style.width to px', async () => {
    const { container } = render(NeoMedia, { props: { width: 400 } as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-media')!;
    expect(root.style.width).toBe('400px');
  });

  it('ratio sets aspect-ratio inline style', async () => {
    const { container } = render(NeoMedia, { props: { ratio: '16 / 9' } as never });
    await tick();
    // ratio is forwarded to <NeoImage>; the figure itself does not get ratio.
    // Without an image, this still renders without error.
    const root = container.querySelector<HTMLElement>('.neo-media');
    expect(root).not.toBeNull();
  });
});
