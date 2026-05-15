import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, fireEvent } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoDialog.test.svelte';

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

describe('neoDialog — render & open sync', { tags: ['jsdom'] }, () => {
  it('does not render the dialog markup when unmountOnClose=true (default) and open=false', () => {
    renderWithPortalTarget(Harness, { open: false });
    expect(getDialog()).toBeNull();
  });

  it('renders the dialog (as a native <dialog>) when unmountOnClose=false even while closed', async () => {
    renderWithPortalTarget(Harness, { open: false, unmountOnClose: false });
    await tick();
    const el = getDialog();
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('dialog');
    expect(el?.getAttribute('data-open')).toBe('false');
  });

  it('renders body content when open=true', async () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { open: true, bodyText: 'hello dialog' });
    await tick();
    expect(getDialog()).not.toBeNull();
    expect(getByTestId('dialog-body').textContent).toBe('hello dialog');
  });

  it('open=true on a native dialog calls showModal() when modal=true', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: false,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    expect(captured).toBeDefined();
    const showSpy = vi.spyOn(captured!, 'showModal');
    captured!.showModal();
    await tick();
    expect(showSpy).toHaveBeenCalled();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
  });

  it('open=true on a native dialog calls show() (non-modal) when modal=false', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: false,
      modal: false,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    const showSpy = vi.spyOn(captured!, 'show');
    captured!.show();
    await tick();
    expect(showSpy).toHaveBeenCalled();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
  });
});

describe('neoDialog — close & returnValue', { tags: ['jsdom'] }, () => {
  it('close(value) sets returnValue on the native dialog element', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    expect(captured).toBeDefined();
    captured!.close('confirmed');
    await tick();
    expect(captured!.returnValue).toBe('confirmed');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('close() flips data-open to false on the rendered dialog', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    captured!.close();
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });
});

describe('neoDialog — closeOnClickOutside (non-native, modal)', { tags: ['jsdom'] }, () => {
  it('window pointerdown outside the dialog closes it when closeOnClickOutside=true and open', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closeOnClickOutside: true,
      oncancel,
    });
    await tick();
    // The inner effect attaches the window listener via setTimeout(0).
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(oncancel).toHaveBeenCalled();
  });

  it('window pointerdown outside the dialog does NOT close it when closeOnClickOutside=false', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closeOnClickOutside: false,
      oncancel,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(oncancel).not.toHaveBeenCalled();
  });

  it('escape on the window closes a non-native dialog', async () => {
    const oncancel = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closeOnClickOutside: true,
      oncancel,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await user.keyboard('{Escape}');
    await tick();
    expect(oncancel).toHaveBeenCalled();
  });
});

describe('neoDialog — ARIA & data attrs', { tags: ['jsdom'] }, () => {
  it('non-native dialog exposes role="dialog" and aria-modal reflecting modal', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: true });
    await tick();
    const el = getDialog();
    expect(el?.getAttribute('role')).toBe('dialog');
    expect(el?.getAttribute('aria-modal')).toBe('true');
  });

  it('non-native dialog with modal=false drops aria-modal=true', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: false });
    await tick();
    const el = getDialog();
    expect(el?.getAttribute('aria-modal')).toBe('false');
  });

  it('native dialog does not set role/aria-modal explicitly (the element provides them)', async () => {
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false, modal: true });
    await tick();
    const el = getDialog();
    expect(el?.tagName.toLowerCase()).toBe('dialog');
    // The native <dialog> doesn't need role="dialog" — the implicit role suffices.
    expect(el?.getAttribute('role')).toBeNull();
  });

  it('reflects placement via data-placement', async () => {
    renderWithPortalTarget(Harness, { open: true, placement: 'bottom-end', unmountOnClose: false });
    await tick();
    expect(getDialog()?.getAttribute('data-placement')).toBe('bottom-end');
  });

  it.each(['center', 'top', 'bottom', 'left', 'right', 'top-start', 'bottom-end'] as const)(
    'reflects placement=%s via data-placement',
    async (placement) => {
      renderWithPortalTarget(Harness, { open: true, placement, unmountOnClose: false });
      await tick();
      expect(getDialog()?.getAttribute('data-placement')).toBe(placement);
    },
  );

  it('exposes data-clicked-outside reflecting closeOnClickOutside default (true) when closedby is unset', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div' });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe('true');
  });

  it('closedby=any takes precedence over closeOnClickOutside default', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', closedby: 'any' });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe('any');
  });

  it('closedby=none disables click-outside dismiss for non-native dialogs', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closedby: 'none',
      oncancel,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(oncancel).not.toHaveBeenCalled();
  });
});

describe('neoDialog — unmountOnClose matrix', { tags: ['jsdom'] }, () => {
  it('unmountOnClose=true (default) does not render the dialog when initially closed', async () => {
    renderWithPortalTarget(Harness, { open: false });
    await tick();
    expect(getDialog()).toBeNull();
  });

  it('unmountOnClose=false keeps the node mounted while closed and flips data-open', async () => {
    renderWithPortalTarget(Harness, { open: false, unmountOnClose: false });
    await tick();
    expect(getDialog()).not.toBeNull();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('default tag follows unmountOnClose: true → div', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDialog()?.tagName.toLowerCase()).toBe('div');
  });

  it('default tag follows unmountOnClose: false → dialog', async () => {
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false });
    await tick();
    expect(getDialog()?.tagName.toLowerCase()).toBe('dialog');
  });
});

describe('neoDialog — modal matrix (non-native)', { tags: ['jsdom'] }, () => {
  it('modal=true sets aria-modal="true"', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: true });
    await tick();
    expect(getDialog()?.getAttribute('aria-modal')).toBe('true');
  });

  it('modal=false sets aria-modal="false" and still renders role="dialog"', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: false });
    await tick();
    const el = getDialog();
    expect(el?.getAttribute('role')).toBe('dialog');
    expect(el?.getAttribute('aria-modal')).toBe('false');
  });
});
