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
  // The provider injects a <link id="neo-theme-provider"> sibling that survives
  // testing-library cleanup() if it was appended outside the testing container.
  document.querySelectorAll('#neo-theme-provider').forEach(node => node.remove());
  document.documentElement.removeAttribute(NeoThemeRoot);
});

/**
 * In jsdom, `<link rel="stylesheet">` never actually fetches and so the
 * "load" event is never dispatched. NeoThemeProvider gates rendering on
 * `context.ready === true`, which is only set by that event. Find the
 * provider's injected link and dispatch a synthetic load event.
 */
async function fireStylesheetLoad(): Promise<void> {
  await tick();
  const link = document.querySelector<HTMLLinkElement>('#neo-theme-provider');
  link?.dispatchEvent(new Event('load'));
  await tick();
}

describe('neoThemeProvider — host & lifecycle', { tags: ['jsdom'] }, () => {
  it('default tag=div renders the host element with .neo-theme-provider', async () => {
    const { container } = render(NeoThemeProviderHarness, { props: {} as never });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider');
    expect(host).not.toBeNull();
    expect(host?.tagName).toBe('DIV');
  });

  it('tag overrides the host element', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { tag: 'section' } as never,
    });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider');
    expect(host?.tagName).toBe('SECTION');
  });

  it('does not render children until the stylesheet load event fires (ready gate)', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { childrenLabel: 'kids' } as never,
    });
    await tick();
    expect(container.querySelector('[data-testid="provider-children"]')).toBeNull();
    await fireStylesheetLoad();
    expect(container.querySelector('[data-testid="provider-children"]')).not.toBeNull();
  });

  it('appends a stylesheet link with id="neo-theme-provider" on mount', async () => {
    render(NeoThemeProviderHarness, { props: {} as never });
    await tick();
    const link = document.querySelector<HTMLLinkElement>('#neo-theme-provider');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('rel')).toBe('stylesheet');
    expect(link?.getAttribute('type')).toBe('text/css');
  });

  it('forwards arbitrary attrs (data-testid, id) to the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { id: 'my-provider' } as never,
    });
    await fireStylesheetLoad();
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
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.hasAttribute(NeoThemeRoot)).toBe(true);
  });

  it('theme=light reflects neo-theme="light" on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { theme: NeoTheme.Light } as never,
    });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Light);
  });

  it('theme=dark reflects neo-theme="dark" on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { theme: NeoTheme.Dark } as never,
    });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Dark);
  });

  it('source reflects neo-source on the host', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { source: NeoSource.BottomRight } as never,
    });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.BottomRight);
  });

  it('reset=true sets the neo-reset attribute (no value)', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { reset: true } as never,
    });
    await fireStylesheetLoad();
    const host = container.querySelector<HTMLElement>('.neo-theme-provider')!;
    expect(host.hasAttribute(NeoThemeStorageKey.Reset)).toBe(true);
  });

  it('reset=false does not set the neo-reset attribute', async () => {
    const { container } = render(NeoThemeProviderHarness, {
      props: { reset: false } as never,
    });
    await fireStylesheetLoad();
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
    await fireStylesheetLoad();
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
    await fireStylesheetLoad();
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

  it('import() appends the stylesheet link as a sibling of the shadow host', () => {
    expect.assertions(2);
    const ctx = new NeoThemeProviderContext({ root: shadow });
    ctx.import();
    const link = hostEl.parentElement?.querySelector<HTMLLinkElement>('#neo-theme-provider');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('rel')).toBe('stylesheet');
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
