import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoPin from '~/inputs/NeoPin.svelte';

import VisualHarness from './TestPin.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getCells(): HTMLInputElement[] {
  return Array.from(document.querySelectorAll<HTMLInputElement>('input.neo-input-pin'));
}

describe('neoPin — autoadvance & retreat (real focus)', { tags: ['browser'] }, () => {
  it('typing a character into a cell advances real focus to the next cell', async () => {
    const user = userEvent.setup();
    render(NeoPin, { props: { count: 4, type: 'text' } as never });
    const cells = await vi.waitFor(() => {
      const list = getCells();
      if (list.length !== 4) throw new Error('cells not mounted');
      return list;
    });
    cells[0].focus();
    expect(document.activeElement).toBe(cells[0]);
    await user.keyboard('a');
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(cells[1]);
    });
    await user.keyboard('b');
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(cells[2]);
    });
  });

  it('backspace on an empty cell retreats focus to the previous cell and clears it', async () => {
    const user = userEvent.setup();
    render(NeoPin, { props: { count: 4, type: 'text' } as never });
    const cells = await vi.waitFor(() => {
      const list = getCells();
      if (list.length !== 4) throw new Error('cells not mounted');
      return list;
    });
    cells[0].focus();
    await user.keyboard('ab');
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(cells[2]);
    });
    // First backspace clears cell 1 (current cell is empty → retreat)
    await user.keyboard('{Backspace}');
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(cells[1]);
      expect(cells[1].value).toBe('');
    });
  });

  it('arrowLeft / ArrowRight move focus across cells', async () => {
    const user = userEvent.setup();
    render(NeoPin, { props: { count: 4, type: 'text' } as never });
    const cells = await vi.waitFor(() => {
      const list = getCells();
      if (list.length !== 4) throw new Error('cells not mounted');
      return list;
    });
    cells[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(cells[1]);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(cells[2]);
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(cells[1]);
  });
});

describe('neoPin — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  const SCENARIOS = [
    { name: 'empty-4', props: { count: 4, type: 'text' } },
    { name: 'grouped-2x3', props: { count: 3, groups: 2, type: 'text' } },
  ] as const;

  it.each(VIEWPORT_NAMES.flatMap(v => SCENARIOS.map(s => [v, s] as const)))(
    '%s (%s)',
    async (viewport: ViewportName, scenario: typeof SCENARIOS[number]) => {
      await setViewport(viewport);
      render(VisualHarness, { props: scenario.props as never });
      const wrapper = await vi.waitFor(() => {
        const el = document.querySelector<HTMLElement>('.neo-pin-group-wrapper');
        if (!el) throw new Error('pin not mounted');
        return el;
      });
      await waitForVisualStability(wrapper);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoPin', scenario.name, viewport),
      );
    },
  );
});
