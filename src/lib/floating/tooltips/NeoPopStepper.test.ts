import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Harness from './NeoPopStepper.test.svelte';

afterEach(() => {
  cleanup();
});

const steps = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];

function getStepper(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-floating-stepper');
}

function findButton(aria: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`button[aria-label="${aria}"]`);
}

describe('neoPopStepper — render', { tags: ['jsdom'] }, () => {
  it('renders the trigger element', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { steps });
    expect(getByTestId('trigger-button').textContent).toBe('open');
  });

  it('does not render the stepper until open', () => {
    renderWithPortalTarget(Harness, { steps });
    expect(getStepper()).toBeNull();
  });

  it('renders the stepper when open=true', async () => {
    renderWithPortalTarget(Harness, { steps, open: true });
    await tick();
    expect(getStepper()).not.toBeNull();
  });

  it('renders Cancel and Next stepper controls', async () => {
    renderWithPortalTarget(Harness, { steps, open: true });
    await tick();
    expect(findButton('Cancel stepper')).not.toBeNull();
    expect(findButton('Go to next step')).not.toBeNull();
  });
});

describe('neoPopStepper — navigation', { tags: ['jsdom'] }, () => {
  it('clicking Next on a non-final step calls onBeforeStep with reason="next"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { steps, open: true, onBeforeStep });
    await tick();
    const next = findButton('Go to next step')!;
    await user.click(next);
    await tick();
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('next');
  });

  it('clicking Cancel fires onCancel and closes the stepper', async () => {
    const onCancel = vi.fn();
    let openState = true;
    const onChange = (v: boolean): void => {
      openState = v;
    };
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      steps,
      open: true,
      onCancel,
      tooltipProps: { onChange },
    });
    await tick();
    const cancel = findButton('Cancel stepper')!;
    await user.click(cancel);
    await tick();
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(openState).toBe(false);
  });

  it('clicking Next on the last step fires onConfirm and closes the stepper', async () => {
    const onConfirm = vi.fn();
    let openState = true;
    const onChange = (v: boolean): void => {
      openState = v;
    };
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      steps,
      open: true,
      active: steps.length - 1,
      onConfirm,
      tooltipProps: { onChange },
    });
    await tick();
    const next = findButton('Go to next step')!;
    await user.click(next);
    await tick();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(openState).toBe(false);
  });
});

describe('neoPopStepper — closable', { tags: ['jsdom'] }, () => {
  it('renders a close button by default (closable defaults to true)', async () => {
    renderWithPortalTarget(Harness, { steps, open: true });
    await tick();
    expect(document.querySelector('.neo-floating-stepper-close')).not.toBeNull();
  });

  it('does not render a close button when closable=false', async () => {
    renderWithPortalTarget(Harness, { steps, open: true, closable: false });
    await tick();
    expect(document.querySelector('.neo-floating-stepper-close')).toBeNull();
  });

  it('escape closes the stepper when closable=true (closeOnDismiss=closable)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      steps,
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

  it('escape does NOT close the stepper when closable=false', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      steps,
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
