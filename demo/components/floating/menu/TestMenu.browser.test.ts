import { CARDINAL_PLACEMENTS, forEachViewport } from 'test/helpers/floating-visual.js';
import { expectSide, waitForFloatingPosition } from 'test/helpers/floating.js';
import { quietForVisual, screenshotName, setViewport } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import Harness from '~/floating/menu/NeoMenu.test.svelte';

import VisualHarness from './TestMenu.browser.test.svelte';

afterEach(() => {
  cleanup();
});

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

function getMenuList(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-menu-list');
}

function getAllMenuLists(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-list'));
}

function getTrigger(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="trigger-button"]');
}

async function openMenu(extra: Record<string, unknown> = {}) {
  const result = render(Harness, {
    props: { items, open: true, ...extra } as never,
  });
  const list = await vi.waitFor(() => {
    const el = getMenuList();
    if (!el) throw new Error('menu list not mounted');
    return el;
  }, { timeout: 1000, interval: 16 });
  await waitForFloatingPosition(list);
  return { ...result, list };
}

describe('neoMenu — controlled open prop', { tags: ['browser'] }, () => {
  it('renders the menu list visible when mounted with open=true', async () => {
    const { list } = await openMenu({
      triggerProps: {
        style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      },
    });
    const tooltip = list.closest<HTMLElement>('.neo-tooltip');
    expect(tooltip?.hasAttribute('hidden')).toBe(false);
    const rect = list.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBeGreaterThan(0);
  });
});

describe('neoMenu — layout (real DOM)', { tags: ['browser'] }, () => {
  it('mounts the menu list below the trigger by default', async () => {
    const { list } = await openMenu({
      triggerProps: {
        style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      },
    });
    expectSide(getTrigger()!, list, 'bottom');
  });

  it('flips above the trigger when there is no room below', async () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const { list } = await openMenu({
      triggerProps: {
        style: 'position:fixed;left:50%;bottom:0;transform:translate(-50%,0);',
      },
    });
    const trigger = getTrigger()!;
    const refRect = trigger.getBoundingClientRect();
    expect(window.innerHeight - refRect.bottom).toBeLessThan(20);
    expectSide(trigger, list, 'top');
  });
});

describe('neoMenu — keyboard interaction (real focus)', { tags: ['browser'] }, () => {
  it('escape on the open menu dismisses and returns focus path', async () => {
    const user = userEvent.setup();
    await openMenu({
      triggerProps: {
        style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      },
    });
    expect(getMenuList()).not.toBeNull();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
      // unmountOnClose=false by default, so the tooltip stays in the DOM with hidden=true.
      expect(tooltip?.hasAttribute('hidden')).toBe(true);
    });
  });

  it('tab from the trigger keeps focus inside the menu when open', async () => {
    const user = userEvent.setup();
    await openMenu({
      triggerProps: {
        style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      },
    });
    const trigger = getTrigger()!;
    trigger.focus();
    expect(document.activeElement).toBe(trigger);
    await user.tab();
    const list = getMenuList()!;
    // Expected behavior: focus moves into the menu list (NeoMenu.svelte toggleListener).
    await vi.waitFor(() => {
      expect(list.contains(document.activeElement)).toBe(true);
    });
  });
});

describe('neoMenu — nested submenu (real layout)', { tags: ['browser'] }, () => {
  it('hovering a nested item opens its submenu', async () => {
    const user = userEvent.setup();
    await openMenu({
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
      },
    });
    const nestedTrigger = Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-item'))
      .find(el => el.getAttribute('aria-haspopup') === 'menu');
    expect(nestedTrigger).toBeDefined();
    await user.hover(nestedTrigger!);
    await vi.waitFor(() => {
      const lists = getAllMenuLists();
      expect(lists.length).toBeGreaterThanOrEqual(2);
    });
  });
});

const deepItems = [
  { value: 'one' },
  {
    value: 'two',
    items: [
      { value: 'two-a' },
      {
        value: 'two-b',
        items: [
          { value: 'two-b-x' },
          { value: 'two-b-y' },
          { value: 'two-b-z' },
        ],
      },
      { value: 'two-c' },
    ],
  },
  { value: 'three' },
];

