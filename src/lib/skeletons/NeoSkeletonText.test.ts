import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSkeletonText from './NeoSkeletonText.svelte';

afterEach(() => {
  cleanup();
});

describe('neoSkeletonText — defaults', { tags: ['jsdom'] }, () => {
  it('renders .neo-skeleton-text with one paragraph and 6 lines (fallback)', async () => {
    const { container } = render(NeoSkeletonText, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-text')).not.toBeNull();
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph').length).toBe(1);
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph .neo-skeleton-text-line').length).toBe(6);
  });

  it('alt=true increases default fallback to 26 lines', async () => {
    const { container } = render(NeoSkeletonText, { props: { alt: true } as never });
    await tick();
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph .neo-skeleton-text-line.neo-alt').length).toBe(26);
  });

  it('explicit lines overrides the fallback', async () => {
    const { container } = render(NeoSkeletonText, { props: { lines: 3 } as never });
    await tick();
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph .neo-skeleton-text-line').length).toBe(3);
  });

  it('paragraphs > 1 multiplies the line count', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { paragraphs: 2, lines: 3 } as never,
    });
    await tick();
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph').length).toBe(2);
    expect(container.querySelectorAll('.neo-skeleton-text-paragraph .neo-skeleton-text-line').length).toBe(6);
  });

  it('lines as array maps per-paragraph line counts', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { paragraphs: 2, lines: [2, 4] } as never,
    });
    await tick();
    const paragraphs = container.querySelectorAll('.neo-skeleton-text-paragraph');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].querySelectorAll('.neo-skeleton-text-line').length).toBe(2);
    expect(paragraphs[1].querySelectorAll('.neo-skeleton-text-line').length).toBe(4);
  });
});

describe('neoSkeletonText — title', { tags: ['jsdom'] }, () => {
  it('title=true renders an additional .neo-title line above paragraphs', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { title: true, lines: 1 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-text-line.neo-title')).not.toBeNull();
  });

  it('title=false renders no .neo-title line', async () => {
    const { container } = render(NeoSkeletonText, { props: { lines: 1 } as never });
    await tick();
    expect(container.querySelector('.neo-skeleton-text-line.neo-title')).toBeNull();
  });
});

describe('neoSkeletonText — modifiers', { tags: ['jsdom'] }, () => {
  it('justify=true adds .neo-justify on each paragraph', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { justify: true, lines: 1 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-text-paragraph.neo-justify')).not.toBeNull();
  });

  it('alt=true adds .neo-alt on lines and paragraphs', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { alt: true, lines: 2 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-text-paragraph.neo-alt')).not.toBeNull();
    expect(container.querySelectorAll('.neo-skeleton-text-line.neo-alt').length).toBeGreaterThan(0);
  });

  it('glass=true adds .neo-glass on the host', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { glass: true, lines: 1 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-text.neo-glass')).not.toBeNull();
  });
});

describe('neoSkeletonText — disabled bypass', { tags: ['jsdom'] }, () => {
  it('disabled=true with no content slot renders nothing', async () => {
    const { container } = render(NeoSkeletonText, {
      props: { disabled: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-skeleton-text')).toBeNull();
  });
});
