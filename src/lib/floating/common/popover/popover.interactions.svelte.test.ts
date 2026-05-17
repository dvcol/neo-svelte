import type { Interaction } from './popover.types.js';

import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';

import { role } from './interactions/role.svelte.js';
import { Popover } from './popover.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

describe('popover — phase 5 interactions framework', () => {
  describe('factory dispatch + listener composition', () => {
    it('attaches listeners returned by interactions to the reference node', () => {
      const reference = document.createElement('button');
      let clicks = 0;
      const counterInteraction: Interaction = () => ({
        reference: { listeners: { click: () => clicks++ } },
      });
      const { result, teardown } = withRoot(() => new Popover({ interactions: [counterInteraction] }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.click();
      reference.click();
      expect(clicks).toBe(2);
      teardown();
    });

    it('removes interaction listeners on reference detach', () => {
      const reference = document.createElement('button');
      let clicks = 0;
      const counterInteraction: Interaction = () => ({
        reference: { listeners: { click: () => clicks++ } },
      });
      const { result, teardown } = withRoot(() => new Popover({ interactions: [counterInteraction] }));
      flushSync();
      const cleanup = result.reference(reference);
      flushSync();
      reference.click();
      cleanup?.();
      flushSync();
      reference.click();
      expect(clicks).toBe(1);
      teardown();
    });

    it('attaches listeners returned by interactions to the floating node', () => {
      const floating = document.createElement('div');
      let mouseEnters = 0;
      const counterInteraction: Interaction = () => ({
        floating: { listeners: { mouseenter: () => mouseEnters++ } },
      });
      const { result, teardown } = withRoot(() => new Popover({ interactions: [counterInteraction] }));
      flushSync();
      result.floating(floating);
      flushSync();
      floating.dispatchEvent(new Event('mouseenter'));
      expect(mouseEnters).toBe(1);
      teardown();
    });

    it('composes listeners from multiple interactions on the same event', () => {
      const reference = document.createElement('button');
      const calls: string[] = [];
      const a: Interaction = () => ({ reference: { listeners: { click: () => calls.push('a') } } });
      const b: Interaction = () => ({ reference: { listeners: { click: () => calls.push('b') } } });
      const { result, teardown } = withRoot(() => new Popover({ interactions: [a, b] }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.click();
      expect(calls).toEqual(['a', 'b']);
      teardown();
    });

    it('passes a context bag with popover instance and floatingId to each interaction', () => {
      const seen: Array<{ popover: unknown; floatingId: string }> = [];
      const probe: Interaction = (ctx) => {
        seen.push({ popover: ctx.popover, floatingId: ctx.floatingId });
        return {};
      };
      const { result, teardown } = withRoot(() => new Popover({ interactions: [probe] }));
      flushSync();
      expect(seen).toHaveLength(1);
      expect(seen[0].popover).toBe(result);
      expect(seen[0].floatingId).toBe(result.floatingId);
      teardown();
    });

    it('reads the interactions list once (never re-reads on field changes)', () => {
      const reference = document.createElement('button');
      let factoryCalls = 0;
      const probe: Interaction = () => {
        factoryCalls++;
        return {};
      };
      let placement = $state<'top' | 'bottom'>('top');
      const { result, teardown } = withRoot(() => new Popover({
        interactions: [probe],
        get placement() {
          return placement;
        },
      }));
      flushSync();
      expect(factoryCalls).toBe(1);
      result.reference(reference);
      flushSync();
      placement = 'bottom';
      flushSync();
      expect(factoryCalls).toBe(1);
      teardown();
    });
  });

  describe('role() — tooltip ARIA mapping (locked)', () => {
    it('writes role="tooltip" to the floating node when role is tooltip', () => {
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'tooltip' })] }));
      flushSync();
      result.floating(floating);
      flushSync();
      expect(floating.getAttribute('role')).toBe('tooltip');
      teardown();
    });

    it('writes aria-describedby={floatingId} to the reference while open', () => {
      const reference = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'tooltip' })] }));
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe(result.floatingId);
      teardown();
    });

    it('removes aria-describedby when open flips false', () => {
      const reference = document.createElement('button');
      let open = $state(true);
      const { result, teardown } = withRoot(() => new Popover({
        interactions: [role({ role: 'tooltip' })],
        get open() {
          return open;
        },
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe(result.floatingId);
      open = false;
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      teardown();
    });

    it('cleans up role and aria-describedby on detach', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'tooltip' })] }));
      flushSync();
      const refCleanup = result.reference(reference);
      const floatCleanup = result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe(result.floatingId);
      expect(floating.getAttribute('role')).toBe('tooltip');
      refCleanup?.();
      floatCleanup?.();
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      expect(floating.getAttribute('role')).toBeNull();
      teardown();
    });

    it('role() with role=undefined writes nothing', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({})] }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      expect(floating.getAttribute('role')).toBeNull();
      teardown();
    });

    it('role() with enabled=false is a no-op', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover({
        interactions: [role({ role: 'tooltip', enabled: false })],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      expect(floating.getAttribute('role')).toBeNull();
      teardown();
    });

    it('respects a consumer-set role attribute on the floating node', () => {
      const floating = document.createElement('div');
      floating.setAttribute('role', 'consumer-role');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'tooltip' })] }));
      flushSync();
      const cleanup = result.floating(floating);
      flushSync();
      expect(floating.getAttribute('role')).toBe('consumer-role');
      cleanup?.();
      flushSync();
      expect(floating.getAttribute('role')).toBe('consumer-role');
      teardown();
    });

    it('respects a consumer-set aria-describedby on the reference node', () => {
      const reference = document.createElement('button');
      reference.setAttribute('aria-describedby', 'consumer-id');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'tooltip' })] }));
      flushSync();
      const cleanup = result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe('consumer-id');
      cleanup?.();
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe('consumer-id');
      teardown();
    });
  });

  describe('onOpenChange dispatch — lifecycle hook', () => {
    it('fires synchronously on real open transitions only', () => {
      const calls: Array<{ open: boolean }> = [];
      const probe: Interaction = () => ({
        onOpenChange: (open) => {
          calls.push({ open });
        },
      });
      let open = $state(false);
      const { teardown } = withRoot(() => new Popover({
        interactions: [probe],
        get open() {
          return open;
        },
      }));
      flushSync();
      expect(calls).toEqual([]);
      open = true;
      flushSync();
      expect(calls).toEqual([{ open: true }]);
      open = false;
      flushSync();
      expect(calls).toEqual([{ open: true }, { open: false }]);
      teardown();
    });

    it('does not re-dispatch on equal-value writes', () => {
      let dispatches = 0;
      const probe: Interaction = () => ({
        onOpenChange: () => {
          dispatches++;
        },
      });
      let open = $state(true);
      const { teardown } = withRoot(() => new Popover({
        interactions: [probe],
        get open() {
          return open;
        },
      }));
      flushSync();
      expect(dispatches).toBe(1);
      open = true;
      flushSync();
      expect(dispatches).toBe(1);
      teardown();
    });

    it('invokes returned cleanup on the matching close transition', () => {
      let cleanupCalls = 0;
      const probe: Interaction = () => ({
        onOpenChange: (open) => {
          if (open) return () => cleanupCalls++;
        },
      });
      let open = $state(false);
      const { teardown } = withRoot(() => new Popover({
        interactions: [probe],
        get open() {
          return open;
        },
      }));
      flushSync();
      open = true;
      flushSync();
      expect(cleanupCalls).toBe(0);
      open = false;
      flushSync();
      expect(cleanupCalls).toBe(1);
      open = true;
      flushSync();
      open = false;
      flushSync();
      expect(cleanupCalls).toBe(2);
      teardown();
    });

    it('disposes interaction lifecycle when the constructing root disposes', () => {
      const calls: boolean[] = [];
      const probe: Interaction = () => ({
        onOpenChange: (open) => {
          calls.push(open);
        },
      });
      let open = $state(true);
      const { teardown } = withRoot(() => new Popover({
        interactions: [probe],
        get open() {
          return open;
        },
      }));
      flushSync();
      expect(calls).toEqual([true]);
      teardown();
      open = false;
      flushSync();
      expect(calls).toEqual([true]);
    });
  });

  describe('role() — non-tooltip role mapping (parity)', () => {
    it('dialog: floating gets role="dialog", reference gets aria-expanded + aria-controls', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'dialog' })] }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(floating.getAttribute('role')).toBe('dialog');
      expect(reference.getAttribute('aria-expanded')).toBe('true');
      expect(reference.getAttribute('aria-controls')).toBe(result.floatingId);
      expect(reference.getAttribute('aria-haspopup')).toBe('dialog');
      teardown();
    });

    it('menu: maps aria-haspopup to "menu"', () => {
      const reference = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'menu' })] }));
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-haspopup')).toBe('menu');
      teardown();
    });

    it('listbox: maps aria-haspopup to "listbox"', () => {
      const reference = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'listbox' })] }));
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-haspopup')).toBe('listbox');
      teardown();
    });

    it('alertdialog: aria-haspopup falls back to "dialog" (parity with skeleton)', () => {
      const reference = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover({ interactions: [role({ role: 'alertdialog' })] }));
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-haspopup')).toBe('dialog');
      teardown();
    });
  });
});
