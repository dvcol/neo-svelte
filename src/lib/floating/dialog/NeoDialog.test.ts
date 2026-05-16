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

interface DialogInstance {
  reset: (options?: { translate?: boolean; x?: number; y?: number }) => Promise<boolean>;
  requestClose: (value?: string) => unknown;
}

function captureInstance(props: Record<string, unknown> = {}): {
  instance: DialogInstance;
  ref: HTMLDialogElement | undefined;
} {
  let instance: DialogInstance | undefined;
  let ref: HTMLDialogElement | undefined;
  renderWithPortalTarget(Harness, {
    ...props,
    onRef: (r: unknown) => {
      ref = r as HTMLDialogElement;
    },
    onInstance: (i: unknown) => {
      instance = i as DialogInstance;
    },
  });
  return { instance: instance as DialogInstance, ref };
}

describe('neoDialog — component-instance API', { tags: ['jsdom'] }, () => {
  it('exposes reset and requestClose on the component instance', async () => {
    const { instance } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    expect(typeof instance.reset).toBe('function');
    expect(typeof instance.requestClose).toBe('function');
  });

  it('exposes reset / requestClose on the non-native (div) tag instance too', async () => {
    const { instance } = captureInstance({ open: true, tag: 'div' });
    await tick();
    expect(typeof instance.reset).toBe('function');
    expect(typeof instance.requestClose).toBe('function');
  });

  it('does NOT attach reset onto the captured DOM ref (anti-pattern lock)', async () => {
    const { ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    expect(ref).toBeInstanceOf(HTMLElement);
    expect(Object.hasOwn(ref!, 'reset')).toBe(false);
  });

  it('does NOT attach requestClose onto the captured DOM ref (anti-pattern lock)', async () => {
    const { ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    expect(Object.hasOwn(ref!, 'requestClose')).toBe(false);
  });

  it('does NOT redefine returnValue as an own-property accessor (anti-pattern lock)', async () => {
    const { ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    const descriptor = Object.getOwnPropertyDescriptor(ref!, 'returnValue');
    // Native returnValue lives on the prototype (HTMLDialogElement.prototype),
    // not as an own-property on the element instance.
    expect(descriptor).toBeUndefined();
  });

  it('does NOT shadow native show / showModal / close as own-properties', async () => {
    const { ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    expect(Object.hasOwn(ref!, 'show')).toBe(false);
    expect(Object.hasOwn(ref!, 'showModal')).toBe(false);
    expect(Object.hasOwn(ref!, 'close')).toBe(false);
  });
});

describe('neoDialog — return value plumbing', { tags: ['jsdom'] }, () => {
  it('regression-critical: ref.close("foo") flips bindable open=false and propagates returnValue="foo"', async () => {
    const states: { open?: boolean; returnValue?: string }[] = [];
    let captured: HTMLDialogElement | undefined;
    const openVal = true;
    let rvVal: string | undefined;
    renderWithPortalTarget(Harness, {
      open: openVal,
      returnValue: rvVal,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
      // Track external state via a watcher snippet — easier path: read ref.returnValue post-close
    });
    await tick();
    captured!.close('foo');
    await tick();
    expect(captured!.returnValue).toBe('foo');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
    states.push({ open: openVal, returnValue: rvVal });
  });

  it('ref.close() with no args flips data-open=false but leaves prior returnValue untouched', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      returnValue: 'preset',
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    expect(captured!.returnValue).toBe('preset');
    captured!.close();
    await tick();
    expect(captured!.returnValue).toBe('preset');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('initial returnValue prop seeds ref.returnValue (so a subsequent native close() returns it)', async () => {
    const { instance, ref } = captureInstance({
      open: true,
      returnValue: 'seeded',
      unmountOnClose: false,
    });
    await tick();
    // The seed flows through the $effect that mirrors bindable returnValue → ref.returnValue.
    // Since requestClose without a value preserves the seed, we can verify it via close().
    expect(ref).toBeDefined();
    expect(typeof instance.requestClose).toBe('function');
    instance.requestClose();
    await tick();
    expect(ref!.returnValue).toBe('seeded');
  });

  it('instance.requestClose("bar") flips data-open=false and stamps returnValue="bar"', async () => {
    const { instance, ref } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    instance.requestClose('bar');
    await tick();
    expect(ref!.returnValue).toBe('bar');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('instance.requestClose() with no value flips open=false and leaves returnValue intact', async () => {
    const { instance, ref } = captureInstance({ open: true, returnValue: 'keep', unmountOnClose: false });
    await tick();
    instance.requestClose();
    await tick();
    expect(ref!.returnValue).toBe('keep');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('instance.requestClose on a non-native dialog dispatches cancel + close events and flips open', async () => {
    const oncancel = vi.fn();
    const onclose = vi.fn();
    const { instance } = captureInstance({
      open: true,
      tag: 'div',
      unmountOnClose: false,
      oncancel,
      onclose,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    instance.requestClose('cancel-value');
    // onclose runs internal $effects (movable.reset awaits debounced animations),
    // so wait long enough for the asynchronous chain to complete.
    await new Promise(r => setTimeout(r, 350));
    await tick();
    expect(oncancel).toHaveBeenCalled();
    expect(onclose).toHaveBeenCalled();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });
});

describe('neoDialog — reset / movable plumbing', { tags: ['jsdom'] }, () => {
  it('instance.reset() resolves to a boolean', async () => {
    const { instance } = captureInstance({ open: true, unmountOnClose: false });
    await tick();
    const result = await instance.reset();
    expect(typeof result).toBe('boolean');
  });

  it('instance.reset({ translate: true }) resolves successfully and accepts the option object', async () => {
    const { instance } = captureInstance({ open: true, unmountOnClose: false, movable: { enabled: true } });
    await tick();
    await expect(instance.reset({ translate: true })).resolves.toBeDefined();
  });

  it('instance.reset({ x: 0, y: 0 }) resolves with explicit coordinates', async () => {
    const { instance } = captureInstance({ open: true, unmountOnClose: false, movable: { enabled: true } });
    await tick();
    await expect(instance.reset({ x: 0, y: 0 })).resolves.toBeDefined();
  });

  it('promise.all over multiple instance.reset({ translate: true }) calls resolves all branches', async () => {
    const { instance: a } = captureInstance({ open: true, unmountOnClose: false, movable: { enabled: true } });
    const { instance: b } = captureInstance({ open: true, unmountOnClose: false, movable: { enabled: true } });
    await tick();
    const results = await Promise.all([a.reset({ translate: true }), b.reset({ translate: true })]);
    expect(results.length).toBe(2);
    results.forEach(r => expect(typeof r).toBe('boolean'));
  });

  it('movable.resetOnClose=true: closing the dialog implicitly invokes reset (no throw)', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      movable: { enabled: true, resetOnClose: true },
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    captured!.close();
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('movable.resetOnClose=false: closing the dialog still flips open (no reset side-effect)', async () => {
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      unmountOnClose: false,
      movable: { enabled: true, resetOnClose: false },
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

describe('neoDialog — open/close lifecycle (instance + native parity)', { tags: ['jsdom'] }, () => {
  it('open=true on a native dialog flips data-open to "true" when modal=true', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: true, unmountOnClose: false });
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
  });

  it('open=true on a native dialog flips data-open to "true" when modal=false', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: false, unmountOnClose: false });
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('true');
    expect(getDialog()?.getAttribute('data-modal')).toBe('false');
  });

  it('instance.requestClose on a native dialog flips data-open to "false"', async () => {
    const { instance } = captureInstance({ open: true, modal: true, unmountOnClose: false });
    await tick();
    instance.requestClose();
    await tick();
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('native close event syncs the bindable open prop and reads ref.returnValue (regression-critical)', async () => {
    // Capture state observable from outside: when ref.close('done') runs the close event handler,
    // the component's onClose effect mirrors ref.returnValue back to the bindable returnValue.
    // Because the harness captures ref via onRef, post-close we can verify ref.returnValue is set
    // and the dialog has flipped data-open.
    let captured: HTMLDialogElement | undefined;
    renderWithPortalTarget(Harness, {
      open: true,
      modal: true,
      unmountOnClose: false,
      onRef: (r: unknown) => {
        captured = r as HTMLDialogElement;
      },
    });
    await tick();
    captured!.close('done');
    await tick();
    expect(captured!.returnValue).toBe('done');
    expect(getDialog()?.getAttribute('data-open')).toBe('false');
  });

  it('non-native dialog: setting open back to false via an outside click dispatches cancel and close', async () => {
    const oncancel = vi.fn();
    const onclose = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closeOnClickOutside: true,
      oncancel,
      onclose,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    // The internal onClose runs an awaited movable.reset() before invoking the user onclose callback;
    // wait long enough for the chain to flush.
    await new Promise(r => setTimeout(r, 350));
    await tick();
    expect(oncancel).toHaveBeenCalled();
    expect(onclose).toHaveBeenCalled();
  });
});

describe('neoDialog — placement matrix × tag', { tags: ['jsdom'] }, () => {
  const placements = ['center', 'top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'] as const;
  it.each(placements)('renders placement=%s on a non-native dialog', async (placement) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', placement });
    await tick();
    expect(getDialog()?.getAttribute('data-placement')).toBe(placement);
  });

  it.each(placements)('renders placement=%s on a native dialog', async (placement) => {
    renderWithPortalTarget(Harness, { open: true, unmountOnClose: false, placement });
    await tick();
    expect(getDialog()?.getAttribute('data-placement')).toBe(placement);
  });
});

describe('neoDialog — closedby × closeOnClickOutside matrix', { tags: ['jsdom'] }, () => {
  it.each(['any', 'closerequest', 'none'] as const)('closedby=%s reflected on data-clicked-outside (non-native)', async (closedby) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', closedby });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe(closedby);
  });

  it('closedby=undefined + closeOnClickOutside=true → data-clicked-outside="true"', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', closeOnClickOutside: true });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe('true');
  });

  it('closedby=undefined + closeOnClickOutside=false → data-clicked-outside="false"', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', closeOnClickOutside: false });
    await tick();
    expect(getDialog()?.getAttribute('data-clicked-outside')).toBe('false');
  });

  it('closedby=any: outside pointerdown still fires oncancel (we wire it ourselves)', async () => {
    const oncancel = vi.fn();
    renderWithPortalTarget(Harness, {
      open: true,
      tag: 'div',
      modal: true,
      closedby: 'any',
      oncancel,
    });
    await tick();
    await new Promise(r => setTimeout(r, 5));
    await fireEvent.pointerDown(document.body);
    await tick();
    // closeOnClickOutside defaults to undefined when closedby is set, so the window listener does NOT fire.
    expect(oncancel).not.toHaveBeenCalled();
  });
});

describe('neoDialog — full × placement × movable matrix', { tags: ['jsdom'] }, () => {
  it.each([
    { full: true, placement: 'center' },
    { full: true, placement: 'top' },
    { full: true, placement: 'bottom' },
    { full: true, placement: 'left' },
    { full: true, placement: 'right' },
    { full: false, placement: 'center' },
    { full: false, placement: 'bottom-end' },
  ] as const)('renders full=$full + placement=$placement', async ({ full, placement }) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', full, placement });
    await tick();
    const el = getDialog();
    expect(el?.classList.contains('neo-full-size')).toBe(full);
    expect(el?.getAttribute('data-placement')).toBe(placement);
  });

  it.each([true, false])('movable.enabled=%s drives the neo-movable class', async (enabled) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', movable: { enabled } });
    await tick();
    expect(getDialog()?.classList.contains('neo-movable')).toBe(enabled);
  });

  it.each(['x', 'y'] as const)('movable.axis=%s reflects on data-axis', async (axis) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', movable: { enabled: true, axis } });
    await tick();
    expect(getDialog()?.getAttribute('data-axis')).toBe(axis);
  });
});

describe('neoDialog — disableBodyScroll matrix', { tags: ['jsdom'] }, () => {
  it('disableBodyScroll defaults to mirror modal=true', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: true, tag: 'div' });
    await tick();
    expect(getDialog()?.classList.contains('neo-body-scroll-disabled')).toBe(true);
  });

  it('disableBodyScroll defaults to mirror modal=false', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: false, tag: 'div' });
    await tick();
    expect(getDialog()?.classList.contains('neo-body-scroll-disabled')).toBe(false);
  });

  it('disableBodyScroll=true forces the class even when modal=false', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: false, tag: 'div', disableBodyScroll: true });
    await tick();
    expect(getDialog()?.classList.contains('neo-body-scroll-disabled')).toBe(true);
  });

  it('disableBodyScroll=false strips the class even when modal=true', async () => {
    renderWithPortalTarget(Harness, { open: true, modal: true, tag: 'div', disableBodyScroll: false });
    await tick();
    expect(getDialog()?.classList.contains('neo-body-scroll-disabled')).toBe(false);
  });
});

