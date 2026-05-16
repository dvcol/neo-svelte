import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoPopConfirm.test.svelte';

afterEach(() => {
  cleanup();
});

function getConfirm(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-confirm');
}

function getControlButton(label: 'Cancel' | 'Confirm' | 'Close confirmation tooltip'): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`button[aria-label="${label} confirmation tooltip"], button[aria-label="${label}"]`);
}

describe('neoPopConfirm — render', { tags: ['jsdom'] }, () => {
  it('renders the trigger element', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, {});
    expect(getByTestId('trigger-button').textContent).toBe('open');
  });

  it('does not render the confirm body until opened', () => {
    renderWithPortalTarget(Harness, {});
    expect(getConfirm()).toBeNull();
  });

  it('renders the confirm body when open=true', async () => {
    renderWithPortalTarget(Harness, { open: true, bodyText: 'Delete forever?' });
    await tick();
    const confirm = getConfirm();
    expect(confirm).not.toBeNull();
    expect(confirm?.textContent).toContain('Delete forever?');
  });

  it('renders a header when provided', async () => {
    renderWithPortalTarget(Harness, { open: true, headerText: 'Confirm action' });
    await tick();
    expect(getConfirm()?.querySelector('.neo-confirm-title')?.textContent).toContain('Confirm action');
  });

  it('renders Cancel and Confirm controls when open', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getControlButton('Cancel')).not.toBeNull();
    expect(getControlButton('Confirm')).not.toBeNull();
  });
});

describe('neoPopConfirm — closable', { tags: ['jsdom'] }, () => {
  it('renders a close button by default (closable defaults to true)', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(document.querySelector('.neo-confirm-control-close-button')).not.toBeNull();
  });

  it('does not render a close button when closable=false', async () => {
    renderWithPortalTarget(Harness, { open: true, closable: false });
    await tick();
    expect(document.querySelector('.neo-confirm-control-close-button')).toBeNull();
  });

  it('clicking the close button closes the confirm (open -> false) when closable=true', async () => {
    let captured = true;
    const onChange = (v: boolean): void => {
      captured = v;
    };
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      closable: true,
      tooltipProps: { onChange },
    });
    await tick();
    const closeBtn = document.querySelector<HTMLButtonElement>('.neo-confirm-control-close-button');
    expect(closeBtn).not.toBeNull();
    await user.click(closeBtn!);
    expect(captured).toBe(false);
  });

  it('escape closes the confirm when closable=true (closeOnDismiss is wired to closable)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      closable: true,
      tooltipProps: { onChange },
    });
    await tick();
    onChange.mockClear();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  it('escape does NOT close the confirm when closable=false', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      closable: false,
      tooltipProps: { onChange },
    });
    await tick();
    onChange.mockClear();
    await user.keyboard('{Escape}');
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('neoPopConfirm — onCancel / onConfirm', { tags: ['jsdom'] }, () => {
  it('clicking Cancel fires onCancel and closes the confirm', async () => {
    const onCancel = vi.fn();
    let captured = true;
    const onChange = (v: boolean): void => {
      captured = v;
    };
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      onCancel,
      tooltipProps: { onChange },
    });
    await tick();
    const cancel = getControlButton('Cancel');
    expect(cancel).not.toBeNull();
    await user.click(cancel!);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(captured).toBe(false);
  });

  it('clicking Confirm fires onConfirm and closes the confirm', async () => {
    const onConfirm = vi.fn();
    let captured = true;
    const onChange = (v: boolean): void => {
      captured = v;
    };
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      open: true,
      onConfirm,
      tooltipProps: { onChange },
    });
    await tick();
    const confirm = getControlButton('Confirm');
    expect(confirm).not.toBeNull();
    await user.click(confirm!);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(captured).toBe(false);
  });

  it('awaits a Promise from onConfirm and toggles loading.confirm during await', async () => {
    let resolveFn!: () => void;
    const pending = new Promise<void>((r) => {
      resolveFn = r;
    });
    const onConfirm = vi.fn(async () => pending);
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, onConfirm });
    await tick();
    const confirm = getControlButton('Confirm')!;
    const click = user.click(confirm);
    await tick();
    // Loading state must be reflected on the confirm button while the promise is pending.
    expect(confirm.getAttribute('aria-busy') ?? confirm.dataset.loading ?? '').toMatch(/true/);
    resolveFn();
    await click;
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
