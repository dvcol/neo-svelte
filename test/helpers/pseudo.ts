import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

/**
 * Run the standard pseudo-state grid for a component: idle/hover/focus-within
 * snapshots taken at desktop. Each test mounts the harness fresh.
 *
 * `harness` must render a `[data-testid="visual-stage"]` wrapping a
 * `[data-testid="target"]` cell that is hoverable + tabbable. Hover/focus
 * targets are resolved via `hoverSelector` / `focusSelector` options if the
 * data-testid lands on a non-interactive ancestor.
 */
export interface PseudoGridOptions {
  /** Component name (PascalCase) used in screenshotName. */
  component: string;
  /** Harness Svelte component. */
  harness: unknown;
  /** Optional CSS selector for the element to hover. Defaults to [data-testid="target"]. */
  hoverSelector?: string;
  /** Optional CSS selector for the element to focus (for :focus-within tests). Defaults to a tabindex applied to the target. */
  focusSelector?: string;
  /** Skip the focus-within test (e.g. for components without :focus-within rules). */
  skipFocusWithin?: boolean;
  /** Number of describe-level userEvent.tab() calls to land on the target for focus-visible. If 0, falls back to focus-within only. */
  tabCount?: number;
}

export function describePseudoGrid({
  component,
  harness,
  hoverSelector = '[data-testid="target"]',
  focusSelector,
  skipFocusWithin = false,
  tabCount = 0,
}: PseudoGridOptions): void {
  describe(`${component} — real CSS pseudo states (themed)`, { tags: ['browser', 'visual'] }, () => {
    beforeEach(() => {
      quietForVisual();
    });
    afterEach(() => {
      cleanup();
    });

    function getStage(): HTMLElement {
      const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
      if (!el) throw new Error('stage not mounted');
      return el;
    }

    function getEl(selector: string): HTMLElement {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) throw new Error(`${selector} not mounted`);
      return el;
    }

    it('idle baseline grid (desktop)', async () => {
      await setViewport('desktop');
      render(harness as never, { props: {} as never });
      const stage = await vi.waitFor(getStage);
      await waitForVisualStability(stage);
      await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
        screenshotName(component, 'pseudo-idle', 'desktop'),
      );
    });

    it('hover (desktop)', async () => {
      await setViewport('desktop');
      render(harness as never, { props: {} as never });
      const stage = await vi.waitFor(getStage);
      const target = await vi.waitFor(() => getEl(hoverSelector));
      await userEvent.hover(target);
      await waitForVisualStability(stage);
      await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
        screenshotName(component, 'pseudo-hover', 'desktop'),
      );
    });

    if (!skipFocusWithin) {
      it('focus-within (desktop)', async () => {
        await setViewport('desktop');
        render(harness as never, { props: {} as never });
        const stage = await vi.waitFor(getStage);
        const target = await vi.waitFor(() => getEl('[data-testid="target"]'));
        if (focusSelector) {
          const focusable = target.querySelector<HTMLElement>(focusSelector)
            ?? document.querySelector<HTMLElement>(focusSelector);
          expect(focusable, `focus selector ${focusSelector} resolved nothing`).toBeTruthy();
          focusable!.focus({ preventScroll: true });
        }
        else {
          target.setAttribute('tabindex', '0');
          target.focus({ preventScroll: true });
        }
        await waitForVisualStability(stage);
        await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
          screenshotName(component, 'pseudo-focus-within', 'desktop'),
        );
      });
    }

    if (tabCount > 0) {
      it('focus-visible — keyboard tab (desktop)', async () => {
        await setViewport('desktop');
        render(harness as never, { props: {} as never });
        const stage = await vi.waitFor(getStage);
        await vi.waitFor(() => getEl('[data-testid="target"]'));
        for (let i = 0; i < tabCount; i++) await userEvent.tab();
        await waitForVisualStability(stage);
        await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
          screenshotName(component, 'pseudo-focus-visible', 'desktop'),
        );
      });
    }
  });
}