function getOpenTooltips(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-tooltip')).filter(el => !el.hasAttribute('hidden'));
}

function findHaspopupTrigger(scope: ParentNode | Document, label: string): HTMLElement | undefined {
  return Array.from(scope.querySelectorAll<HTMLElement>('.neo-menu-item[aria-haspopup="menu"]'))
    .find(el => el.textContent?.includes(label));
}

function getVisibleMenuLists(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-list')).filter((list) => {
    const tip = list.closest<HTMLElement>('.neo-tooltip');
    if (!tip) return true; // top-level list isn't always wrapped.
    return !tip.hasAttribute('hidden');
  });
}

async function hoverOpenSubmenu(user: ReturnType<typeof userEvent.setup>, trigger: HTMLElement, expectedVisibleCount: number) {
  // Drive openOnHover: pointerenter on the wrapping <li> + the inner button.
  const wrapper = trigger.closest<HTMLElement>('.neo-menu-item') ?? trigger;
  const button = trigger.querySelector<HTMLElement>('button') ?? trigger;
  await user.hover(wrapper);
  await user.hover(button);
  return vi.waitFor(() => {
    const visible = getVisibleMenuLists();
    if (visible.length < expectedVisibleCount) throw new Error(`expected ≥${expectedVisibleCount} visible menu lists, got ${visible.length}`);
    return visible[expectedVisibleCount - 1];
  }, { timeout: 3000, interval: 32 });
}

async function expandToLeaf(user: ReturnType<typeof userEvent.setup>) {
  const level1Trigger = findHaspopupTrigger(document, 'two');
  expect(level1Trigger, 'level-1 nested trigger ("two") should exist').toBeDefined();
  const level2List = await hoverOpenSubmenu(user, level1Trigger!, 2);
  await waitForFloatingPosition(level2List);

  const level2Trigger = findHaspopupTrigger(level2List, 'two-b');
  expect(level2Trigger, 'level-2 nested trigger ("two-b") should exist').toBeDefined();
  const level3List = await hoverOpenSubmenu(user, level2Trigger!, 3);
  await waitForFloatingPosition(level3List);

  return {
    level1Trigger: level1Trigger!,
    level2Trigger: level2Trigger!,
    level2List,
    level3List,
  };
}

describe('neoMenu — deeply nested cascade (≥3 levels)', { tags: ['browser'] }, () => {
  it('places each submenu to the right of its parent menuitem at desktop viewport', async () => {
    await setViewport('desktop');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        // Pin trigger near top-left so the cascade has plenty of room rightward.
        style: 'position:fixed;top:80px;left:80px;',
      },
    });
    const { level1Trigger, level2Trigger, level2List, level3List } = await expandToLeaf(user);

    // Each level's tooltip rect must lie strictly to the right of its parent menuitem.
    const level1TooltipRect = level2List.closest<HTMLElement>('.neo-tooltip')!.getBoundingClientRect();
    const level2TooltipRect = level3List.closest<HTMLElement>('.neo-tooltip')!.getBoundingClientRect();
    const level1TriggerRect = level1Trigger.getBoundingClientRect();
    const level2TriggerRect = level2Trigger.getBoundingClientRect();

    expect(level1TooltipRect.left).toBeGreaterThanOrEqual(level1TriggerRect.right - 20);
    expect(level2TooltipRect.left).toBeGreaterThanOrEqual(level2TriggerRect.right - 20);

    // All cascading tooltips have non-zero size — no collapsed layout.
    for (const tt of getOpenTooltips()) {
      const r = tt.getBoundingClientRect();
      expect(r.width).toBeGreaterThan(0);
      expect(r.height).toBeGreaterThan(0);
    }
  });

  it('places each submenu to the side of its parent at uhd viewport', async () => {
    await setViewport('uhd');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;top:200px;left:200px;',
      },
    });
    const { level2List, level3List } = await expandToLeaf(user);

    // On a wide screen with the trigger anchored top-left, all submenus must
    // open rightward (no flip back). That's the headline regression case.
    const tooltips = [level2List.closest<HTMLElement>('.neo-tooltip')!, level3List.closest<HTMLElement>('.neo-tooltip')!];
    const triggerRect = getTrigger()!.getBoundingClientRect();
    const cascadeMinLeft = Math.min(...tooltips.map(t => t.getBoundingClientRect().left));
    expect(cascadeMinLeft).toBeGreaterThanOrEqual(triggerRect.left - 1);
  });
});

