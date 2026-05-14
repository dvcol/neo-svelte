/**
 * Real pointer drag — only valid in the browser project (real PointerEvents).
 * In jsdom, PointerEvent isn't dispatched the same way; tests that rely on
 * drag should run as `*.browser.test.ts`.
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
