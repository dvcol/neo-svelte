import { quietForVisual, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestNeoThemeProviderCascade.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.hostile-target');
}

describe('neoThemeProvider — cascade-layers contract', { tags: ['browser'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('emits @layer order as the first non-@property rule of the adopted stylesheet', async () => {
    /*
      Library contract: the provider's adopted stylesheet declares
      `@layer neo-reset, neo-theme, neo-components, neo-variants, neo-states;`
      before any layer-bearing rule. Consumers can rely on this ordering
      to interleave their own layers between the library's. Component
      sheets resolve their layer membership against this declaration.
    */
    render(VisualHarness, { props: { mode: 'unlayered' } as never });
    const stage = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await waitForVisualStability(stage);

    const sheets = Array.from(document.adoptedStyleSheets);
    expect(sheets.length).toBeGreaterThan(0);
    const providerSheet = sheets.find((s) => {
      const rules = Array.from(s.cssRules ?? []);
      return rules.some(r => r instanceof CSSLayerStatementRule);
    });
    expect(providerSheet, 'no adopted sheet contains a @layer statement').toBeDefined();
    const providerRules = Array.from(providerSheet!.cssRules);
    const firstNonProperty = providerRules.find(r => !(r instanceof CSSPropertyRule));
    expect(firstNonProperty).toBeInstanceOf(CSSLayerStatementRule);
    expect((firstNonProperty as CSSLayerStatementRule).cssText).toBe(
      '@layer neo-reset, neo-theme, neo-components, neo-variants, neo-states;',
    );
  });

  it('unlayered consumer rule wins over the library @layer neo-components rule', async () => {
    /*
      Hostile-consumer scenario (b): user writes a plain unlayered selector
      that overrides a library style. Per CSS cascade rules, unlayered
      declarations beat any layered declaration regardless of specificity.
      The button's background must be the hostile magenta the harness sets.
    */
    render(VisualHarness, { props: { mode: 'unlayered' } as never });
    const button = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('button not mounted');
      return el;
    });
    await waitForVisualStability(button);
    const cs = window.getComputedStyle(button);
    expect(cs.backgroundColor).toBe('rgb(255, 0, 255)');
  });

  it('layered consumer interleaved between neo-components and neo-variants overrides component styles', async () => {
    /*
      Hostile-consumer scenario (c): user declares
      `@layer neo-reset, neo-theme, neo-components, app-overrides, neo-variants, neo-states;`
      and adds a rule in `app-overrides`. That rule must win over the
      library's `neo-components` layer but lose to `neo-variants` and
      higher. Here the hostile rule sets background to green; nothing in
      neo-variants competes for `background-color` on `.neo-button`, so
      green should win.
    */
    render(VisualHarness, { props: { mode: 'layered' } as never });
    const button = await vi.waitFor(() => {
      const el = getButton();
      if (!el) throw new Error('button not mounted');
      return el;
    });
    await waitForVisualStability(button);
    const cs = window.getComputedStyle(button);
    expect(cs.backgroundColor).toBe('rgb(0, 200, 0)');
  });

  it('renders without provider — component CSS still loads, no console errors from missing context', async () => {
    /*
      Hostile-consumer scenario (d): user renders a library component
      without `<NeoThemeProvider>`. The component should still mount and
      render legibly (component-scoped CSS is in the document via Svelte's
      style tag, not the provider's adopted sheet). Theme tokens (CSS
      custom properties) will be missing — that's expected — but the
      component must not throw or emit a console error.
    */
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      consoleErrors.push(args.map(String).join(' '));
    };
    try {
      render(VisualHarness, { props: { mode: 'no-provider' } as never });
      const button = await vi.waitFor(() => {
        const el = getButton();
        if (!el) throw new Error('button not mounted');
        return el;
      });
      await waitForVisualStability(button);
      // Layout should still resolve (component CSS is loaded via Svelte's
      // injected <style> tag regardless of provider mount).
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    } finally {
      console.error = originalError;
    }
    expect(consoleErrors, `unexpected console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });
});
