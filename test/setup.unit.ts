import { vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  class StubIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly scrollMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = StubIntersectionObserver;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  class StubResizeObserver implements ResizeObserver {
    constructor(_cb: ResizeObserverCallback) {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = StubResizeObserver;
}

if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  globalThis.cancelAnimationFrame = (id: number): void => clearTimeout(id);
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView(): void {};
}

if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.show) {
    HTMLDialogElement.prototype.show = function show(): void {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal(): void {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close(returnValue?: string): void {
      if (returnValue !== undefined) this.returnValue = returnValue;
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
}

if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = function animate(): Animation {
    const stub = {
      cancel: () => {},
      finish: () => {},
      pause: () => {},
      play: () => {},
      reverse: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      onfinish: null,
      oncancel: null,
      onremove: null,
      currentTime: 0,
      effect: null,
      id: '',
      pending: false,
      playState: 'finished' as AnimationPlayState,
      playbackRate: 1,
      replaceState: 'active' as AnimationReplaceState,
      startTime: 0,
      timeline: null,
      commitStyles: () => {},
      persist: () => {},
      updatePlaybackRate: () => {},
    };
    return stub as unknown as Animation;
  };
}

/**
 * jsdom does not implement Constructable Stylesheets / `adoptedStyleSheets`.
 * Provide a minimal stub so consumers that adopt sheets onto Document or
 * ShadowRoot can run under unit tests.
 */
if (typeof globalThis.CSSStyleSheet !== 'undefined' && !('replaceSync' in CSSStyleSheet.prototype)) {
  class StubCSSStyleSheet {
    cssRules: CSSRule[] = [];
    replaceSync(_text: string): void {}
    async replace(_text: string): Promise<this> {
      return this;
    }
  }
  globalThis.CSSStyleSheet = StubCSSStyleSheet as unknown as typeof CSSStyleSheet;
}
function installAdoptedStyleSheets(target: object | undefined): void {
  if (!target) return;
  if ('adoptedStyleSheets' in target) return;
  const store = new WeakMap<object, CSSStyleSheet[]>();
  Object.defineProperty(target, 'adoptedStyleSheets', {
    configurable: true,
    get(this: object) {
      return store.get(this) ?? [];
    },
    set(this: object, value: CSSStyleSheet[]) {
      store.set(this, [...value]);
    },
  });
}
installAdoptedStyleSheets((globalThis as { Document?: { prototype: object } }).Document?.prototype);
installAdoptedStyleSheets((globalThis as { ShadowRoot?: { prototype: object } }).ShadowRoot?.prototype);

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}
