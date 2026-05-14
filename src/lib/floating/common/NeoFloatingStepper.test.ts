import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoFloatingStepperHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const steps = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];

function getRoot(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-floating-stepper');
}

function getCloseWrapper(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-floating-stepper-close');
}

function findButton(aria: string, scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>(`button[aria-label="${aria}"]`);
}

describe('neoFloatingStepper — render', () => {
  it('renders a wrapper, the underlying stepper, and Cancel/Next controls', async () => {
    const { container } = render(Harness, { props: { steps } as never });
    await tick();
    expect(getRoot(container)).not.toBeNull();
    expect(container.querySelector('.neo-stepper')).not.toBeNull();
    expect(findButton('Cancel stepper', container)).not.toBeNull();
    expect(findButton('Go to next step', container)).not.toBeNull();
  });

  it('uses the supplied id and derives header id from it', async () => {
    const { container } = render(Harness, { props: { id: 'fs', steps, headerText: 'h' } as never });
    await tick();
    expect(container.querySelector('#fs')).not.toBeNull();
    expect(container.querySelector('#fs-header')).not.toBeNull();
  });
});

describe('neoFloatingStepper — header matrix', () => {
  it('does not render header when no header is supplied', async () => {
    const { container } = render(Harness, { props: { steps } as never });
    await tick();
    expect(container.querySelector('.neo-floating-stepper-header')).toBeNull();
  });

  it('renders header element with the title when headerText is supplied', async () => {
    const { container } = render(Harness, { props: { steps, headerText: 'Wizard' } as never });
    await tick();
    const header = container.querySelector<HTMLElement>('.neo-floating-stepper-header');
    expect(header).not.toBeNull();
    expect(header?.querySelector('.neo-floating-stepper-title')?.textContent).toContain('Wizard');
  });

  it('header tag defaults to h6 and is overridable via headerProps.tag', async () => {
    const { container, rerender } = render(Harness, { props: { steps, headerText: 'h' } as never });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-floating-stepper-title')?.tagName).toBe('H6');
    await rerender({ steps, headerText: 'h', headerProps: { tag: 'h3' } } as never);
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-floating-stepper-title')?.tagName).toBe('H3');
  });
});

describe('neoFloatingStepper — closable matrix', () => {
  it('closable=true (default) renders a close button somewhere', async () => {
    const { container } = render(Harness, { props: { steps } as never });
    await tick();
    expect(getCloseWrapper(container)).not.toBeNull();
  });

  it('closable=false omits the close button entirely', async () => {
    const { container } = render(Harness, { props: { steps, closable: false } as never });
    await tick();
    expect(getCloseWrapper(container)).toBeNull();
  });

  it('with header set, the close button is placed inside the header area', async () => {
    const { container } = render(Harness, { props: { steps, headerText: 'h' } as never });
    await tick();
    const header = container.querySelector<HTMLElement>('.neo-floating-stepper-header');
    expect(header?.querySelector('.neo-floating-stepper-close')).not.toBeNull();
  });

  it('with no header but progress=true (default), close button is rendered (in progress slot)', async () => {
    const { container } = render(Harness, { props: { steps } as never });
    await tick();
    // No header => not in header area
    expect(container.querySelector('.neo-floating-stepper-header')).toBeNull();
    // Should still exist (rendered in progressProps.after slot)
    expect(getCloseWrapper(container)).not.toBeNull();
  });

  it('with no header and progress=false, close button uses the inside slot variant', async () => {
    const { container } = render(Harness, { props: { steps, progress: false } as never });
    await tick();
    const closeWrapper = getCloseWrapper(container);
    expect(closeWrapper).not.toBeNull();
    expect(closeWrapper?.classList.contains('neo-inside')).toBe(true);
  });

  it('clicking the close button fires onClose and closeProps.onclick', async () => {
    const onClose = vi.fn();
    const closeOnClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, {
      props: { steps, onClose, closeProps: { onclick: closeOnClick } } as never,
    });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('.neo-floating-stepper-close button');
    expect(btn).not.toBeNull();
    await user.click(btn!);
    expect(closeOnClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(closeOnClick.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
  });
});

describe('neoFloatingStepper — navigation', () => {
  it('clicking Next on a non-final step calls onBeforeStep with reason="next"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { steps, onBeforeStep } as never });
    await tick();
    await user.click(findButton('Go to next step', container)!);
    await tick();
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('next');
  });

  it('clicking Cancel fires onCancel with reason="cancel"', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { steps, onCancel } as never });
    await tick();
    await user.click(findButton('Cancel stepper', container)!);
    await tick();
    expect(onCancel).toHaveBeenCalled();
    const lastCall = onCancel.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('cancel');
  });

  it('on a single-step stepper, clicking Next fires onConfirm with reason="next"', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { steps: [{ id: 'only' }], onConfirm } as never });
    await tick();
    await user.click(findButton('Go to next step', container)!);
    await tick();
    expect(onConfirm).toHaveBeenCalled();
    const lastCall = onConfirm.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('next');
  });

  it('on the last step, the next button label is "Confirm"', async () => {
    const { container } = render(Harness, { props: { steps, active: steps.length - 1 } as never });
    await tick();
    const next = findButton('Go to next step', container);
    expect(next?.textContent).toContain('Confirm');
  });

  it('on a non-last step, the next button label is "Next"', async () => {
    const { container } = render(Harness, { props: { steps, active: 0 } as never });
    await tick();
    const next = findButton('Go to next step', container);
    expect(next?.textContent).toContain('Next');
  });
});

describe('neoFloatingStepper — progress prop', () => {
  it('progress=true (default) renders a progress bar', async () => {
    const { container } = render(Harness, { props: { steps } as never });
    await tick();
    expect(container.querySelector('.neo-progress, .neo-stepper-progress')).not.toBeNull();
  });

  it('progress=false hides the progress bar', async () => {
    const { container } = render(Harness, { props: { steps, progress: false } as never });
    await tick();
    expect(container.querySelector('.neo-stepper-progress')).toBeNull();
  });
});
