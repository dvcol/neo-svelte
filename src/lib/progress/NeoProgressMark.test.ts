import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoProgressMark from './NeoProgressMark.svelte';

afterEach(() => {
  cleanup();
});

describe('neoProgressMark', { tags: ['jsdom'] }, () => {
  it('renders a button with an aria-label that reflects the position', async () => {
    const { container } = render(NeoProgressMark, { props: { position: 50 } as never });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button');
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-label')).toContain('50');
  });

  it('renders an indexed marker label as the index', async () => {
    const { container } = render(NeoProgressMark, { props: { position: 25, index: 0 } as never });
    await tick();
    expect(container.querySelector('button')?.textContent?.trim()).toBe('0');
  });

  it('renders the position as label when index is missing', async () => {
    const { container } = render(NeoProgressMark, { props: { position: 75 } as never });
    await tick();
    expect(container.querySelector('button')?.textContent?.trim()).toBe('75');
  });

  it('renders pressed (.neo-pressed) when position <= context.value', async () => {
    const { container } = render(NeoProgressMark, {
      props: { position: 25, context: { value: 50 } } as never,
    });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button')!;
    expect(btn.classList.contains('neo-pressed')).toBe(true);
  });

  it('not pressed when position > context.value', async () => {
    const { container } = render(NeoProgressMark, {
      props: { position: 75, context: { value: 25 } } as never,
    });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button')!;
    expect(btn.classList.contains('neo-pressed')).toBe(false);
  });
});
