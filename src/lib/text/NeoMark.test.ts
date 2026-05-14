import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoMark from './NeoMark.svelte';

afterEach(() => {
  cleanup();
});

describe('neoMark — render & tokenization', () => {
  it('default tag=span renders the host element with .neo-mark', async () => {
    const { container } = render(NeoMark, { props: { value: 'Hello' } as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-mark');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('SPAN');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoMark, { props: { tag: 'p', value: 'x' } as never });
    await tick();
    expect(container.querySelector('.neo-mark')?.tagName).toBe('P');
  });

  it('without filter renders raw text (no <mark> wrapper)', async () => {
    const { container } = render(NeoMark, { props: { value: 'plain text' } as never });
    await tick();
    expect(container.querySelector('.neo-mark')?.textContent?.trim()).toBe('plain text');
    expect(container.querySelector('mark')).toBeNull();
  });

  it('filter wraps the matching substring in a <mark> element', async () => {
    const { container } = render(NeoMark, {
      props: { value: 'find the needle in haystack', filter: 'needle' } as never,
    });
    await tick();
    const mark = container.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark?.textContent).toBe('needle');
  });

  it('filter that does not match keeps the original text without any <mark>', async () => {
    const { container } = render(NeoMark, {
      props: { value: 'no match here', filter: 'qzx' } as never,
    });
    await tick();
    expect(container.querySelector('mark')).toBeNull();
    expect(container.querySelector('.neo-mark')?.textContent?.trim()).toBe('no match here');
  });

  it('html=true sanitizes and renders content via NeoHtml (no escaping of <mark>)', async () => {
    const { container } = render(NeoMark, {
      props: { value: '<b>bold</b> word', filter: 'word', html: true } as never,
    });
    await tick();
    // dompurify should keep the <b> tag from the source HTML
    expect(container.querySelector('b')?.textContent).toBe('bold');
    // and the filter-injected <mark> should be present too
    expect(container.querySelector('mark')?.textContent).toBe('word');
  });

  it('forwards arbitrary attrs (id, data-*) to the host', async () => {
    const { container } = render(NeoMark, {
      props: { 'value': 'x', 'id': 'my-mark', 'data-testid': 'mk' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('#my-mark');
    expect(host).not.toBeNull();
    expect(host?.getAttribute('data-testid')).toBe('mk');
  });
});
