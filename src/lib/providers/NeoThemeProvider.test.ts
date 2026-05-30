import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NeoThemeProviderContext } from '~/providers/neo-theme-provider-context.svelte.js';
import {
  NeoSource,
  NeoTheme,
  NeoThemeRoot,
  NeoThemeStorageKey,
} from '~/providers/neo-theme-provider.model.js';

import NeoThemeProviderHarness from './NeoThemeProvider.test.svelte';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute(NeoThemeRoot);
  document.documentElement.removeAttribute(NeoThemeStorageKey.Reset);
  document.documentElement.removeAttribute(NeoThemeStorageKey.Theme);
  document.documentElement.removeAttribute(NeoThemeStorageKey.Source);
  document.documentElement.removeAttribute(NeoThemeStorageKey.Transition);
});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute(NeoThemeRoot);
});

describe('neoThemeProvider — host & lifecycle', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host element with .neo-theme-provider', async () => {
    const { container } = render(NeoThemeProviderHarness, { props: {} as never });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { tag: 'section' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider');
    expect(host?.tagName).toBe('SECTION');
  });

  it('renders children synchronously after mount (ready gate flips immediately)', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { childrenLabel: 'kids' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="provider-children"]')).not.toBeNull();
  });

  it('adopts a CSSStyleSheet onto document.adoptedStyleSheets on mount', async () => {
    render(NeoThemeProviderHarness, { props: {} as never });
    await tick();
    expect(document.adoptedStyleSheets.length).toBeGreaterThan(0);
    expect(document.adoptedStyleSheets.some(s => s instanceof CSSStyleSheet)).toBe(true);
  });

  it('forwards arbitrary attrs (data-testid, id) to the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { id: 'my-provider' } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('#my-provider');
    expect(host).not.toBeNull();
    expect(host?.getAttribute('data-testid')).toBe('theme-provider-host');
  });
});

describe('neoThemeProvider — applies theme attributes to host', { tags: ['jsdom'] }, () => {
  it('sets the neo-theme-root marker attribute on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { theme: NeoTheme.Light } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.hasAttribute(NeoThemeRoot)).toBe(true);
  });

  it('theme=light reflects neo-theme="light" on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { theme: NeoTheme.Light } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Light);
  });

  it('theme=dark reflects neo-theme="dark" on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { theme: NeoTheme.Dark } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Dark);
  });

  it('source reflects neo-source on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { source: NeoSource.BottomRight } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.BottomRight);
  });

  it('reset=true sets the neo-reset attribute (no value)', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { reset: true } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.hasAttribute(NeoThemeStorageKey.Reset)).toBe(true);
  });

  it('reset=false does not set the neo-reset attribute', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { reset: false } as never,
    });
    await tick();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.hasAttribute(NeoThemeStorageKey.Reset)).toBe(false);
  });
});

describe('neoThemeProvider — remember persists to localStorage', { tags: ['jsdom'] }, () => {
  it('remember=true mirrors theme/source/reset/transition into localStorage', async () => {
    render(NeoThemeProviderHarness, {
      props: {
        theme: NeoTheme.Dark,
        source: NeoSource.TopRight,
        reset: true,
        remember: true,
      } as never,
    });
    await tick();
    expect(localStorage.getItem(NeoThemeStorageKey.Remember)).toBe('true');
    expect(localStorage.getItem(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Dark);
    expect(localStorage.getItem(NeoThemeStorageKey.Source)).toBe(NeoSource.TopRight);
    expect(localStorage.getItem(NeoThemeStorageKey.Reset)).toBe('true');
  });

  it('remember=false clears theme/source/reset from localStorage', async () => {
    localStorage.setItem(NeoThemeStorageKey.Theme, NeoTheme.Dark);
    localStorage.setItem(NeoThemeStorageKey.Source, NeoSource.TopRight);
    localStorage.setItem(NeoThemeStorageKey.Reset, 'true');
    render(NeoThemeProviderHarness, {
      props: { remember: false, theme: NeoTheme.Light } as never,
    });
    await tick();
    expect(localStorage.getItem(NeoThemeStorageKey.Remember)).toBe('false');
    expect(localStorage.getItem(NeoThemeStorageKey.Theme)).toBeNull();
    expect(localStorage.getItem(NeoThemeStorageKey.Source)).toBeNull();
    expect(localStorage.getItem(NeoThemeStorageKey.Reset)).toBeNull();
  });
});

describe('neoThemeProvider — ShadowRoot target resolves to host', { tags: ['jsdom'] }, () => {
  let hostEl: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(() => {
    hostEl = document.createElement('div');
    document.body.appendChild(hostEl);
    shadow = hostEl.attachShadow({ mode: 'open' });
  });

  afterEach(() => {
    hostEl.remove();
  });

  it('exposes `host` getter returning the ShadowRoot host', () => {
    expect.assertions(2);
    const ctx = new NeoThemeProviderContext({ root: shadow });
    expect(ctx.root).toBe(shadow);
    expect(ctx.host).toBe(hostEl);
  });

  it('exposes `host` via `state`', () => {
    expect.assertions(1);
    const ctx = new NeoThemeProviderContext({ root: shadow });
    expect(ctx.state.host).toBe(hostEl);
  });

  it('sync() writes theme attributes onto the shadow host, not the ShadowRoot', () => {
    expect.assertions(3);
    const ctx = new NeoThemeProviderContext({ root: shadow, theme: NeoTheme.Dark, source: NeoSource.BottomRight });
    ctx.sync();
    expect(hostEl.hasAttribute(NeoThemeRoot)).toBe(true);
    expect(hostEl.getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Dark);
    expect(hostEl.getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.BottomRight);
  });

  it('import() adopts the stylesheet onto the ShadowRoot, not as a sibling of the host', () => {
    expect.assertions(3);
    const ctx = new NeoThemeProviderContext({ root: shadow });
    ctx.import();
    expect(shadow.adoptedStyleSheets.length).toBeGreaterThan(0);
    expect(shadow.adoptedStyleSheets[0]).toBeInstanceOf(CSSStyleSheet);
    // No <link> sibling leaks outside the shadow boundary.
    expect(hostEl.parentElement?.querySelector('link[rel="stylesheet"]')).toBeNull();
  });

  it('import() reuses the same sheet across instances on the same ShadowRoot', () => {
    expect.assertions(2);
    const ctx1 = new NeoThemeProviderContext({ root: shadow });
    ctx1.import();
    const initialLength = shadow.adoptedStyleSheets.length;
    const initialSheet = shadow.adoptedStyleSheets[0];
    const ctx2 = new NeoThemeProviderContext({ root: shadow });
    ctx2.import();
    expect(shadow.adoptedStyleSheets.length).toBe(initialLength);
    expect(shadow.adoptedStyleSheets[0]).toBe(initialSheet);
  });

  it('destroy() removes theme attributes from the shadow host', () => {
    expect.assertions(2);
    const ctx = new NeoThemeProviderContext({ root: shadow, theme: NeoTheme.Dark });
    ctx.sync();
    expect(hostEl.hasAttribute(NeoThemeRoot)).toBe(true);
    ctx.destroy();
    expect(hostEl.hasAttribute(NeoThemeRoot)).toBe(false);
  });
});
