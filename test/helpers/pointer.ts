import { cdp } from 'vitest/browser';

/**
 * Real pointer drag via synthetic PointerEvents — only valid in the browser
 * project. Suitable for handlers that read pointer events directly. NOT
 * suitable for libraries that call `setPointerCapture` (e.g. @dnd-kit): a
 * synthetic pointerId was never a real active pointer, so capture throws and
 * the drag aborts. Use {@link cdpDragBy} for those.
 */
export async function dragBy(
  el: HTMLElement,
  delta: { x?: number; y?: number },
  opts: { steps?: number; pointerId?: number } = {},
): Promise<void> {
  const steps = opts.steps ?? 5;
  const pointerId = opts.pointerId ?? 1;
  const rect = el.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  const dx = delta.x ?? 0;
  const dy = delta.y ?? 0;

  el.dispatchEvent(new PointerEvent('pointerdown', { pointerId, clientX: startX, clientY: startY, bubbles: true, cancelable: true }));

  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const cx = startX + dx * t;
    const cy = startY + dy * t;
    el.dispatchEvent(new PointerEvent('pointermove', { pointerId, clientX: cx, clientY: cy, bubbles: true }));
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
  }

  el.dispatchEvent(new PointerEvent('pointerup', { pointerId, clientX: startX + dx, clientY: startY + dy, bubbles: true }));
}

/**
 * Real pointer drag via the Chrome DevTools Protocol (`Input.dispatchMouseEvent`).
 * Unlike {@link dragBy}, these are genuine browser pointer events, so
 * `setPointerCapture` succeeds and distance/collision-based drag libraries
 * (@dnd-kit) activate correctly. Browser project only.
 *
 * Drags from the centre of `el` by the given delta, in `steps` real moves with
 * a short delay between each so move/over listeners and rAF-batched layout keep
 * up. A trailing settle delay lets the drop animation/commit flush.
 */
export async function cdpDragBy(
  el: HTMLElement,
  delta: { x?: number; y?: number },
  opts: { steps?: number; stepDelay?: number; settle?: number } = {},
): Promise<void> {
  const steps = opts.steps ?? 12;
  const stepDelay = opts.stepDelay ?? 20;
  const settle = opts.settle ?? 300;
  const rect = el.getBoundingClientRect();
  const sx = rect.left + rect.width / 2;
  const sy = rect.top + rect.height / 2;
  const dx = delta.x ?? 0;
  const dy = delta.y ?? 0;

  // CDPSession is typed opaquely (`{}`) by vitest; `.send` is the Playwright CDP API.
  const session = cdp() as unknown as { send: (method: string, params: Record<string, unknown>) => Promise<unknown> };
  const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  await session.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: sx, y: sy, button: 'left', buttons: 1, clickCount: 1 });
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: sx + dx * t, y: sy + dy * t, button: 'left', buttons: 1 });
    await wait(stepDelay);
  }
  await session.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: sx + dx, y: sy + dy, button: 'left', buttons: 0, clickCount: 1 });
  await wait(settle);
}
