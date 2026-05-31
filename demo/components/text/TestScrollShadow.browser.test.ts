import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestScrollShadow.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getShadow(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-scroll-shadow');
}

const POSITIONS = [
  { variant: 'top', label: 'top edge — only bottom shadow visible' },
  { variant: 'middle', label: 'middle — top + bottom shadows visible' },
  { variant: 'bottom', label: 'bottom edge — only top shadow visible' },
] as const;

describe('neoScrollShadow — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES.flatMap(v => POSITIONS.map(p => [v, p] as const)))(
    'matrix (%s, %s)',
    async (viewport: ViewportName, position: typeof POSITIONS[number]) => {
      await setViewport(viewport);
      render(VisualHarness, { props: { variant: position.variant } as never });
      const shadow = await vi.waitFor(() => {
        const el = getShadow();
        if (!el) throw new Error('shadow not mounted');
        return el;
      });
      await waitForVisualStability(shadow);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoScrollShadow', `matrix-${position.variant}`, viewport),
      );
    },
  );
});
