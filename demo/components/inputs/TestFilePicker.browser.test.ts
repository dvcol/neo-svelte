import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoFilePicker from '~/inputs/NeoFilePicker.svelte';

import VisualHarness from './TestFilePicker.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDropContainer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drop-container');
}

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

function dispatchDrag(target: HTMLElement, type: 'dragenter' | 'dragleave' | 'dragover' | 'drop', files?: File[]) {
  const dataTransfer = new DataTransfer();
  if (files) for (const f of files) dataTransfer.items.add(f);
  const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer });
  target.dispatchEvent(event);
}

describe('neoFilePicker — drop zone state (real DragEvents)', { tags: ['browser'] }, () => {
  it('dragenter toggles the .neo-dragging class on the drop container', async () => {
    render(NeoFilePicker, { props: { multiple: true } as never });
    const drop = await vi.waitFor(() => {
      const el = getDropContainer();
      if (!el) throw new Error('drop container not mounted');
      return el;
    });
    expect(drop.classList.contains('neo-dragging')).toBe(false);
    dispatchDrag(drop, 'dragenter');
    await vi.waitFor(() => {
      expect(drop.classList.contains('neo-dragging')).toBe(true);
    });
  });

  it('dragleave clears the .neo-dragging class', async () => {
    render(NeoFilePicker, { props: { multiple: true } as never });
    const drop = await vi.waitFor(() => {
      const el = getDropContainer();
      if (!el) throw new Error('drop container not mounted');
      return el;
    });
    dispatchDrag(drop, 'dragenter');
    await vi.waitFor(() => {
      expect(drop.classList.contains('neo-dragging')).toBe(true);
    });
    dispatchDrag(drop, 'dragleave');
    await vi.waitFor(() => {
      expect(drop.classList.contains('neo-dragging')).toBe(false);
    });
  });

  it('drop with files populates the underlying input.files (multiple)', async () => {
    let captured: FileList | undefined;
    render(NeoFilePicker, {
      props: {
        multiple: true,
        onchange: (e: Event) => {
          captured = (e.target as HTMLInputElement).files ?? undefined;
        },
      } as never,
    });
    const drop = await vi.waitFor(() => {
      const el = getDropContainer();
      if (!el) throw new Error('drop container not mounted');
      return el;
    });
    const files = [
      new File(['hello'], 'a.txt', { type: 'text/plain' }),
      new File(['world'], 'b.txt', { type: 'text/plain' }),
    ];
    dispatchDrag(drop, 'dragenter');
    dispatchDrag(drop, 'drop', files);
    await vi.waitFor(() => {
      expect(captured).toBeDefined();
      expect(captured!.length).toBe(2);
      expect(captured!.item(0)?.name).toBe('a.txt');
      expect(captured!.item(1)?.name).toBe('b.txt');
    });
    expect(drop.classList.contains('neo-dragging')).toBe(false);
  });

  it('drop with files keeps only the first file when multiple=false', async () => {
    let captured: FileList | undefined;
    render(NeoFilePicker, {
      props: {
        multiple: false,
        onchange: (e: Event) => {
          captured = (e.target as HTMLInputElement).files ?? undefined;
        },
      } as never,
    });
    const drop = await vi.waitFor(() => {
      const el = getDropContainer();
      if (!el) throw new Error('drop container not mounted');
      return el;
    });
    const files = [
      new File(['1'], 'one.txt', { type: 'text/plain' }),
      new File(['2'], 'two.txt', { type: 'text/plain' }),
    ];
    dispatchDrag(drop, 'dragenter');
    dispatchDrag(drop, 'drop', files);
    await vi.waitFor(() => {
      expect(captured).toBeDefined();
      expect(captured!.length).toBe(1);
      expect(captured!.item(0)?.name).toBe('one.txt');
    });
  });
});

describe('neoFilePicker — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle / multiple / disabled × with-files × tinted / glass × required matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'matrix' } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const drops = stage.querySelectorAll<HTMLElement>('.neo-drop-container');
      expect(drops.length).toBe(9);
      for (const d of drops) expect(d.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await new Promise(r => setTimeout(r, 600));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoFilePicker', 'matrix', 'desktop'),
    );
  });
});
