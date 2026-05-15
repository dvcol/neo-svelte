import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoHtml from './NeoHtml.svelte';

afterEach(() => {
  cleanup();
});

describe('neoHtml — sanitization & rendering', { tags: ['jsdom'] }, () => {
  it('renders no HTML elements when html is undefined', async () => {
    const { container } = render(NeoHtml, { props: {} as never });
    await tick();
    // Only Svelte's anchor comment is present, no real elements
    expect(container.children.length).toBe(0);
  });

  it('renders sanitized HTML content', async () => {
    const { container } = render(NeoHtml, {
      props: { html: '<b>bold</b> text' } as never,
    });
    await tick();
    expect(container.querySelector('b')?.textContent).toBe('bold');
  });

  it('strips disallowed scripts via dompurify (XSS guard)', async () => {
    const { container } = render(NeoHtml, {
      props: { html: '<p>safe</p><script>window.x=1</script>' } as never,
    });
    await tick();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('p')?.textContent).toBe('safe');
  });

  it('passes ALLOWED_TAGS option through to dompurify', async () => {
    const { container } = render(NeoHtml, {
      props: {
        html: '<b>kept</b><i>stripped</i>',
        ALLOWED_TAGS: ['b'],
      } as never,
    });
    await tick();
    expect(container.querySelector('b')?.textContent).toBe('kept');
    expect(container.querySelector('i')).toBeNull();
  });
});
