import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoAffix from './NeoAffix.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-affix-container');
}

describe('neoAffix — render', { tags: ['jsdom'] }, () => {
  it('renders a <span> wrapper by default with .neo-affix-container', async () => {
    const { container } = render(NeoAffix, {});
    await tick();
    const wrapper = getContainer(container);
    expect(wrapper).not.toBeNull();
    expect(wrapper?.tagName).toBe('SPAN');
  });

  it('tag prop overrides the wrapper element', async () => {
    const { container } = render(NeoAffix, { props: { tag: 'div' } as never });
    await tick();
    expect(container.querySelector('div.neo-affix-container')).not.toBeNull();
  });

  it('skeleton=true adds .neo-skeleton class', async () => {
    const { container } = render(NeoAffix, { props: { skeleton: true } as never });
    await tick();
    expect(getContainer(container)?.classList.contains('neo-skeleton')).toBe(true);
  });

  it('renders a validation slot by default (no loading, no close)', async () => {
    const { container } = render(NeoAffix, {});
    await tick();
    expect(container.querySelector('.neo-affix-validation')).not.toBeNull();
  });

  it('renders a clear button when close=true (after debounce)', async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(NeoAffix, { props: { close: true } as never });
      vi.advanceTimersByTime(150);
      await tick();
      const btn = container.querySelector<HTMLButtonElement>('button.neo-affix-clear');
      expect(btn).not.toBeNull();
      expect(btn?.getAttribute('aria-label')).toBe('clear');
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders a loading state when loading=true (overrides close)', async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(NeoAffix, { props: { loading: true, close: true } as never });
      vi.advanceTimersByTime(150);
      await tick();
      expect(container.querySelector('.neo-affix-loading')).not.toBeNull();
      expect(container.querySelector('button.neo-affix-clear')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('reflects valid state on the validation marker via data-valid', async () => {
    const { container, rerender } = render(NeoAffix, { props: { valid: true } as never });
    await tick();
    expect(container.querySelector('.neo-affix-validation')?.getAttribute('data-valid')).toBe('true');
    await rerender({ valid: false } as never);
    await tick();
    expect(container.querySelector('.neo-affix-validation')?.getAttribute('data-valid')).toBe('false');
  });
});

describe('neoAffix — clear button', { tags: ['jsdom'] }, () => {
  it('disabled=true prevents the clear button from rendering', async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(NeoAffix, { props: { close: true, disabled: true } as never });
      vi.advanceTimersByTime(150);
      await tick();
      expect(container.querySelector('button.neo-affix-clear')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('readonly=true prevents the clear button from rendering', async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(NeoAffix, { props: { close: true, readonly: true } as never });
      vi.advanceTimersByTime(150);
      await tick();
      expect(container.querySelector('button.neo-affix-clear')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('clicking the clear button fires closeProps.onclick', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const onclick = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(NeoAffix, { props: { close: true, closeProps: { onclick } } as never });
      vi.advanceTimersByTime(200);
      await tick();
      const btn = container.querySelector<HTMLButtonElement>('button.neo-affix-clear')!;
      await user.click(btn);
      expect(onclick).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
