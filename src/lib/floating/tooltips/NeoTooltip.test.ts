import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, fireEvent, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoTooltip.test.svelte';

afterEach(() => {
  cleanup();
});

function getTooltip(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip');
}

describe('neoTooltip — render', { tags: ['jsdom'] }, () => {
  it('renders the trigger children inline when no target is provided', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { triggerLabel: 'Click me' });
    const trigger = getByTestId('trigger-content');
    expect(trigger.textContent).toBe('Click me');
    expect(trigger.closest('.neo-tooltip-trigger')).not.toBeNull();
  });

  it('does not render the tooltip in the document until opened (unmountOnClose default)', () => {
    renderWithPortalTarget(Harness, { tooltipLabel: 'Hello' });
    expect(getTooltip()).toBeNull();
  });

  it('renders the tooltip element when open=true (string tooltip)', () => {
    renderWithPortalTarget(Harness, { open: true, tooltipLabel: 'Hello world' });
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent?.trim()).toBe('Hello world');
  });

  it('renders the tooltip snippet when provided', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, {
      open: true,
      tooltipSnippet: true,
      tooltipLabel: 'snippet body',
    });
    const node = getByTestId('tooltip-snippet');
    expect(node.textContent).toBe('snippet body');
  });

  it('keeps the tooltip mounted but hidden when unmountOnClose=false and open=false', () => {
    renderWithPortalTarget(Harness, {
      open: false,
      unmountOnClose: false,
      tooltipLabel: 'persisted',
    });
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });
});

describe('neoTooltip — ARIA', { tags: ['jsdom'] }, () => {
  it('floating element exposes role="tooltip" by default and a stable id', () => {
    renderWithPortalTarget(Harness, { open: true });
    const tooltip = getTooltip();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(tooltip?.id).toBeTruthy();
  });

  it('respects an overridden role', () => {
    renderWithPortalTarget(Harness, { open: true, role: 'dialog' });
    const tooltip = getTooltip();
    expect(tooltip?.getAttribute('role')).toBe('dialog');
  });

  it('wires aria-describedby on the trigger to the tooltip id when open', () => {
    const { container } = renderWithPortalTarget(Harness, { open: true });
    const tooltip = getTooltip();
    const trigger = container.querySelector<HTMLElement>('.neo-tooltip-trigger');
    expect(trigger).not.toBeNull();
    const described = trigger?.getAttribute('aria-describedby');
    expect(described).toBeTruthy();
    expect(described).toBe(tooltip?.id);
  });
});

describe('neoTooltip — bindable open & exposed methods', { tags: ['jsdom'] }, () => {
  it('reflects external open=true by rendering the tooltip', async () => {
    const { rerender } = renderWithPortalTarget(Harness, { open: false });
    expect(getTooltip()).toBeNull();
    await rerender({ open: true });
    expect(getTooltip()).not.toBeNull();
  });

  it('toggle() on the floating ref flips the open state', async () => {
    let captured: HTMLElement | undefined;
    const onRef = (r: HTMLElement | undefined): void => {
      captured = r;
    };
    renderWithPortalTarget(Harness, {
      open: false,
      unmountOnClose: false,
      onRef,
    });
    await tick();
    const tooltip = captured as HTMLElement & { toggle?: (state?: boolean) => boolean };
    expect(tooltip).toBeDefined();
    expect(typeof tooltip.toggle).toBe('function');
    expect(tooltip.toggle?.(true)).toBe(true);
    await tick();
    expect(tooltip.hasAttribute('hidden')).toBe(false);
    expect(tooltip.toggle?.(false)).toBe(false);
    await tick();
    expect(tooltip.hasAttribute('hidden')).toBe(true);
  });

  it('toggle() on the trigger ref also flips the open state', async () => {
    let captured: HTMLElement | undefined;
    const onTriggerRef = (r: HTMLElement | undefined): void => {
      captured = r;
    };
    renderWithPortalTarget(Harness, {
      open: false,
      unmountOnClose: false,
      onTriggerRef,
    });
    await tick();
    const trig = captured as HTMLElement & { toggle?: (state?: boolean) => boolean };
    expect(typeof trig.toggle).toBe('function');
    trig.toggle?.(true);
    await tick();
    expect(getTooltip()?.hasAttribute('hidden')).toBe(false);
  });
});

