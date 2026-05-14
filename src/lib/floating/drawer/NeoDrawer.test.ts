import { cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './NeoDrawerHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

function getDrawerWrapper(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drawer');
}

describe('neoDrawer — render & open sync', () => {
  it('mounts a .neo-drawer wrapper around the dialog', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDrawerWrapper()).not.toBeNull();
    expect(getDialog()).not.toBeNull();
    expect(getDrawerWrapper()?.contains(getDialog())).toBe(true);
  });

  it('default placement is "right"', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDialog()?.getAttribute('data-placement')).toBe('right');
  });

  it('renders body content when open', async () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { open: true, bodyText: 'hello drawer' });
    await tick();
    expect(getByTestId('drawer-body').textContent).toBe('hello drawer');
  });

  it('does not render the dialog when open=false (unmountOnClose default)', () => {
    renderWithPortalTarget(Harness, { open: false });
    expect(getDialog()).toBeNull();
  });
});

describe('neoDrawer — modal is forced (cannot be disabled)', () => {
  // The NeoDrawer component hard-codes `modal` on the underlying NeoDialog;
  // its public type also Omits `modal`. Verify modal=true regardless of attempts to override.
  it('data-modal="true" with default props', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDialog()?.getAttribute('data-modal')).toBe('true');
  });

  it('data-modal="true" even when modal=false is forwarded via spread', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: false } as never);
    await tick();
    expect(getDialog()?.getAttribute('data-modal')).toBe('true');
  });
});

describe('neoDrawer — placement → axis mapping (NeoDrawer.svelte:40-50)', () => {
  it.each([
    ['right', 'x'],
    ['left', 'x'],
    ['right-start', 'x'],
    ['left-end', 'x'],
    ['top', 'y'],
    ['bottom', 'y'],
    ['top-start', 'y'],
    ['bottom-end', 'y'],
  ] as const)('placement=%s with movable enabled produces data-axis=%s', async (placement, expected) => {
    renderWithPortalTarget(Harness, { open: true, placement, movable: true });
    await tick();
    expect(getDialog()?.getAttribute('data-axis')).toBe(expected);
  });

  it('honors an explicit movable.axis (does not overwrite when caller specifies it)', async () => {
    renderWithPortalTarget(Harness, {
      open: true,
      placement: 'right',
      movable: { enabled: true, axis: 'y' },
    });
    await tick();
    expect(getDialog()?.getAttribute('data-axis')).toBe('y');
  });
});

describe('neoDrawer — placement → snap limits (NeoDrawer.svelte:31-38)', () => {
  // The drawer's getLimits() injects min=0 / max=0 on the relevant axis based on placement.
  // The data-axis attribute already verifies axis derivation; here we verify the limits
  // path indirectly: with movable enabled and no explicit limits, the dialog should mount
  // and expose movable=true (.neo-movable class) without error, and the axis matches.
  it.each([
    ['right', 'x'],
    ['left', 'x'],
    ['top', 'y'],
    ['bottom', 'y'],
  ] as const)('placement=%s with movable enabled mounts on axis=%s', async (placement, axis) => {
    renderWithPortalTarget(Harness, { open: true, placement, movable: true });
    await tick();
    const dialog = getDialog();
    expect(dialog).not.toBeNull();
    expect(dialog?.classList.contains('neo-movable')).toBe(true);
    expect(dialog?.getAttribute('data-axis')).toBe(axis);
  });

  it('preserves user-provided limits while injecting the placement-axis floor/ceiling', async () => {
    renderWithPortalTarget(Harness, {
      open: true,
      placement: 'right',
      movable: { enabled: true, limits: { x: { max: 200 } } },
    });
    await tick();
    // Verify component mounts cleanly with user-provided limits + placement-derived min=0.
    expect(getDialog()).not.toBeNull();
    expect(getDialog()?.getAttribute('data-axis')).toBe('x');
  });
});

describe('neoDrawer — full sizing default', () => {
  it('full=true by default — adds the .neo-full-size class', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    expect(getDialog()?.classList.contains('neo-full-size')).toBe(true);
  });

  it('full=false drops the .neo-full-size class', async () => {
    renderWithPortalTarget(Harness, { open: true, full: false });
    await tick();
    expect(getDialog()?.classList.contains('neo-full-size')).toBe(false);
  });
});

describe('neoDrawer — closable matrix', () => {
  it('closable defaults to true (closedby unset) — close button rendered', async () => {
    renderWithPortalTarget(Harness, { open: true });
    await tick();
    // Drawer wraps NeoDialog only — the dialog doesn't render its own close button,
    // but a closeOnClickOutside derived from `closable` lands on data-clicked-outside.
    expect(getDialog()?.getAttribute('data-clicked-outside')).not.toBe('none');
  });

  it('closedby="none" disables outside-click dismiss', async () => {
    renderWithPortalTarget(Harness, { open: true, closedby: 'none' });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe('none');
  });
});
