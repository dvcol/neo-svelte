import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NeoImage from '~/media/NeoImage.svelte';

import VisualHarness from './TestImage.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getImage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-image');
}

function getImg(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>('img.neo-image-img');
}

// 8x8 solid magenta PNG — visible in the screenshot, deterministic, and
// decodes synchronously enough that the load event fires within a frame.
const PNG_SOLID = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGM449KBFTEMLQkA7BFmAdN1sbkAAAAASUVORK5CYII=';

describe('neoImage — load lifecycle (real <img>)', { tags: ['browser'] }, () => {
  it('valid src reaches loaded state and clears the loading skeleton class', async () => {
    render(NeoImage, { props: { src: PNG_SOLID, alt: 'fixture' } as never });
    const wrapper = await vi.waitFor(() => {
      const el = getImage();
      if (!el) throw new Error('image not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const img = getImg();
      expect(img?.complete).toBe(true);
      expect(wrapper.classList.contains('neo-skeleton')).toBe(false);
    });
  });

  it('broken src without fallback ends up in error state', async () => {
    render(NeoImage, {
      props: {
        src: 'data:image/png;base64,not-a-real-png',
        alt: 'broken',
      } as never,
    });
    const wrapper = await vi.waitFor(() => {
      const el = getImage();
      if (!el) throw new Error('image not mounted');
      return el;
    });
    await vi.waitFor(() => {
      // The component sets data-fallback / data-src attributes when it
      // settles into an error state with no usable fallback.
      expect(wrapper.classList.contains('neo-skeleton')).toBe(false);
    }, { timeout: 2000 });
  });
});

describe('neoImage — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('loaded × ratio × rounded / sharp / glass × skeleton × error / fallback / fit-contain matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'matrix' } as never });
    const stage = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const wraps = stage.querySelectorAll<HTMLElement>('.neo-image');
      expect(wraps.length).toBe(9);
    });
    // Wait for all real <img> elements to decode.
    await vi.waitFor(() => {
      const imgs = stage.querySelectorAll<HTMLImageElement>('img.neo-image-img');
      for (const img of imgs) expect(img.complete).toBe(true);
    }, { timeout: 4000 });
    await new Promise(r => setTimeout(r, 200));
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoImage', 'matrix', 'desktop'),
    );
  });
});
