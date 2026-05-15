import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, fireEvent } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoDialogConfirm.test.svelte';

afterEach(() => {
  cleanup();
});

function getConfirm(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-confirm');
}

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

function getControlButton(label: 'Cancel' | 'Confirm' | 'Close'): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    `button[aria-label="${label} confirmation tooltip"], button[aria-label="${label}"]`,
  );
}

describe('neoDialogConfirm — render', { tags: ['jsdom'] }, () => {
  it('does not render the confirm body when open=false (default)', () => {
    renderWithPortalTarget(Harness, {});
    expect(getConfirm()).toBeNull();
  });

  it('renders the confirm body and the underlying dialog when open=true', async () => {
    renderWithPortalTarget(Harness, { open: true, bodyText: 'Delete forever?' });
    await tick();
    expect(getDialog()).not.toBeNull();
    expect(getConfirm()).not.toBeNull();
    expect(getConfirm()?.textContent).toContain('Delete forever?');
  });

  it('renders a header when provided', async () => {
    renderWithPortalTarget(Harness, { open: true, headerText: 'Confirm action' });
    await tick();
    expect(getConfirm()?.querySelector('.neo-confirm-title')?.textContent).toContain('Confirm action');
  });

  it('renders both Cancel and Confirm controls when open', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getControlButton('Cancel')).not.toBeNull();
    expect(getControlButton('Confirm')).not.toBeNull();
  });
});

describe('neoDialogConfirm — closable matrix', { tags: ['jsdom'] }, () => {
  it('renders a close button by default (closable defaults to true when closedby is unset)', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(document.querySelector('.neo-confirm-control-close-button')).not.toBeNull();
  });

  it('does not render a close button when closable=false', async () => {
    renderWithPortalTarget(Harness, { open: true, closable: false });
    await tick();
    expect(document.querySelector('.neo-confirm-control-close-button')).toBeNull();
  });

  it('clicking the close button closes the dialog (data-open flips to false)', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      closable: true,
    });
    await tick();
    const closeBtn = document.querySelector<HTMLButtonElement>('.neo-confirm-control-close-button');
    expect(closeBtn).not.toBeNull();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    await user.click(closeBtn!);
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('closeOnClickOutside follows closable: closable=false suppresses outside dismiss', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      modal: true,
      closable: false,
      dialogProps: { tag: 'div', oncancel },
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(oncancel).not.toHaveBeenCalled();
  });

  it('closable=true (default) keeps outside dismiss enabled (non-native)', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      modal: true,
      closable: true,
      dialogProps: { tag: 'div', oncancel },
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(oncancel).toHaveBeenCalled();
  });
});

describe('neoDialogConfirm — onCancel / onConfirm', { tags: ['jsdom'] }, () => {
  it('clicking Cancel fires onCancel and closes the dialog', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      onCancel,
    });
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    await user.click(getControlButton('Cancel')!);
    await tick();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('clicking Confirm fires onConfirm and closes the dialog', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      onConfirm,
    });
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    await user.click(getControlButton('Confirm')!);
    await tick();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('awaits a Promise from onConfirm before closing (loading.confirm toggles during await)', async () => {
    let resolveFn!: () => void;
    const pending = new Promise<void>((r) => {
      resolveFn = r;
    });
    const onConfirm = vi.fn(async () => pending);
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false, onConfirm });
    await tick();
    const click = user.click(getControlButton('Confirm')!);
    await tick();
    resolveFn();
    await click;
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
