import { forEachViewport } from 'test/helpers/floating-visual.js';
import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Harness from '~/floating/dialog/NeoDialog.test.svelte';

import VisualHarness from './TestDialog.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

function getBackdrop(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog-backdrop');
}

async function renderOpen(extra: Record<string, unknown> = {}) {
  const result = render(Harness, { props: { open: true, ...extra } as never });
  const dialog = await vi.waitFor(() => {
    const el = getDialog();
    if (!el) throw new Error('dialog not mounted');
    return el;
  }, { timeout: 1000, interval: 16 });
  return { ...result, dialog };
}

const NON_NATIVE_MODAL = { tag: 'div' as const, modal: true, unmountOnClose: false };

describe('neoDialog — modal × backdrop matrix (non-native)', { tags: ['browser'] }, () => {
  it('renders the backdrop when modal=true and backdrop=true (non-native)', async () => {
    await renderOpen({ ...NON_NATIVE_MODAL, backdrop: true });
    const backdrop = getBackdrop();
    expect(backdrop).not.toBeNull();
    expect(backdrop?.classList.contains('neo-hidden')).toBe(false);
  });

  it('hides the backdrop with neo-hidden when modal=true and backdrop=false', async () => {
    await renderOpen({ ...NON_NATIVE_MODAL, backdrop: false });
    const backdrop = getBackdrop();
    expect(backdrop).not.toBeNull();
    expect(backdrop?.classList.contains('neo-hidden')).toBe(true);
  });

  it('does not render a backdrop at all when modal=false (non-native)', async () => {
    await renderOpen({ tag: 'div', modal: false, backdrop: true, unmountOnClose: false });
    expect(getBackdrop()).toBeNull();
  });

  it.each([true, false])('persists the backdrop class when reopened with backdrop=%s', async (backdrop) => {
    const { rerender } = await renderOpen({ ...NON_NATIVE_MODAL, backdrop });
    await rerender({ ...NON_NATIVE_MODAL, open: false, backdrop } as never);
    await vi.waitFor(() => {
      expect(getBackdrop()).toBeNull();
    });
    await rerender({ ...NON_NATIVE_MODAL, open: true, backdrop } as never);
    await vi.waitFor(() => {
      const el = getBackdrop();
      expect(el).not.toBeNull();
      expect(el?.classList.contains('neo-hidden')).toBe(!backdrop);
    });
  });
});

describe('neoDialog — placement (real layout, non-native modal)', { tags: ['browser'] }, () => {
  it.each(['top', 'bottom', 'left', 'right', 'center'] as const)(
    'data-placement="%s" reflects on the dialog element',
    async (placement) => {
      const { dialog } = await renderOpen({ ...NON_NATIVE_MODAL, placement });
      expect(dialog.getAttribute('data-placement')).toBe(placement);
    },
  );

  it('center placement positions the dialog within the visible viewport', async () => {
    await setViewport('desktop');
    const { dialog } = await renderOpen({ ...NON_NATIVE_MODAL, placement: 'center', width: '320px', height: '160px' });
    const rect = dialog.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBeGreaterThan(0);
    // Dialog must lie inside the viewport.
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.top).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
  });
});

describe('neoDialog — close interactions (real pointer / keyboard)', { tags: ['browser'] }, () => {
  it('escape closes a non-native modal when closeOnClickOutside=true', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ ...NON_NATIVE_MODAL, closeOnClickOutside: true, oncancel });
    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(getDialog()?.getAttribute('data-open')).toBe('false');
    });
    expect(oncancel).toHaveBeenCalled();
  });

  // TODO: NeoDialog.svelte:152-155 (`onWindowKeydown`) closes the non-native
  // dialog on Escape regardless of `closedby`. Native <dialog> respects
  // closedby="none" via the platform implementation, but the custom path used
  // when tag !== 'dialog' should mirror that contract — Escape must be a no-op.
  // Pinning expected behavior; unskip after fix.
  it.skip('escape does not close when closedby="none" (non-native, modal)', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ ...NON_NATIVE_MODAL, closedby: 'none', oncancel });
    await user.keyboard('{Escape}');
    await new Promise(r => setTimeout(r, 50));
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    expect(oncancel).not.toHaveBeenCalled();
  });

  it('pointerdown outside closes a non-native modal when closeOnClickOutside=true', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ ...NON_NATIVE_MODAL, closeOnClickOutside: true, oncancel });
    // Click on the document body, well outside any dialog content.
    await user.pointer({ keys: '[MouseLeft]', target: document.body, coords: { x: 1, y: 1 } });
    await vi.waitFor(() => {
      expect(getDialog()?.getAttribute('data-open')).toBe('false');
    });
    expect(oncancel).toHaveBeenCalled();
  });

  it('pointerdown outside is ignored when closeOnClickOutside=false', async () => {
    const user = userEvent.setup();
    const oncancel = vi.fn();
    await renderOpen({ ...NON_NATIVE_MODAL, closeOnClickOutside: false, oncancel });
    await user.pointer({ keys: '[MouseLeft]', target: document.body, coords: { x: 1, y: 1 } });
    await new Promise(r => setTimeout(r, 50));
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    expect(oncancel).not.toHaveBeenCalled();
  });
});

