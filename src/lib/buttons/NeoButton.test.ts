import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoButtonHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-button');
}

function getAnchor(scope: ParentNode = document): HTMLAnchorElement | null {
  return scope.querySelector<HTMLAnchorElement>('a.neo-button');
}

describe('neoButton — render', () => {
  it('renders a <button> element by default with type="button" and tabindex=0 not set (native button)', async () => {
    const { container } = render(Harness, { props: { bodyText: 'click me' } as never });
    await tick();
    const btn = getButton(container);
    expect(btn).not.toBeNull();
    expect(btn?.tagName).toBe('BUTTON');
    expect(btn?.getAttribute('type')).toBe('button');
    expect(container.querySelector('[data-testid="btn-body"]')?.textContent).toBe('click me');
  });

  it('renders an <a> element when href is provided', async () => {
    const { container } = render(Harness, { props: { href: '/foo', bodyText: 'go' } as never });
    await tick();
    expect(getAnchor(container)).not.toBeNull();
    expect(getAnchor(container)?.getAttribute('href')).toBe('/foo');
  });

  it('renders custom tag when tag prop is supplied (role=button)', async () => {
    const { container } = render(Harness, { props: { tag: 'div', bodyText: 'div-btn' } as never });
    await tick();
    const el = container.querySelector<HTMLElement>('div.neo-button');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('role')).toBe('button');
  });

  it('renders the label string in content', async () => {
    const { container } = render(Harness, { props: { label: 'Save' } as never });
    await tick();
    expect(getButton(container)?.textContent).toContain('Save');
  });

  it('renders an icon string as a NeoImage', async () => {
    const { container } = render(Harness, { props: { icon: '/img.png', label: 'X' } as never });
    await tick();
    expect(getButton(container)?.querySelector('.neo-icon')).not.toBeNull();
  });
});

describe('neoButton — disabled / readonly / loading', () => {
  it('disabled=true sets the disabled attribute on a native button', async () => {
    const { container } = render(Harness, { props: { disabled: true, label: 'd' } as never });
    await tick();
    expect(getButton(container)?.disabled).toBe(true);
  });

  it('disabled prevents click handlers from firing', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { disabled: true, label: 'd', onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('readonly applies .neo-readonly and aria-disabled (without disabled attribute)', async () => {
    const { container } = render(Harness, { props: { readonly: true, label: 'r' } as never });
    await tick();
    const btn = getButton(container);
    expect(btn?.classList.contains('neo-readonly')).toBe(true);
    expect(btn?.getAttribute('aria-disabled')).toBe('true');
    expect(btn?.disabled).toBe(false);
  });

  it('readonly prevents onclick from firing', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { readonly: true, label: 'r', onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('loading applies .neo-loading and renders a spinner inside .neo-icon', async () => {
    const { container } = render(Harness, { props: { loading: true, label: 'l' } as never });
    await tick();
    const btn = getButton(container);
    expect(btn?.classList.contains('neo-loading')).toBe(true);
    // spinner is rendered when loading is true
    expect(btn?.querySelector('.neo-icon')).not.toBeNull();
  });

  it('loading prevents onclick from firing', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { loading: true, label: 'l', onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).not.toHaveBeenCalled();
  });
});

describe('neoButton — click & propagation', () => {
  it('clicking fires onclick exactly once with a MouseEvent', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { label: 'c', onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).toHaveBeenCalledTimes(1);
    const event = onclick.mock.calls[0][0] as Event;
    expect(event.type).toBe('click');
  });

  it('propagation=false adds .neo-propagation and stops bubbling on click', async () => {
    const outerOnClick = vi.fn();
    const innerOnClick = vi.fn();
    const user = userEvent.setup();
    document.body.addEventListener('click', outerOnClick);
    try {
      const { container } = render(Harness, { props: { propagation: false, label: 'p', onclick: innerOnClick } as never });
      await tick();
      const btn = getButton(container);
      expect(btn?.classList.contains('neo-propagation')).toBe(true);
      await user.click(btn!);
      expect(innerOnClick).toHaveBeenCalledTimes(1);
      expect(outerOnClick).not.toHaveBeenCalled();
    } finally {
      document.body.removeEventListener('click', outerOnClick);
    }
  });

  it('propagation=true (default) lets the event bubble', async () => {
    const outerOnClick = vi.fn();
    const innerOnClick = vi.fn();
    const user = userEvent.setup();
    document.body.addEventListener('click', outerOnClick);
    try {
      const { container } = render(Harness, { props: { label: 'p', onclick: innerOnClick } as never });
      await tick();
      await user.click(getButton(container)!);
      expect(innerOnClick).toHaveBeenCalledTimes(1);
      expect(outerOnClick).toHaveBeenCalledTimes(1);
    } finally {
      document.body.removeEventListener('click', outerOnClick);
    }
  });
});

describe('neoButton — toggle mode', () => {
  it('toggle=true flips checked on each click and fires onchecked + onclick(checked)', async () => {
    const onchecked = vi.fn();
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { toggle: true, label: 't', onchecked, onclick } as never });
    await tick();
    const btn = getButton(container);
    expect(btn?.classList.contains('neo-toggle')).toBe(true);
    await user.click(btn!);
    expect(onchecked).toHaveBeenLastCalledWith(true);
    expect(onclick).toHaveBeenLastCalledWith(expect.any(Object), true);
    await user.click(btn!);
    expect(onchecked).toHaveBeenLastCalledWith(false);
    expect(onclick).toHaveBeenLastCalledWith(expect.any(Object), false);
  });

  it('initial checked=true reflects the .neo-pressed class', async () => {
    const { container } = render(Harness, { props: { toggle: true, checked: true, label: 't' } as never });
    await tick();
    expect(getButton(container)?.classList.contains('neo-pressed')).toBe(true);
  });
});

describe('neoButton — keyboard activation', () => {
  it('enter on a focused button triggers onclick (native)', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { label: 'k', onclick } as never });
    await tick();
    getButton(container)!.focus();
    await user.keyboard('{Enter}');
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('space on a focused button triggers onclick (native)', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { label: 'k', onclick } as never });
    await tick();
    getButton(container)!.focus();
    await user.keyboard(' ');
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('enter keydown sets .neo-pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { label: 'k' } as never });
    await tick();
    const btn = getButton(container)!;
    btn.focus();
    await user.keyboard('{Enter>}');
    await tick();
    expect(btn.classList.contains('neo-pressed')).toBe(true);
  });
});

describe('neoButton — focus / hover bindables', () => {
  it('focusing the button flips focused state (via onfocus prop)', async () => {
    const onfocus = vi.fn();
    const onblur = vi.fn();
    const { container } = render(Harness, { props: { label: 'f', onfocus, onblur } as never });
    await tick();
    const btn = getButton(container)!;
    btn.focus();
    expect(onfocus).toHaveBeenCalled();
    btn.blur();
    expect(onblur).toHaveBeenCalled();
  });
});
