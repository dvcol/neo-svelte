import { cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithPortalTarget } from '../../../test/helpers/render.js';
import Harness from './NeoRangeHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getContainer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-range-container');
}

function getHandles(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.neo-range-handle'));
}

function snapshot(): { value: string | undefined; lower: string | undefined; upper: string | undefined; array: string | undefined } {
  const c = getContainer();
  return {
    value: c?.dataset.value,
    lower: c?.dataset.lower,
    upper: c?.dataset.upper,
    array: c?.dataset.array,
  };
}

describe('neoRange — render', () => {
  it('renders the rail and a single handle for a number value', () => {
    renderWithPortalTarget(Harness, { value: 50 });
    const container = getContainer();
    expect(container).not.toBeNull();
    expect(container?.dataset.value).toBe('50');
    expect(container?.dataset.array).toBe('false');
    const handles = getHandles();
    expect(handles).toHaveLength(1);
    expect(handles[0].getAttribute('aria-label')).toBe('Drag to set value');
  });

  it('renders two handles for an array value (dual-handle)', () => {
    renderWithPortalTarget(Harness, { value: [10, 80] });
    const container = getContainer();
    expect(container?.dataset.array).toBe('true');
    expect(container?.dataset.lower).toBe('10');
    expect(container?.dataset.upper).toBe('80');
    const handles = getHandles();
    expect(handles).toHaveLength(2);
    expect(handles[0].getAttribute('aria-label')).toBe('Drag to set lower value');
    expect(handles[1].getAttribute('aria-label')).toBe('Drag to set upper value');
  });
});

describe('neoRange — clamping', () => {
  it('clamps an out-of-range scalar value into [min, max] on mount', async () => {
    renderWithPortalTarget(Harness, { value: 150, min: 0, max: 100 });
    await tick();
    expect(snapshot().value).toBe('100');
  });

  it('clamps a below-min scalar to min', async () => {
    renderWithPortalTarget(Harness, { value: -20, min: 10, max: 50 });
    await tick();
    expect(snapshot().value).toBe('10');
  });

  it('clamps an out-of-range tuple value', async () => {
    renderWithPortalTarget(Harness, { value: [-5, 120], min: 0, max: 100 });
    await tick();
    const s = snapshot();
    expect(s.lower).toBe('0');
    expect(s.upper).toBe('100');
  });
});

describe('neoRange — tooltips visibility', () => {
  it('does not render the value tooltip while focused when tooltips=false', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, tooltips: false });
    const [handle] = getHandles();
    handle.focus();
    await tick();
    expect(document.querySelector('.neo-range-value')).toBeNull();
  });

  it('renders the value tooltip while focused when tooltips=true (default)', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, tooltips: true });
    const [handle] = getHandles();
    handle.focus();
    await tick();
    expect(document.querySelector('.neo-range-value')).not.toBeNull();
  });
});

describe('neoRange — keyboard step', () => {
  it('arrowRight increments value by step', async () => {
    renderWithPortalTarget(Harness, { value: 10, min: 0, max: 100, step: 5 });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('15');
  });

  it('arrowLeft decrements value by step', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, step: 10 });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('40');
  });

  it('keyboard step does not push value past max', async () => {
    renderWithPortalTarget(Harness, { value: 100, min: 0, max: 100, step: 5 });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('100');
  });

  it('ignores non-arrow keys', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, step: 5 });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('50');
  });

  it('does not change value when readonly=true', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, step: 5, readonly: true });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('50');
  });

  it('does not change value when disabled=true', async () => {
    renderWithPortalTarget(Harness, { value: 50, min: 0, max: 100, step: 5, disabled: true });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('50');
  });

  it('disabled and readonly together still suppress keyboard step (composition)', async () => {
    renderWithPortalTarget(Harness, {
      value: 50,
      min: 0,
      max: 100,
      step: 5,
      disabled: true,
      readonly: true,
    });
    const [handle] = getHandles();
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(snapshot().value).toBe('50');
  });

  it('moves only the lower handle when ArrowRight is pressed on the lower thumb of a dual-handle range', async () => {
    renderWithPortalTarget(Harness, { value: [10, 80], min: 0, max: 100, step: 5 });
    const [lower, upper] = getHandles();
    expect(lower).toBeDefined();
    expect(upper).toBeDefined();
    lower.focus();
    lower.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    const s = snapshot();
    expect(s.lower).toBe('15');
    expect(s.upper).toBe('80');
  });
});