describe('neoDialog — focus management (non-native modal, real focus)', { tags: ['browser'] }, () => {
  it('moves focus into the dialog when opened', async () => {
    const { dialog } = await renderOpen({ ...NON_NATIVE_MODAL });
    await vi.waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    }, { timeout: 500 });
  });

  it('traps focus inside the dialog when modal=true (focusin outside is intercepted)', async () => {
    // Spawn an external button to compete for focus.
    const external = document.createElement('button');
    external.type = 'button';
    external.textContent = 'outside';
    external.setAttribute('data-testid', 'outside-button');
    document.body.appendChild(external);

    try {
      const { dialog } = await renderOpen({ ...NON_NATIVE_MODAL });
      await vi.waitFor(() => {
        expect(dialog.contains(document.activeElement)).toBe(true);
      });

      // Programmatic focus — triggers the focusin trap.
      external.focus();
      await vi.waitFor(() => {
        // Focus is debounced (100ms) back into the dialog.
        expect(dialog.contains(document.activeElement)).toBe(true);
      }, { timeout: 500 });
    } finally {
      external.remove();
    }
  });

  it('does not trap focus when modal=false (focusin outside is allowed)', async () => {
    const external = document.createElement('button');
    external.type = 'button';
    external.textContent = 'outside';
    document.body.appendChild(external);
    try {
      await renderOpen({ tag: 'div', modal: false, unmountOnClose: false });
      external.focus();
      await new Promise(r => setTimeout(r, 200));
      expect(document.activeElement).toBe(external);
    } finally {
      external.remove();
    }
  });
});

describe('neoDialog — native <dialog> integration', { tags: ['browser'] }, () => {
  it('open=true on a native dialog with modal=true calls showModal() and matches :modal', async () => {
    let captured: HTMLDialogElement | undefined;
    render(Harness, {
      props: {
        open: true,
        unmountOnClose: false,
        modal: true,
        onRef: (r: unknown) => {
          captured = r as HTMLDialogElement;
        },
      } as never,
    });
    await vi.waitFor(() => {
      if (!captured) throw new Error('ref not captured');
      expect(captured.tagName.toLowerCase()).toBe('dialog');
      expect(captured.open).toBe(true);
    }, { timeout: 1000, interval: 16 });
    expect(captured!.matches(':modal')).toBe(true);

    captured!.close('chosen');
    await vi.waitFor(() => {
      expect(captured!.open).toBe(false);
    });
    expect(captured!.returnValue).toBe('chosen');
  });

  it('open=true on a native dialog with modal=false calls show() (non-modal)', async () => {
    let captured: HTMLDialogElement | undefined;
    render(Harness, {
      props: {
        open: true,
        unmountOnClose: false,
        modal: false,
        onRef: (r: unknown) => {
          captured = r as HTMLDialogElement;
        },
      } as never,
    });
    await vi.waitFor(() => {
      if (!captured) throw new Error('ref not captured');
      expect(captured.open).toBe(true);
      // show() (non-modal) should NOT match :modal.
      expect(captured.matches(':modal')).toBe(false);
    });
  });
});

describe('neoDialog — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  forEachViewport((viewport) => {
    for (const placement of ['center', 'top', 'bottom', 'left', 'right'] as const) {
      it(`open at ${placement} (${viewport})`, async () => {
        await setViewport(viewport);
        render(VisualHarness, {
          props: {
            open: true,
            tag: 'div',
            modal: true,
            // unmountOnClose:true keeps the JS transition path (in:inFn) so
            // the dialog actually fades/slides to opacity 1; the CSS-only
            // [open]-gated path used when unmountOnClose:false never fires
            // on a non-native <div>, leaving the screenshot blank.
            unmountOnClose: true,
            placement,
            backdrop: true,
            rounded: true,
            // Without an explicit elevation, NeoDialog.svelte renders the
            // "backdrop carries the surface" mode (selector at NeoDialog.svelte:514
            // strips background/border/backdrop-filter when data-elevation is unset),
            // leaving an unstyled dialog. Pin a real elevation so the visual
            // contract reflects the elevated-card variant.
            elevation: 2,
            width: '320px',
            height: '180px',
            bodyText: `Dialog @ ${placement}`,
          } as never,
        });
        const dialog = await vi.waitFor(() => {
          const el = getDialog();
          if (!el) throw new Error('dialog not mounted');
          return el;
        });
        await waitForVisualStability(dialog);
        // Sanity check: dialog must be visible before snapshotting.
        await vi.waitFor(() => {
          const cs = getComputedStyle(dialog);
          expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
          expect(dialog.getBoundingClientRect().width).toBeGreaterThan(0);
        });
        // Freeze any SMIL animations (e.g. close-button icons, status icons)
        // so the snapshot is deterministic.
        freezeSvgAnimations(dialog);
        await waitForVisualStability(dialog);
        await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
          screenshotName('NeoDialog', `open-${placement}`, viewport),
        );
      });
    }
  });
});
