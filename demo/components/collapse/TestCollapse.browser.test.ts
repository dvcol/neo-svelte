import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from '~/collapse/NeoCollapse.test.svelte';

import VisualHarness from './TestCollapse.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getCollapse(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-collapse');
}

function getContent(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-collapse-content');
}

function getTrigger(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('.neo-collapse-trigger');
}

describe('neoCollapse — open transition (real animation)', { tags: ['browser'] }, () => {
  it('clicking the trigger expands the content region to its natural height', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { label: 'Title', open: false, unmountOnClose: false } as never });
    const trigger = await vi.waitFor(() => {
      const el = getTrigger();
      if (!el) throw new Error('trigger not mounted');
      return el;
    });
    expect(getContent()?.getAttribute('aria-hidden')).toBe('true');
    await user.click(trigger);
    // After the height transition (300ms by default) the content should be expanded.
    await vi.waitFor(() => {
      const content = getContent();
      expect(content?.getAttribute('aria-hidden')).toBe('false');
      expect((content?.getBoundingClientRect().height ?? 0)).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  it('closing collapses the content region back to zero height', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { label: 'Title', open: true, unmountOnClose: false } as never });
    const trigger = await vi.waitFor(() => {
      const el = getTrigger();
      if (!el) throw new Error('trigger not mounted');
      return el;
    });
    await vi.waitFor(() => {
      expect((getContent()?.getBoundingClientRect().height ?? 0)).toBeGreaterThan(0);
    });
    await user.click(trigger);
    // unmountOnClose=false keeps the node in DOM but transition out should drive height to 0.
    await vi.waitFor(() => {
      const content = getContent();
      expect(content?.getAttribute('aria-hidden')).toBe('true');
    }, { timeout: 1000 });
  });
});

describe('neoCollapse — keyboard activation (real focus-visible)', { tags: ['browser'] }, () => {
  it('enter on a focused trigger toggles open', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { label: 'Title', open: false, unmountOnClose: false } as never });
    const trigger = await vi.waitFor(() => {
      const el = getTrigger();
      if (!el) throw new Error('trigger not mounted');
      return el;
    });
    trigger.focus();
    await user.keyboard('{Enter}');
    await vi.waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('space on a focused trigger toggles open', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { label: 'Title', open: false, unmountOnClose: false } as never });
    const trigger = await vi.waitFor(() => {
      const el = getTrigger();
      if (!el) throw new Error('trigger not mounted');
      return el;
    });
    trigger.focus();
    await user.keyboard(' ');
    await vi.waitFor(() => {
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('disabled trigger ignores keyboard activation', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { label: 'Title', open: false, disabled: true, unmountOnClose: false } as never });
    const trigger = await vi.waitFor(() => {
      const el = getTrigger();
      if (!el) throw new Error('trigger not mounted');
      return el;
    });
    trigger.focus();
    await user.keyboard('{Enter}');
    await new Promise(r => setTimeout(r, 50));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('neoCollapse — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  for (const state of ['closed', 'open'] as const) {
    it(`${state} (desktop)`, async () => {
      await setViewport('desktop');
      render(VisualHarness, {
        props: {
          open: state === 'open',
          unmountOnClose: false,
          label: 'Section title',
          bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        } as never,
      });
      const collapse = await vi.waitFor(() => {
        const el = getCollapse();
        if (!el) throw new Error('collapse not mounted');
        return el;
      });
      await waitForVisualStability(collapse);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoCollapse', state, 'desktop'),
      );
    });
  }
});