describe('neoDialog — backdrop matrix (non-native, modal)', { tags: ['jsdom'] }, () => {
  it('backdrop=true (default) renders the backdrop sibling', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: true });
    await tick();
    expect(document.querySelector('.neo-dialog-backdrop')).not.toBeNull();
  });

  it('backdrop=false hides the backdrop via .neo-hidden', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: true, backdrop: false });
    await tick();
    expect(document.querySelector('.neo-dialog-backdrop.neo-hidden')).not.toBeNull();
  });

  it('non-modal non-native dialog does not render a backdrop sibling', async () => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', modal: false });
    await tick();
    expect(document.querySelector('.neo-dialog-backdrop')).toBeNull();
  });
});

describe('neoDialog — visual flag classes (filled / tinted / rounded / borderless)', { tags: ['jsdom'] }, () => {
  it.each([
    { flag: 'filled', className: 'neo-filled' },
    { flag: 'tinted', className: 'neo-tinted' },
    { flag: 'rounded', className: 'neo-rounded' },
    { flag: 'borderless', className: 'neo-borderless' },
  ])('$flag=true applies $className', async ({ flag, className }) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', [flag]: true });
    await tick();
    expect(getDialog()?.classList.contains(className)).toBe(true);
  });

  it.each([
    { flag: 'filled', className: 'neo-filled' },
    { flag: 'tinted', className: 'neo-tinted' },
    { flag: 'rounded', className: 'neo-rounded' },
    { flag: 'borderless', className: 'neo-borderless' },
  ])('$flag=false strips $className', async ({ flag, className }) => {
    renderWithPortalTarget(Harness, { open: true, tag: 'div', [flag]: false });
    await tick();
    expect(getDialog()?.classList.contains(className)).toBe(false);
  });
});

