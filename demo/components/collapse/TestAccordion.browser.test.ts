import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import GroupHarness from '~/collapse/NeoCollapseGroup.test.svelte';

import VisualHarness from './TestAccordion.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const sections = [
  { id: 's1', label: 'Section one' },
  { id: 's2', label: 'Section two' },
  { id: 's3', label: 'Section three' },
];

function getTriggers(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.neo-collapse-trigger'));
}

function expanded(id: string): boolean {
  return document.querySelector(`[aria-controls="${id}"]`)?.getAttribute('aria-expanded') === 'true';
}

describe('neoAccordion / NeoCollapseGroup — single-vs-multi expansion (real layout)', { tags: ['browser'] }, () => {
  it('default group allows multiple sections to be open simultaneously', async () => {
    const user = userEvent.setup();
    render(GroupHarness, { props: { sections } as never });
    await vi.waitFor(() => {
      expect(getTriggers().length).toBe(3);
    });
    await user.click(getTriggers()[0]);
    await user.click(getTriggers()[1]);
    await vi.waitFor(() => {
      expect(expanded('s1')).toBe(true);
      expect(expanded('s2')).toBe(true);
    });
  });

  it('max=1 enforces single-open: opening a new section closes the previously open one', async () => {
    const user = userEvent.setup();
    render(GroupHarness, { props: { sections, max: 1 } as never });
    await vi.waitFor(() => {
      expect(getTriggers().length).toBe(3);
    });
    await user.click(getTriggers()[0]);
    await vi.waitFor(() => expect(expanded('s1')).toBe(true));
    await user.click(getTriggers()[2]);
    await vi.waitFor(() => {
      expect(expanded('s1')).toBe(false);
      expect(expanded('s3')).toBe(true);
    });
  });

  it('min=1 prevents closing the last open section', async () => {
    const user = userEvent.setup();
    const initial = [
      { id: 's1', label: 'One', open: true },
      { id: 's2', label: 'Two' },
    ];
    render(GroupHarness, { props: { sections: initial, min: 1 } as never });
    await vi.waitFor(() => {
      expect(getTriggers().length).toBe(2);
    });
    await user.click(getTriggers()[0]);
    await new Promise(r => setTimeout(r, 100));
    expect(expanded('s1')).toBe(true);
  });
});

describe('neoAccordion — keyboard traversal (real focus)', { tags: ['browser'] }, () => {
  it('tab cycles focus through every accordion trigger in document order', async () => {
    const user = userEvent.setup();
    render(GroupHarness, { props: { sections } as never });
    await vi.waitFor(() => {
      expect(getTriggers().length).toBe(3);
    });
    const triggers = getTriggers();
    triggers[0].focus();
    expect(document.activeElement).toBe(triggers[0]);
    await user.tab();
    expect(document.activeElement).toBe(triggers[1]);
    await user.tab();
    expect(document.activeElement).toBe(triggers[2]);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(triggers[1]);
  });
});

describe('neoAccordion — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('three sections, second one expanded (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, {
      props: {
        sections: [
          { id: 'v1', label: 'First section' },
          { id: 'v2', label: 'Second section', open: true },
          { id: 'v3', label: 'Third section' },
        ],
        rounded: true,
        elevation: 1,
      } as never,
    });
    const accordion = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-accordion');
      if (!el) throw new Error('accordion not mounted');
      return el;
    });
    const openContent = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-collapse[data-open="true"] .neo-collapse-content');
      if (!el) throw new Error('open content not mounted');
      return el;
    });
    await waitForVisualStability(openContent);
    await waitForVisualStability(accordion);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoAccordion', 'three-sections-second-open', 'desktop'),
    );
  });
});
