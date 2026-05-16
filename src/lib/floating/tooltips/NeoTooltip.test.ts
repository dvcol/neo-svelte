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

describe('neoTooltip — bindable open', { tags: ['jsdom'] }, () => {
  it('reflects external open=true by rendering the tooltip', async () => {
    const { rerender } = renderWithPortalTarget(Harness, { open: false });
    expect(getTooltip()).toBeNull();
    await rerender({ open: true });
    expect(getTooltip()).not.toBeNull();
  });
});

interface TooltipInstance {
  toggle: (state?: boolean) => boolean;
  update: () => Promise<void>;
  floating: { update: () => Promise<void> };
}

function captureInstance(props: Record<string, unknown> = {}): {
  instance: TooltipInstance;
  ref: HTMLElement | undefined;
  triggerRef: HTMLElement | undefined;
} {
  let instance: TooltipInstance | undefined;
  let ref: HTMLElement | undefined;
  let triggerRef: HTMLElement | undefined;
  renderWithPortalTarget(Harness, {
    ...props,
    onRef: (r: HTMLElement | undefined) => {
      ref = r;
    },
    onTriggerRef: (r: HTMLElement | undefined) => {
      triggerRef = r;
    },
    onInstance: (i: unknown) => {
      instance = i as TooltipInstance;
    },
  });
  return { instance: instance as TooltipInstance, ref, triggerRef };
}

describe('neoTooltip — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes toggle / update / floating on the component instance', async () => {
    const { instance } = captureInstance({ unmountOnClose: false });
    await tick();
    expect(typeof instance.toggle).toBe('function');
    expect(typeof instance.update).toBe('function');
    expect(typeof instance.floating?.update).toBe('function');
  });

  it('does not attach component methods onto the floating DOM ref', async () => {
    const { ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    expect(ref).toBeInstanceOf(HTMLElement);
    for (const member of ['toggle', 'update'] as const) {
      expect(Object.hasOwn(ref!, member)).toBe(false);
      expect((ref as unknown as Record<string, unknown>)[member]).toBeUndefined();
    }
  });

  it('does not attach component methods onto the trigger DOM ref', async () => {
    const { triggerRef } = captureInstance({ open: false, unmountOnClose: false });
    await tick();
    expect(triggerRef).toBeInstanceOf(HTMLElement);
    for (const member of ['toggle', 'update'] as const) {
      expect(Object.hasOwn(triggerRef!, member)).toBe(false);
      expect((triggerRef as unknown as Record<string, unknown>)[member]).toBeUndefined();
    }
  });

  it('instance.toggle(true) reveals the floating element; toggle(false) hides it', async () => {
    const { instance, ref } = captureInstance({ open: false, unmountOnClose: false });
    await tick();
    expect(instance.toggle(true)).toBe(true);
    await tick();
    expect(ref?.hasAttribute('hidden')).toBe(false);
    expect(instance.toggle(false)).toBe(false);
    await tick();
    expect(ref?.hasAttribute('hidden')).toBe(true);
  });

  it('instance.toggle() with no argument flips the current state', async () => {
    const { instance, ref } = captureInstance({ open: false, unmountOnClose: false });
    await tick();
    expect(instance.toggle()).toBe(true);
    await tick();
    expect(ref?.hasAttribute('hidden')).toBe(false);
    expect(instance.toggle()).toBe(false);
    await tick();
    expect(ref?.hasAttribute('hidden')).toBe(true);
  });

  it('instance.update() returns the Popover update promise', async () => {
    const { instance } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    const result = instance.update();
    expect(result).toBeInstanceOf(Promise);
    await result;
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

describe('neoTooltip — openOnClick', { tags: ['jsdom'] }, () => {
  it('opens on click when openOnClick=true and other flags disabled', async () => {
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

  it('does not open on click when openOnClick=false (and other flags disabled)', async () => {
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

  it('a second click on the same trigger toggles the tooltip closed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { getByTestId } = renderWithPortalTarget(Harness, {
      openOnHover: false,
      openOnFocus: false,
      openOnClick: true,
      onChange,
    });
    const trigger = getByTestId('trigger-content');
    await user.click(trigger);
    await tick();
    expect(onChange).toHaveBeenLastCalledWith(true);
    await user.click(trigger);
    await tick();
    expect(onChange).toHaveBeenLastCalledWith(false);
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

describe('neoTooltip — disabled', { tags: ['jsdom'] }, () => {
  it('disabled=true blocks hover from opening', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      disabled: true,
      openOnHover: true,
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

  it('disabled=true blocks focus from opening', async () => {
    const onChange = vi.fn();
    const { container } = renderWithPortalTarget(Harness, {
      disabled: true,
      openOnHover: false,
      openOnFocus: true,
      openOnClick: false,
      onChange,
    });
    await fireEvent.focusIn(getTrigger(container));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled=true blocks click from opening', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { getByTestId } = renderWithPortalTarget(Harness, {
      disabled: true,
      openOnHover: false,
      openOnFocus: false,
      openOnClick: true,
      onChange,
    });
    await user.click(getByTestId('trigger-content'));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled=true overrides clickOptions.enabled=true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { getByTestId } = renderWithPortalTarget(Harness, {
      disabled: true,
      openOnHover: false,
      openOnFocus: false,
      openOnClick: false,
      clickOptions: { enabled: true },
      onChange,
    });
    await user.click(getByTestId('trigger-content'));
    await tick();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled=true still allows escape to close an externally-opened tooltip (dismiss remains active)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { open: true, disabled: true, onChange });
    await tick();
    onChange.mockClear();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false);
    });
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