describe('neoMenu — small-screen forced overlap', { tags: ['browser'] }, () => {
  // On a 390×844 viewport with a 3-level cascade, there isn't room for each
  // submenu to sit beside its parent. The skeleton library's `flip()` does
  // re-place the level-1 tooltip (it opens *upward* when pinned to the bottom)
  // but level-2 / level-3 nested submenus do NOT cascade-flip on the X axis;
  // they open rightward and overflow the viewport. We pin that behavior here
  // so the migration target must reproduce or improve on it — not regress it
  // silently.
  it('level-1 submenu re-places when trigger is bottom-anchored, even if leaves overflow', async () => {
    await setViewport('mobile');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;bottom:0;left:0;',
      },
    });
    const { level2List } = await expandToLeaf(user);

    // Level-1 root menu must stay inside the viewport (it has room).
    const rootList = getVisibleMenuLists()[0];
    const rootTooltip = rootList.closest<HTMLElement>('.neo-tooltip')!;
    const rootRect = rootTooltip.getBoundingClientRect();
    expect(rootRect.left).toBeGreaterThanOrEqual(-1);
    expect(rootRect.right).toBeLessThanOrEqual(window.innerWidth + 1);

    // Level-2 (the first nested cascade) MUST be either inside the viewport
    // or overlap the level-1 menu — never positioned in a totally invisible
    // area off-screen.
    const level2Rect = level2List.closest<HTMLElement>('.neo-tooltip')!.getBoundingClientRect();
    const level2InsideX = level2Rect.right <= window.innerWidth + 1 && level2Rect.left >= -1;
    const overlapsRoot = !(level2Rect.right < rootRect.left || level2Rect.left > rootRect.right);
    expect(level2InsideX || overlapsRoot).toBe(true);
  });

  it('submenu stays offset from parent (shifted, not overlapping) when viewport is constrained', async () => {
    await setViewport('mobile');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;top:50%;left:0;transform:translateY(-50%);',
      },
    });
    const { level2List } = await expandToLeaf(user);

    const rootList = getVisibleMenuLists()[0];
    const rootRect = rootList.closest<HTMLElement>('.neo-tooltip')!.getBoundingClientRect();
    const level2Rect = level2List.closest<HTMLElement>('.neo-tooltip')!.getBoundingClientRect();

    // Submenu must be offset on the cross axis, not stacked on top of root.
    const overlapsRoot = !(level2Rect.right < rootRect.left || level2Rect.left > rootRect.right);
    expect(overlapsRoot, 'submenu should not overlap parent menu').toBe(false);
    // And it must still be inside the viewport.
    expect(level2Rect.right).toBeLessThanOrEqual(window.innerWidth + 1);
    expect(level2Rect.left).toBeGreaterThanOrEqual(-1);
  });

  it('every cascading submenu fits inside the viewport at mobile size', async () => {
    await setViewport('mobile');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;top:0;right:0;',
      },
    });
    await expandToLeaf(user);

    for (const tt of getOpenTooltips()) {
      const r = tt.getBoundingClientRect();
      expect(r.left).toBeGreaterThanOrEqual(-1);
      expect(r.right).toBeLessThanOrEqual(window.innerWidth + 1);
      expect(r.top).toBeGreaterThanOrEqual(-1);
      expect(r.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
    }
  });

  it('cascading submenus stay horizontally offset from their parent (no vertical stacking)', async () => {
    await setViewport('mobile');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const user = userEvent.setup();
    await openMenu({
      items: deepItems,
      openOnHover: true,
      triggerProps: {
        style: 'position:fixed;top:0;right:0;',
      },
    });
    await expandToLeaf(user);

    const tooltips = getOpenTooltips();
    for (let i = 1; i < tooltips.length; i++) {
      const parent = tooltips[i - 1].getBoundingClientRect();
      const child = tooltips[i].getBoundingClientRect();
      const horizontallyDisjoint = child.right <= parent.left + 1 || child.left >= parent.right - 1;
      expect(horizontallyDisjoint, `level-${i} submenu must sit beside its parent, not stack on it`).toBe(true);
    }
  });
});

