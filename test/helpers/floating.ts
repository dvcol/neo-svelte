import { vi } from 'vitest';

/**
 * Wait until the floating element has been positioned (post-rAF).
 * In browser project, polls `getBoundingClientRect()` until it stabilizes.
 * In jsdom, just yields one microtask + one rAF tick.
 */
export async function waitForFloatingPosition(el: HTMLElement, opts: { timeout?: number } = {}): Promise<void> {
  const timeout = opts.timeout ?? 1000;
  if (typeof requestAnimationFrame !== 'undefined') {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  let last = el.getBoundingClientRect();
  await vi.waitFor(
    () => {
      const next = el.getBoundingClientRect();
      const stable = Math.abs(next.top - last.top) < 0.5 && Math.abs(next.left - last.left) < 0.5;
      last = next;
      if (!stable) throw new Error('not stable yet');
    },
    { timeout, interval: 16 },
  );
}

/**
 * Like `waitForFloatingPosition`, but also asserts the rect is non-zero. The
 * existing helper treats an unmounted/0×0 element as "stable", which masks
 * positioning regressions where the floating element renders but never receives
 * a layout pass. Use this for tests that assert the rect itself.
 */
export async function waitForStableFloating(
  el: HTMLElement,
  opts: { timeout?: number; minWidth?: number; minHeight?: number } = {},
): Promise<void> {
  const timeout = opts.timeout ?? 1000;
  const minWidth = opts.minWidth ?? 1;
  const minHeight = opts.minHeight ?? 1;
  if (typeof requestAnimationFrame !== 'undefined') {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  let last = el.getBoundingClientRect();
  await vi.waitFor(
    () => {
      const next = el.getBoundingClientRect();
      const stable = Math.abs(next.top - last.top) < 0.5 && Math.abs(next.left - last.left) < 0.5;
      const sized = next.width >= minWidth && next.height >= minHeight;
      last = next;
      if (!stable) throw new Error('not stable yet');
      if (!sized) throw new Error(`floating rect too small: ${next.width}x${next.height}`);
    },
    { timeout, interval: 16 },
  );
}

export function getRectAt(el: HTMLElement): DOMRect {
  return el.getBoundingClientRect();
}

export function getPlacement(el: HTMLElement): string | null {
  return el.getAttribute('data-placement');
}

/**
 * Asserts the floating rect is on the expected side of the reference rect.
 * Uses center coordinates so anchor/arrow offsets don't break the comparison.
 */
export function expectSide(reference: HTMLElement, floating: HTMLElement, side: 'top' | 'bottom' | 'left' | 'right'): void {
  const ref = reference.getBoundingClientRect();
  const flo = floating.getBoundingClientRect();
  const refCx = ref.left + ref.width / 2;
  const refCy = ref.top + ref.height / 2;
  const floCx = flo.left + flo.width / 2;
  const floCy = flo.top + flo.height / 2;
  switch (side) {
    case 'top':
      if (!(floCy < refCy)) throw new Error(`expected floating above reference, got ${floCy} vs ${refCy}`);
      break;
    case 'bottom':
      if (!(floCy > refCy)) throw new Error(`expected floating below reference, got ${floCy} vs ${refCy}`);
      break;
    case 'left':
      if (!(floCx < refCx)) throw new Error(`expected floating left of reference, got ${floCx} vs ${refCx}`);
      break;
    case 'right':
      if (!(floCx > refCx)) throw new Error(`expected floating right of reference, got ${floCx} vs ${refCx}`);
      break;
  }
}
