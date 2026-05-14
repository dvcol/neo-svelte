import { describe, expect, it, vi } from 'vitest';

import { NeoMenuContext } from './neo-menu-context.svelte.js';

describe('neoMenuContext', () => {
  it('reflects parent.open and aggregates children open in `parent`', () => {
    const root = $effect.root(() => {
      let parentOpen = false;
      const ctx = new NeoMenuContext({
        get open() {
          return parentOpen;
        },
        get ref() {
          return undefined;
        },
        dismiss: () => {},
      });
      expect(ctx.parent).toBe(false);
      expect(ctx.children).toBe(false);
      parentOpen = true;
      expect(ctx.parent).toBe(true);
      parentOpen = false;
      ctx.toggle(0, true);
      expect(ctx.children).toBe(true);
      expect(ctx.parent).toBe(true);
      ctx.toggle(0, false);
      expect(ctx.children).toBe(false);
      expect(ctx.parent).toBe(false);
    });
    root();
  });

  it('toggle is idempotent and tracks per-index state', () => {
    $effect.root(() => {
      const ctx = new NeoMenuContext({
        get open() {
          return false;
        },
        get ref() {
          return undefined;
        },
        dismiss: () => {},
      });
      ctx.toggle(0, true);
      ctx.toggle(0, true);
      ctx.toggle(1, true);
      expect(ctx.children).toBe(true);
      ctx.toggle(0, false);
      expect(ctx.children).toBe(true);
      ctx.toggle(1, false);
      expect(ctx.children).toBe(false);
    })();
  });

  it('dismiss delegates to parent.dismiss', async () => {
    const dismiss = vi.fn();
    const ctx = new NeoMenuContext({
      get open() {
        return false;
      },
      get ref() {
        return undefined;
      },
      dismiss,
    });
    await ctx.dismiss();
    expect(dismiss).toHaveBeenCalledTimes(1);
  });
});