async function waitForVisualStability(el: HTMLElement, timeoutMs = 1500): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    const cs = getComputedStyle(el);
    const opacity = Number.parseFloat(cs.opacity);
    const transform = cs.transform;
    const stable = opacity >= 0.999 && (transform === 'none' || /matrix\(1,\s*0,\s*0,\s*1/.test(transform));
    if (stable) return;
    await new Promise(r => requestAnimationFrame(() => r(null)));
  }
}

async function openVisualMenu(user: ReturnType<typeof userEvent.setup>): Promise<HTMLElement> {
  const trigger = await vi.waitFor(() => {
    const el = document.querySelector<HTMLButtonElement>('[data-testid="trigger-button"]');
    if (!el) throw new Error('trigger not mounted');
    return el;
  }, { timeout: 1500, interval: 16 });
  await user.click(trigger);
  return vi.waitFor(() => {
    const el = document.querySelector<HTMLElement>('.neo-menu-list');
    const tip = el?.closest<HTMLElement>('.neo-tooltip');
    if (!el || tip?.hasAttribute('hidden')) throw new Error('menu list still hidden');
    return el;
  }, { timeout: 2000, interval: 16 });
}

describe('neoMenu — visual contract (open + cardinal placements)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });
  forEachViewport((viewport) => {
    for (const placement of CARDINAL_PLACEMENTS) {
      it(`open at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        const user = userEvent.setup();
        render(VisualHarness, {
          props: { placement, unmountOnClose: false } as never,
        });
        const list = await openVisualMenu(user);
        await waitForFloatingPosition(list);
        const tooltip = list.closest<HTMLElement>('.neo-tooltip');
        if (tooltip) await waitForVisualStability(tooltip);
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoMenu', `open-${placement}`, viewport),
        );
      });
    }
  });
});

describe('neoMenu — visual contract (nested submenu)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });
  forEachViewport((viewport) => {
    it(`nested submenu open (${viewport})`, async () => {
      await setViewport(viewport);
      const user = userEvent.setup();
      render(VisualHarness, {
        props: { placement: 'bottom-start', nested: 2, unmountOnClose: false, openOnHover: true } as never,
      });
      const list = await openVisualMenu(user);
      await waitForFloatingPosition(list);

      const nestedTrigger = Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-item'))
        .find(el => el.getAttribute('aria-haspopup') === 'menu');
      if (nestedTrigger) {
        const wrapper = nestedTrigger;
        const button = nestedTrigger.querySelector<HTMLElement>('button') ?? nestedTrigger;
        await user.hover(wrapper);
        await user.hover(button);
        await vi.waitFor(() => {
          const visible = Array.from(document.querySelectorAll<HTMLElement>('.neo-menu-list'))
            .filter((l) => {
              const tip = l.closest<HTMLElement>('.neo-tooltip');
              return !tip || !tip.hasAttribute('hidden');
            });
          if (visible.length < 2) throw new Error(`expected ≥2 visible menu lists, got ${visible.length}`);
        }, { timeout: 2000, interval: 16 });
        const tooltips = Array.from(document.querySelectorAll<HTMLElement>('.neo-tooltip')).filter(t => !t.hasAttribute('hidden'));
        for (const tt of tooltips) await waitForVisualStability(tt);
      }
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoMenu', 'nested-submenu', viewport),
      );
    });
  });
});
