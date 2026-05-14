import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoListBaseItem from './NeoListBaseItem.svelte';

afterEach(() => {
  cleanup();
});

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('.neo-list-item-button');
}

function getContent(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-list-item-content');
}

describe('neoListBaseItem — render', () => {
  it('renders a non-button content when no href, onclick or select is provided', async () => {
    const { container } = render(NeoListBaseItem, { props: { item: { value: 'a', label: 'Alpha' }, index: 0 } as never });
    await tick();
    expect(getButton(container)).toBeNull();
    expect(getContent(container)?.textContent).toContain('Alpha');
    expect(getContent(container)?.classList.contains('neo-button')).toBe(false);
  });

  it('renders a button wrapper when item.onclick is set', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', onclick: () => {} }, index: 0 } as never,
    });
    await tick();
    expect(getButton(container)).not.toBeNull();
    expect(getContent(container)?.classList.contains('neo-button')).toBe(true);
  });

  it('renders a button wrapper when select=true', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha' }, index: 0, select: true } as never,
    });
    await tick();
    expect(getButton(container)).not.toBeNull();
    expect(container.querySelector('.neo-list-item-checkmark')).not.toBeNull();
  });

  it('arrow=true renders the arrow affix', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', onclick: () => {} }, index: 0, arrow: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-list-item-arrow')).not.toBeNull();
  });

  it('renders description and tags when provided', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', description: 'desc text', tags: ['t1', 't2'] }, index: 0 } as never,
    });
    await tick();
    expect(container.querySelector('.neo-list-item-description')?.textContent).toContain('desc text');
    const tags = container.querySelectorAll('.neo-list-item-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent).toContain('t1');
  });

  it('disabled adds .neo-disabled to content', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha' }, index: 0, disabled: true } as never,
    });
    await tick();
    expect(getContent(container)?.classList.contains('neo-disabled')).toBe(true);
  });

  it('item.disabled also disables the content', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', disabled: true }, index: 0 } as never,
    });
    await tick();
    expect(getContent(container)?.classList.contains('neo-disabled')).toBe(true);
  });

  it('reverse swaps before/after position via .neo-reverse', async () => {
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha' }, index: 0, reverse: true } as never,
    });
    await tick();
    expect(getContent(container)?.classList.contains('neo-reverse')).toBe(true);
  });
});

describe('neoListBaseItem — interaction', () => {
  it('clicking the button calls item.onclick and onclick', async () => {
    const itemClick = vi.fn();
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', onclick: itemClick }, index: 0, onclick } as never,
    });
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('disabled blocks the onclick handler', async () => {
    const itemClick = vi.fn();
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha', onclick: itemClick }, index: 0, onclick, disabled: true } as never,
    });
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(itemClick).not.toHaveBeenCalled();
    expect(onclick).not.toHaveBeenCalled();
  });

  it('readonly suppresses the list onclick handler', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoListBaseItem, {
      props: { item: { value: 'a', label: 'Alpha' }, index: 0, onclick, readonly: true } as never,
    });
    await tick();
    await user.click(getButton(container)!);
    await tick();
    expect(onclick).not.toHaveBeenCalled();
  });
});
