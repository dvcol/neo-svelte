import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoImage from './NeoImage.svelte';

afterEach(() => {
  cleanup();
});

const PNG = 'https://example.test/a.png';
const FALLBACK = 'https://example.test/fallback.png';

function fireImgEvent(scope: ParentNode, event: 'load' | 'error'): HTMLImageElement {
  const img = scope.querySelector<HTMLImageElement>('img.neo-image-img')!;
  img.dispatchEvent(new Event(event, { cancelable: true }));
  return img;
}

describe('neoImage — render', { tags: ['jsdom'] }, () => {
  it('renders a div.neo-image wrapping an <img>', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, alt: 'a' } as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image');
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    const img = root?.querySelector<HTMLImageElement>('img.neo-image-img');
    expect(img?.getAttribute('src')).toBe(PNG);
    expect(img?.getAttribute('alt')).toBe('a');
  });

  it('forwards src/alt and applies loading="lazy" decoding="auto"', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, alt: 'a' } as never });
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img')!;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('auto');
  });

  it('initially has data-loaded="false" and data-error="false"', async () => {
    const { container } = render(NeoImage, { props: { src: PNG } as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.dataset.loaded).toBe('false');
    expect(root.dataset.error).toBe('false');
  });

  it('rounded=true adds .neo-rounded to host and img', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, rounded: true } as never });
    await tick();
    expect(container.querySelector('.neo-image.neo-rounded')).not.toBeNull();
    expect(container.querySelector('img.neo-image-img.neo-rounded')).not.toBeNull();
  });

  it('glass=true adds .neo-glass on the host', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-image.neo-glass')).not.toBeNull();
  });

  it('skeleton=true adds .neo-skeleton on the host', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, skeleton: true } as never });
    await tick();
    expect(container.querySelector('.neo-image.neo-skeleton')).not.toBeNull();
  });

  it('showAltText=true adds .neo-alt-text on the inner img', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, alt: 'x', showAltText: true } as never });
    await tick();
    expect(container.querySelector('img.neo-alt-text')).not.toBeNull();
  });

  it('containerProps.tag swaps the host element', async () => {
    const { container } = render(NeoImage, {
      props: { src: PNG, containerProps: { tag: 'figure' } } as never,
    });
    await tick();
    const root = container.querySelector('.neo-image');
    expect(root?.tagName).toBe('FIGURE');
  });

  it('width=number sets style.width in px', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, width: 200 } as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.style.width).toBe('200px');
  });

  it('ratio sets aspect-ratio inline style', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, ratio: '4 / 3' } as never });
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.style.aspectRatio).toBe('4 / 3');
  });

  it('fit forwards as object-fit on the inner img', async () => {
    const { container } = render(NeoImage, { props: { src: PNG, fit: 'cover' } as never });
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img')!;
    expect(img.style.objectFit).toBe('cover');
  });
});

describe('neoImage — events', { tags: ['jsdom'] }, () => {
  it('img onload sets data-loaded="true" and clears error', async () => {
    const onload = vi.fn();
    const { container } = render(NeoImage, { props: { src: PNG, onload } as never });
    await tick();
    fireImgEvent(container, 'load');
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.dataset.loaded).toBe('true');
    expect(root.dataset.error).toBe('false');
    expect(onload).toHaveBeenCalledTimes(1);
  });

  it('img onerror sets data-error="true" and adds .neo-error', async () => {
    const onerror = vi.fn();
    const { container } = render(NeoImage, { props: { src: PNG, onerror } as never });
    await tick();
    fireImgEvent(container, 'error');
    await tick();
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.dataset.error).toBe('true');
    expect(root.classList.contains('neo-error')).toBe(true);
    expect(onerror).toHaveBeenCalledTimes(1);
  });

  it('error with fallback swaps src to fallback and reflects data-fallback="true"', async () => {
    const { container } = render(NeoImage, {
      props: { src: PNG, fallback: FALLBACK } as never,
    });
    await tick();
    fireImgEvent(container, 'error');
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img')!;
    expect(img.getAttribute('src')).toBe(FALLBACK);
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.dataset.fallback).toBe('true');
    expect(root.dataset.src).toBe(FALLBACK);
  });

  it('error with no fallback keeps src and shows the warning state', async () => {
    const { container } = render(NeoImage, { props: { src: PNG } as never });
    await tick();
    fireImgEvent(container, 'error');
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img')!;
    expect(img.getAttribute('src')).toBe(PNG);
    const root = container.querySelector<HTMLElement>('.neo-image')!;
    expect(root.dataset.fallback).toBe('false');
  });

  it('preventDefault on onerror prevents the fallback swap', async () => {
    const onerror = vi.fn((e: Event) => e.preventDefault());
    const { container } = render(NeoImage, {
      props: { src: PNG, fallback: FALLBACK, onerror } as never,
    });
    await tick();
    fireImgEvent(container, 'error');
    await tick();
    const img = container.querySelector<HTMLImageElement>('img.neo-image-img')!;
    expect(img.getAttribute('src')).toBe(PNG);
  });
});
