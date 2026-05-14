import { cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './NeoMenuHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getMenuLists(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-list'));
}

function getMenuItems(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(':scope .neo-menu-item:not(.neo-section)'));
}

const items = [
  { value: 'one' },
  {
    value: 'two',
    items: [
      { value: 'two-a' },
      { value: 'two-b' },
    ],
  },
  { value: 'three' },
];

describe('neoMenu — render', () => {
  it('renders the trigger element', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { items });
    expect(getByTestId('trigger-button').textContent).toBe('open');
  });

  it('keeps the menu mounted but hidden when closed (unmountOnClose=false)', async () => {
    renderWithPortalTarget(Harness, { items, open: false });
    await tick();
    const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });

  it('renders items as menuitems with role attributes when open', async () => {
    renderWithPortalTarget(Harness, { items, open: true });
    await tick();
    const lists = getMenuLists();
    expect(lists.length).toBeGreaterThan(0);
    const list = lists[0];
    expect(list.getAttribute('role')).toBe('menu');
    const rendered = getMenuItems(list);
    expect(rendered).toHaveLength(items.length);
    rendered.forEach((el) => {
      expect(el.getAttribute('role')).toBe('menuitem');
    });
  });

  it('marks items with nested children with aria-haspopup="menu"', async () => {
    renderWithPortalTarget(Harness, { items, open: true });
    await tick();
    const [, withNested] = getMenuItems(getMenuLists()[0]);
    expect(withNested.getAttribute('aria-haspopup')).toBe('menu');
  });
});

describe('neoMenu — selection', () => {
  it('fires onSelect for leaf items, not onMenu', async () => {
    const onSelect = vi.fn();
    const onMenu = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, onSelect, onMenu });
    await tick();
    const [first] = getMenuItems(getMenuLists()[0]);
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onMenu).not.toHaveBeenCalled();
    const [item] = onSelect.mock.calls[0] as [{ value: string }];
    expect(item.value).toBe('one');
  });

  it('fires onMenu for branches and does not fire onSelect', async () => {
    const onSelect = vi.fn();
    const onMenu = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, onMenu, onSelect });
    await tick();
    const [, branch] = getMenuItems(getMenuLists()[0]);
    const button = branch.querySelector<HTMLElement>('button, [role="button"]') ?? branch;
    await user.click(button);
    expect(onMenu).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
    const [item] = onMenu.mock.calls[0] as [{ value: string }];
    expect(item.value).toBe('two');
  });
});

describe('neoMenu — keepOpenOnSelect', () => {
  it('clicking a leaf calls onSelect (default keepOpenOnSelect path runs the dismiss branch)', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, onSelect });
    await tick();
    const [first] = getMenuItems(getMenuLists()[0]);
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    await tick();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('clicking a leaf still calls onSelect when keepOpenOnSelect=true (and no dismiss is requested)', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, keepOpenOnSelect: true, onSelect });
    await tick();
    const [first] = getMenuItems(getMenuLists()[0]);
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    await tick();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('per-item keepOpenOnSelect overrides the menu default for that leaf', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const customItems = [
      { value: 'sticky', keepOpenOnSelect: true },
      { value: 'normal' },
    ];
    renderWithPortalTarget(Harness, { items: customItems, open: true, onSelect });
    await tick();
    const [sticky] = getMenuItems(getMenuLists()[0]);
    const button = sticky.querySelector<HTMLElement>('button, [role="button"]') ?? sticky;
    await user.click(button);
    await tick();
    expect(onSelect).toHaveBeenCalledTimes(1);
    const [item] = onSelect.mock.calls[0] as [{ keepOpenOnSelect?: boolean }];
    expect(item.keepOpenOnSelect).toBe(true);
  });
});

describe('neoMenu — items reactivity', () => {
  it('renders the new item set when items prop changes', async () => {
    const { rerender } = renderWithPortalTarget(Harness, { items, open: true });
    await tick();
    const list = getMenuLists()[0];
    expect(getMenuItems(list)).toHaveLength(3);
    await rerender({ items: [...items, { value: 'four' }], open: true });
    await tick();
    expect(getMenuItems(getMenuLists()[0])).toHaveLength(4);
  });
});
