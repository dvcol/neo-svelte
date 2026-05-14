import { cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './NeoDrawerConfirmHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getConfirm(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-confirm');
}

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

function getDrawerWrapper(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drawer');
}

function getControlButton(label: 'Cancel' | 'Confirm'): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    `button[aria-label="${label} confirmation tooltip"], button[aria-label="${label}"]`,
  );
}

describe('neoDrawerConfirm — render', () => {
  it('does not render the confirm body when open=false', () => {
    renderWithPortalTarget(Harness, {});
    expect(getConfirm()).toBeNull();
  });

  it('renders the drawer wrapper, dialog, and confirm body when open=true', async () => {
    renderWithPortalTarget(Harness, { open: true, bodyText: 'Discard?' });
    await tick();
    expect(getDrawerWrapper()).not.toBeNull();
    expect(getDialog()).not.toBeNull();
    expect(getConfirm()).not.toBeNull();
    expect(getConfirm()?.textContent).toContain('Discard?');
  });

  it('inherits drawer default placement = "right"', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDialog()?.getAttribute('data-placement')).toBe('right');
  });

  it('renders Cancel and Confirm controls', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getControlButton('Cancel')).not.toBeNull();
    expect(getControlButton('Confirm')).not.toBeNull();
  });
});

describe('neoDrawerConfirm — closable matrix', () => {
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
});

describe('neoDrawerConfirm — onCancel / onConfirm', () => {
  it('clicking Cancel fires onCancel and closes the dialog', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false, onCancel });
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
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false, onConfirm });
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    await user.click(getControlButton('Confirm')!);
    await tick();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('awaits a Promise from onConfirm before closing', async () => {
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
