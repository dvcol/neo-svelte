import { vi } from 'vitest';

export function mockMatchMedia(matches: boolean | ((query: string) => boolean) = false): () => void {
  const original = window.matchMedia;
  const resolve = (q: string): boolean => (typeof matches === 'function' ? matches(q) : matches);
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: resolve(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
  return () => {
    window.matchMedia = original;
  };
}

/**
 * Mocks `navigator.userAgent` so the `isSafari()` util in floating/menu
 * returns the desired value. Returns a cleanup callback.
 */
export function mockIsSafari(safari: boolean): () => void {
  const ua = safari
    ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const original = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
  return () => {
    if (original) Object.defineProperty(navigator, 'userAgent', original);
  };
}

export function mockLocalStorage(): { restore: () => void; storage: Record<string, string> } {
  const storage: Record<string, string> = {};
  const original = globalThis.localStorage;
  const stub: Storage = {
    get length(): number {
      return Object.keys(storage).length;
    },
    clear: () => {
      for (const key of Object.keys(storage)) delete storage[key];
    },
    getItem: (key: string) => (key in storage ? storage[key] : null),
    key: (idx: number) => Object.keys(storage)[idx] ?? null,
    removeItem: (key: string) => {
      delete storage[key];
    },
    setItem: (key: string, value: string) => {
      storage[key] = String(value);
    },
  };
  Object.defineProperty(globalThis, 'localStorage', { value: stub, configurable: true });
  return {
    storage,
    restore: () => {
      Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true });
    },
  };
}

export function fakeNotificationClock(): { tick: (ms: number) => Promise<void>; restore: () => void } {
  vi.useFakeTimers();
  return {
    tick: async (ms: number) => {
      await vi.advanceTimersByTimeAsync(ms);
    },
    restore: () => {
      vi.useRealTimers();
    },
  };
}

export function mockClipboard(): { writes: string[]; reads: string[]; restore: () => void } {
  const writes: string[] = [];
  const reads: string[] = [];
  const original = navigator.clipboard;
  const stub = {
    writeText: vi.fn(async (value: string) => {
      writes.push(value);
    }),
    readText: vi.fn(async () => {
      const value = reads.shift() ?? '';
      return value;
    }),
  };
  Object.defineProperty(navigator, 'clipboard', { value: stub, configurable: true });
  return {
    writes,
    reads,
    restore: () => {
      Object.defineProperty(navigator, 'clipboard', { value: original, configurable: true });
    },
  };
}
