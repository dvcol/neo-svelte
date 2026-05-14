import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NeoThemeRoot, NeoThemeStorageKey } from '~/providers/neo-theme-provider.model.js';

import NeoThemeSelectorsHarness from './NeoThemeSelectorsHarness.test.svelte';

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

describe('neoThemeSelectors composite — visibility flags drive selector rendering', () => {
  it('default: only the theme selector is visible (theme defaults to true; others default to undefined)', async () => {
    const { container } = render(NeoThemeSelectorsHarness, { props: {} as never });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label$="theme"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Cycle light source origin"]')).toBeNull();
    expect(container.querySelector('button[aria-label$="style reset"]')).toBeNull();
    expect(container.querySelector('button[aria-label="Remember theme settings"]')).toBeNull();
    expect(container.querySelector('button[aria-label="Cycle theme transition"]')).toBeNull();
  });

  it('theme=false hides the theme selector even when others are on', async () => {
    const { container } = render(NeoThemeSelectorsHarness, {
      props: { theme: false, source: true, reset: true, remember: true, themeTransition: true } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelector('button[aria-label$="theme"]')).toBeNull();
    expect(container.querySelector('button[aria-label="Cycle light source origin"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label$="style reset"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Remember theme settings"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Cycle theme transition"]')).not.toBeNull();
  });

  it('all flags on — five selector buttons render', async () => {
    const { container } = render(NeoThemeSelectorsHarness, {
      props: { theme: true, source: true, reset: true, remember: true, themeTransition: true } as never,
    });
    await fireStylesheetLoad();
    expect(container.querySelectorAll('button').length).toBeGreaterThanOrEqual(5);
  });

  it('forwards labels to each selector', async () => {
    const { container } = render(NeoThemeSelectorsHarness, {
      props: {
        theme: true,
        source: true,
        reset: true,
        remember: true,
        themeTransition: true,
        themeLabel: 'L-Theme',
        sourceLabel: 'L-Source',
        resetLabel: 'L-Reset',
        rememberLabel: 'L-Remember',
        themeTransitionLabel: 'L-Trans',
      } as never,
    });
    await fireStylesheetLoad();
    const buttonText = Array.from(container.querySelectorAll('button')).map(b => b.textContent?.trim()).join(' | ');
    expect(buttonText).toContain('L-Theme');
    expect(buttonText).toContain('L-Source');
    expect(buttonText).toContain('L-Reset');
    expect(buttonText).toContain('L-Remember');
    expect(buttonText).toContain('L-Trans');
  });
});