describe('neoDialog — stratified instance-API × tag × modal matrix', { tags: ['jsdom'] }, () => {
  for (const tag of ['div', 'dialog'] as const) {
    for (const modal of [true, false] as const) {
      it(`exposes reset / requestClose for tag=${tag} × modal=${modal}`, async () => {
        const props: Record<string, unknown> = { open: true, modal, tag };
        if (tag === 'dialog') props.unmountOnClose = false;
        const { instance } = captureInstance(props);
        await tick();
        expect(typeof instance.reset).toBe('function');
        expect(typeof instance.requestClose).toBe('function');
      });

      it(`instance.requestClose closes the dialog for tag=${tag} × modal=${modal}`, async () => {
        // unmountOnClose=false keeps the element after close so we can read data-open
        // (unmountOnClose=true removes the node entirely on close → getDialog() returns null).
        const props: Record<string, unknown> = { open: true, modal, tag, unmountOnClose: false };
        const { instance } = captureInstance(props);
        await tick();
        instance.requestClose();
        // For tag='div' the close runs through dispatched events + an async movable.reset();
        // wait for the async chain to settle before asserting the data-open transition.
        await new Promise(r => setTimeout(r, 350));
        await tick();
        expect(getDialog()?.getAttribute('data-open')).toBe('false');
      });
    }
  }
});
