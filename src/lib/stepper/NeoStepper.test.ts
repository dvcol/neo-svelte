import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoStepperHarness from './NeoStepperHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleSteps = [
  { id: 's1', label: 'One' },
  { id: 's2', label: 'Two' },
  { id: 's3', label: 'Three' },
];

function getButton(scope: ParentNode, label: string): HTMLButtonElement {
  return scope.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
}

describe('neoStepper — render', () => {
  it('renders the stepper with .neo-stepper', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps } as never });
    await tick();
    expect(container.querySelector('.neo-stepper')).not.toBeNull();
  });

  it('renders the active step content via the children snippet', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, active: 1 } as never });
    await tick();
    expect(container.querySelector('.harness-step')?.textContent).toBe('step-Two');
  });

  it('progress=true (default) renders the inner progress bar', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps } as never });
    await tick();
    expect(container.querySelector('.neo-stepper-progress')).not.toBeNull();
    expect(container.querySelector('.neo-progress-bar')).not.toBeNull();
  });

  it('progress=false omits the progress bar', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, progress: false } as never });
    await tick();
    expect(container.querySelector('.neo-stepper-progress')).toBeNull();
  });

  it('marks=true (default) renders one progress mark per step', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps } as never });
    await tick();
    expect(container.querySelectorAll('.neo-progress-bar-mark')).toHaveLength(3);
  });

  it('marks=false omits the per-step progress marks', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, marks: false } as never });
    await tick();
    expect(container.querySelectorAll('.neo-progress-bar-mark')).toHaveLength(0);
  });

  it('controls=true (default) renders the controls bar', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps } as never });
    await tick();
    expect(container.querySelector('.neo-stepper-controls')).not.toBeNull();
  });

  it('controls=false omits the controls bar', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, controls: false } as never });
    await tick();
    expect(container.querySelector('.neo-stepper-controls')).toBeNull();
  });

  it('vertical=true adds .neo-vertical', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, vertical: true } as never });
    await tick();
    expect(container.querySelector('.neo-stepper.neo-vertical')).not.toBeNull();
  });

  it('omits the previous button on the first step (no loop)', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, active: 0 } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Go to previous step"]')).toBeNull();
  });

  it('renders the previous button when active>0', async () => {
    const { container } = render(NeoStepperHarness, { props: { steps: sampleSteps, active: 1 } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Go to previous step"]')).not.toBeNull();
  });

  it('loop=true shows previous button even on first step', async () => {
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 0, loop: true } as never,
    });
    await tick();
    expect(container.querySelector('button[aria-label="Go to previous step"]')).not.toBeNull();
  });

  it('cancel=false omits the cancel button', async () => {
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, cancel: false } as never,
    });
    await tick();
    expect(container.querySelector('button[aria-label="Cancel stepper"]')).toBeNull();
  });

  it('next button is disabled on the last step (no loop)', async () => {
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 2 } as never,
    });
    await tick();
    expect(getButton(container, 'Go to next step').disabled).toBe(true);
  });

  it('disabled=true disables all controls', async () => {
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 1, disabled: true } as never,
    });
    await tick();
    expect(getButton(container, 'Go to previous step').disabled).toBe(true);
    expect(getButton(container, 'Go to next step').disabled).toBe(true);
    expect(getButton(container, 'Cancel stepper').disabled).toBe(true);
  });
});

// NOTE: navigation assertions stop at the onBeforeStep callback. Asserting on
// rendered step content after navigation crashes the Svelte 5 runtime in jsdom
// with `[TypeError: get_fn(...) is not a function]` — the outgoing step's
// transition (NeoTransitionContainer + fly) is still resolving when its host
// effect tears down on the next render, and a `$derived` belonging to the
// destroyed effect gets read. Same root cause as the skipped multi-step test
// in NeoDialogStepper.test.ts:84-93. Asserting onBeforeStep fires with the
// expected reason still pins the navigation contract.
describe('neoStepper — navigation', () => {
  it('clicking next fires onBeforeStep with reason="next"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 0, onBeforeStep } as never,
    });
    await tick();
    await user.click(getButton(container, 'Go to next step'));
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('next');
  });

  it('clicking previous fires onBeforeStep with reason="previous"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    // loop=true keeps the previous button mounted at active=0; otherwise the
    // active=1→0 transition removes the previous-button block mid-flight and
    // triggers the same `get_fn` runtime crash.
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 1, loop: true, onBeforeStep } as never,
    });
    await tick();
    await user.click(getButton(container, 'Go to previous step'));
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('previous');
  });

  it('clicking cancel fires onBeforeStep with reason="cancel"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    // Single-step keeps cancel at index 0 → 0, avoiding the step-change render
    // path that triggers the `get_fn` runtime crash.
    const { container } = render(NeoStepperHarness, {
      props: { steps: [{ id: 's1', label: 'One' }], active: 0, onBeforeStep } as never,
    });
    await tick();
    await user.click(getButton(container, 'Cancel stepper'));
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('cancel');
  });

  it('clicking a progress mark fires onBeforeStep with reason="navigate"', async () => {
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoStepperHarness, {
      props: { steps: sampleSteps, active: 0, onBeforeStep } as never,
    });
    await tick();
    const marks = container.querySelectorAll<HTMLButtonElement>('.neo-progress-bar-mark > button');
    expect(marks.length).toBe(3);
    await user.click(marks[2]);
    expect(onBeforeStep).toHaveBeenCalled();
    const lastCall = onBeforeStep.mock.calls.at(-1) as [unknown, string?];
    expect(lastCall[1]).toBe('navigate');
  });

  it('disabled steps are not navigable via mark (onBeforeStep not called for that mark)', async () => {
    const steps = [
      { id: 's1', label: 'One' },
      { id: 's2', label: 'Two', disabled: true },
      { id: 's3', label: 'Three' },
    ];
    const onBeforeStep = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoStepperHarness, {
      props: { steps, active: 0, onBeforeStep } as never,
    });
    await tick();
    const marks = container.querySelectorAll<HTMLButtonElement>('.neo-progress-bar-mark > button');
    await user.click(marks[1]);
    expect(onBeforeStep).not.toHaveBeenCalled();
  });
});
