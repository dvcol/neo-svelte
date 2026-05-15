import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  NeoSource,
  NeoTheme,
  NeoThemeRoot,
  NeoThemeStorageKey,
} from '~/providers/neo-theme-provider.model.js';

import NeoSelectorsHarness from './NeoThemeSelectors.test.svelte';

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
  document.querySelectorAll('#neo-theme-provider').forEach(node => node.remove());
  document.documentElement.removeAttribute(NeoThemeRoot);
});

async function fireStylesheetLoad(): Promise<void> {
  await tick();
  const link = document.querySelector<HTMLLinkElement>('#neo-theme-provider');
  link?.dispatchEvent(new Event('load'));
  await tick();
}

function host(container: ParentNode): HTMLElement {
  return container.querySelector<HTMLElement>('[data-testid="selectors-provider-host"]')!;
}

describe('neoThemeSelector — render & toggle', { tags: ['jsdom'] }, () => {
  it('renders a button labelled "Toggle dark theme" when current theme is light', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        theme: NeoTheme.Light,
        showTheme: true,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Toggle dark theme"]');
    expect(btn).not.toBeNull();
  });

  it('clicking the theme selector toggles the host\'s neo-theme attribute light → dark', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSelectorsHarness, {
      props: {
        theme: NeoTheme.Light,
        showTheme: true,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(host(container).getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Light);
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Toggle dark theme"]')!);
    await tick();
    expect(host(container).getAttribute(NeoThemeStorageKey.Theme)).toBe(NeoTheme.Dark);
    // Button label flips after the toggle
    expect(container.querySelector('button[aria-label="Toggle light theme"]')).not.toBeNull();
  });

  it('respects label prop override on the rendered button', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        theme: NeoTheme.Light,
        themeLabel: 'CustomTheme',
        showTheme: true,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Toggle dark theme"]')!;
    expect(btn.textContent).toContain('CustomTheme');
  });
});

describe('neoSourceSelector — cycles through sources', { tags: ['jsdom'] }, () => {
  it('renders a "Cycle light source origin" button', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        source: NeoSource.TopLeft,
        showTheme: false,
        showSource: true,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label="Cycle light source origin"]')).not.toBeNull();
  });

  it('clicking advances source through TopLeft → TopRight → BottomRight → BottomLeft → TopLeft', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSelectorsHarness, {
      props: {
        source: NeoSource.TopLeft,
        showTheme: false,
        showSource: true,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Cycle light source origin"]')!;

    expect(host(container).getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.TopLeft);
    await user.click(btn);
    await tick();
    expect(host(container).getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.TopRight);
    await user.click(btn);
    await tick();
    expect(host(container).getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.BottomRight);
    await user.click(btn);
    await tick();
    expect(host(container).getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.BottomLeft);
    await user.click(btn);
    await tick();
    expect(host(container).getAttribute(NeoThemeStorageKey.Source)).toBe(NeoSource.TopLeft);
  });
});

describe('neoResetSelector — toggles reset', { tags: ['jsdom'] }, () => {
  it('renders "Toggle on style reset" when reset=false initially', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        reset: false,
        showTheme: false,
        showSource: false,
        showReset: true,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label="Toggle on style reset"]')).not.toBeNull();
  });

  it('renders "Toggle off style reset" and host has neo-reset when reset=true', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        reset: true,
        showTheme: false,
        showSource: false,
        showReset: true,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label="Toggle off style reset"]')).not.toBeNull();
    expect(host(container).hasAttribute(NeoThemeStorageKey.Reset)).toBe(true);
  });

  it('clicking flips reset state and aria-label flips accordingly', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSelectorsHarness, {
      props: {
        reset: false,
        showTheme: false,
        showSource: false,
        showReset: true,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(host(container).hasAttribute(NeoThemeStorageKey.Reset)).toBe(false);
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Toggle on style reset"]')!);
    await tick();
    expect(host(container).hasAttribute(NeoThemeStorageKey.Reset)).toBe(true);
    expect(container.querySelector('button[aria-label="Toggle off style reset"]')).not.toBeNull();
  });
});

describe('neoRememberSelector — toggles localStorage persistence', { tags: ['jsdom'] }, () => {
  it('renders the Remember button with the correct aria-label', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        remember: true,
        showTheme: false,
        showSource: false,
        showReset: false,
        showRemember: true,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label="Remember theme settings"]')).not.toBeNull();
  });

  it('clicking flips remember and the localStorage neo-remember mirror updates', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSelectorsHarness, {
      props: {
        remember: true,
        theme: NeoTheme.Light,
        showTheme: false,
        showSource: false,
        showReset: false,
        showRemember: true,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(localStorage.getItem(NeoThemeStorageKey.Remember)).toBe('true');
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Remember theme settings"]')!);
    await tick();
    expect(localStorage.getItem(NeoThemeStorageKey.Remember)).toBe('false');
    // remember=false also clears the persisted theme entries
    expect(localStorage.getItem(NeoThemeStorageKey.Theme)).toBeNull();
  });
});

describe('neoTransitionSelector — cycles through transitions', { tags: ['jsdom'] }, () => {
  it('renders the Cycle theme transition button', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        showTheme: false,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: true,
      } as never,
    });
    await fireStylesheetLoad();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Cycle theme transition"]');
    expect(btn).not.toBeNull();
    // default getTransition() is 'none'
    expect(btn?.getAttribute('title')).toBe('Cycle theme transition - none');
  });

  it('clicking advances title through none → spin → wave → circle → none', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoSelectorsHarness, {
      props: {
        showTheme: false,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: true,
      } as never,
    });
    await fireStylesheetLoad();
    const findBtn = () => container.querySelector<HTMLButtonElement>('button[aria-label="Cycle theme transition"]')!;
    expect(findBtn().getAttribute('title')).toBe('Cycle theme transition - none');
    await user.click(findBtn());
    await tick();
    expect(findBtn().getAttribute('title')).toBe('Cycle theme transition - neo-spin');
    await user.click(findBtn());
    await tick();
    expect(findBtn().getAttribute('title')).toBe('Cycle theme transition - neo-wave');
    await user.click(findBtn());
    await tick();
    expect(findBtn().getAttribute('title')).toBe('Cycle theme transition - neo-circle');
    await user.click(findBtn());
    await tick();
    expect(findBtn().getAttribute('title')).toBe('Cycle theme transition - none');
  });
});

describe('neoThemeSelectors composite — visibility flags', { tags: ['jsdom'] }, () => {
  it('all selector flags off — only the harness renders no selector buttons', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        showTheme: false,
        showSource: false,
        showReset: false,
        showRemember: false,
        showTransition: false,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelectorAll('button').length).toBe(0);
  });

  it('all selector flags on — all five selector buttons render', async () => {
    const { container } = render(NeoSelectorsHarness, {
      props: {
        showTheme: true,
        showSource: true,
        showReset: true,
        showRemember: true,
        showTransition: true,
      } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label^="Toggle"][aria-label$="theme"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Cycle light source origin"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label^="Toggle"][aria-label$="style reset"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Remember theme settings"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Cycle theme transition"]')).not.toBeNull();
  });
});