describe('neoTooltip — events', { tags: ['jsdom'] }, () => {
  it('fires onChange / onOpen when transitioning closed -> open', async () => {
    const onChange = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { rerender } = renderWithPortalTarget(Harness, {
      open: false,
      onChange,
      onOpen,
      onClose,
    });
    await rerender({ open: true, onChange, onOpen, onClose });
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('fires onChange / onClose when transitioning open -> closed', async () => {
    const onChange = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { rerender } = renderWithPortalTarget(Harness, {
      open: true,
      onChange,
      onOpen,
      onClose,
    });
    onChange.mockClear();
    await rerender({ open: false, onChange, onOpen, onClose });
    expect(onChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

function getTrigger(container: HTMLElement): HTMLElement {
  const node = container.querySelector<HTMLElement>('.neo-tooltip-trigger');
  if (!node) throw new Error('trigger not rendered');
  return node;
}

describe('neoTooltip — openOnHover', { tags: ['jsdom'] }, () => {
  it('opens via mouseenter when openOnHover=true and other interactions disabled', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: true,
      openOnFocus: false,
      openOnClick: false,
      hoverDelay: 0,
      openDelay: 0,
      onChange,
    });
    await fireEvent.mouseEnter(getTrigger(container));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  it('does not open via mouseenter when openOnHover=false (and other flags disabled)', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: false,
      hoverDelay: 0,
      openDelay: 0,
      onChange,
    });
    await fireEvent.mouseEnter(getTrigger(container));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keepOpenOnHover=true prevents mouse leave from closing the tooltip', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      open: true,
      openOnHover: true,
      openOnFocus: false,
      openOnClick: false,
      keepOpenOnHover: true,
      hoverDelay: 0,
      openDelay: 0,
      onChange,
    });
    await tick();
    onChange.mockClear();
    await fireEvent.mouseLeave(getTrigger(container));
    await tick();
    expect(onChange).not.toHaveBeenCalledWith(false);
  });
});

/**
 * Focus-driven open relies on `:focus-visible` which jsdom doesn't simulate
 * — skeleton's `useFocus` checks `event.target.matches(':focus-visible')`.
 * The keyboard-tab path is covered in NeoTooltip.browser.test.ts under
 * "neoTooltip — keyboard focus opens (real :focus-visible)". jsdom only
 * verifies the `openOnFocus=false` negative path here.
 */
describe('neoTooltip — openOnFocus', { tags: ['jsdom'] }, () => {
  it.skip('opens via focus when openOnFocus=true and other interactions disabled', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: true,
      openOnClick: false,
      onChange,
    });
    await fireEvent.focusIn(getTrigger(container));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  it('does not open via focusin when openOnFocus=false (and other flags disabled)', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: false,
      onChange,
    });
    await fireEvent.focusIn(getTrigger(container));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });
});

/**
 * Known bug: NeoTooltip.svelte:150 unconditionally drops the click reason in
 * onOpenChange, so `openOnClick=true` enables skeleton's useClick middleware
 * but the resulting state change is thrown away. The expected behavior is
 * pinned here as skipped tests — they should be unskipped (or the prop removed)
 * after the migration to @floating-ui/dom in Phase 2.
 */
describe('neoTooltip — openOnClick (expected behavior, currently broken)', { tags: ['jsdom'] }, () => {
  it.skip('opens on click when openOnClick=true and other flags disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { getByTestId } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: true,
      onChange,
    });
    await user.click(getByTestId('trigger-content'));
    await tick();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it.skip('does not open on click when openOnClick=false (and other flags disabled)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { getByTestId } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: false,
      onChange,
    });
    await user.click(getByTestId('trigger-content'));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('neoTooltip — interaction flag combinations', { tags: ['jsdom'] }, () => {
  it('hover and focus compose: mouseenter opens when both openOnHover and openOnFocus are true', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      openOnHover: true,
      openOnFocus: true,
      openOnClick: false,
      hoverDelay: 0,
      openDelay: 0,
      onChange,
    });
    await fireEvent.mouseEnter(getTrigger(container));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  // The focus path of this combination is exercised in the browser project
  // (jsdom does not implement :focus-visible — see notes above).

  it('does not open via hover, focus, or click when all interaction flags are disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { container, getByTestId } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: false,
      hoverDelay: 0,
      openDelay: 0,
      onChange,
    });
    const trigger = getTrigger(container);
    await fireEvent.mouseEnter(trigger);
    await fireEvent.focusIn(trigger);
    await user.click(getByTestId('trigger-content'));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });
});

/**
 * Dismiss is observed via `onChange(false)`, which is the user-facing contract
 * (and what `bind:open` reflects). DOM removal is incidentally driven by
 * skeleton's `floating.open` getter and is exercised in the browser project.
 */
describe('neoTooltip — dismiss', { tags: ['jsdom'] }, () => {
  it('escape key invokes onChange(false) when closeOnDismiss=true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, onChange });
    await tick();
    onChange.mockClear();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  it('escape does not fire onChange when closeOnDismiss=false', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, closeOnDismiss: false, onChange });
    await tick();
    onChange.mockClear();
    await user.keyboard('{Escape}');
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('outside pointerdown invokes onChange(false)', async () => {
    const onChange = vi.fn();
    renderWithPortalTarget(Harness, { open: true, onChange });
    await tick();
    onChange.mockClear();
    await fireEvent.pointerDown(document.body);
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('neoTooltip — external target', { tags: ['jsdom'] }, () => {
  it('attaches to an external target element rather than rendering an inline trigger', async () => {
    const target = document.createElement('button');
    target.textContent = 'external';
    document.body.appendChild(target);

    const { container } = renderWithPortalTarget(Harness, { target, open: true });
    await tick();

    expect(container.querySelector('.neo-tooltip-trigger')).toBeNull();
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(target.getAttribute('aria-describedby')).toBe(tooltip?.id);

    document.body.removeChild(target);
  });
});

describe('neoTooltip — portal', { tags: ['jsdom'] }, () => {
  it('mounts the tooltip into document.body when portal=true', () => {
    const { container } = renderWithPortalTarget(Harness, { open: true, portal: true });
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(container.contains(tooltip)).toBe(false);
    expect(document.body.contains(tooltip)).toBe(true);
  });

  it('renders inline (inside the component subtree) when portal=false', () => {
    const { container } = renderWithPortalTarget(Harness, { open: true, portal: false });
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(container.contains(tooltip)).toBe(true);
  });
});
