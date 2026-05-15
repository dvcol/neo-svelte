/**
 * Returns the device pixel ratio of the window the element belongs to.
 * Falls back to `1` in non-browser environments (SSR) and on browsers that
 * report `0` for `devicePixelRatio`.
 *
 * Used to align floating-element coordinates to physical pixels — without
 * snapping, sub-pixel translates blur text and box edges on hi-DPI screens.
 */
export function getDevicePixelRatio(element: Element): number {
  if (typeof window === 'undefined') return 1;
  const win = element.ownerDocument.defaultView ?? window;
  return win.devicePixelRatio || 1;
}

/**
 * Rounds `value` to the nearest physical-pixel boundary in the element's
 * window. The DPR is read from the element's owner document so floating
 * elements rendered into a popout window snap to that window's pixel grid,
 * not the launching window's.
 */
export function roundByDevicePixelRatio(element: Element, value: number): number {
  const ratio = getDevicePixelRatio(element);
  return Math.round(value * ratio) / ratio;
}
