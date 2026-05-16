import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  NeoTheme,
  NeoThemeRoot,
  NeoThemeStorageKey,
} from '~/providers/neo-theme-provider.model.js';

import Harness from './NeoThemePicker.test.svelte';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute(NeoThemeRoot);
  document.documentElement.removeAttribute(NeoThemeStorageKey.Theme);
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
  return container.querySelector<HTMLElement>('[data-testid="theme-picker-host"]')!;
}

function colorInputs(container: ParentNode): HTMLInputElement[] {
  return Array.from(container.querySelectorAll<HTMLInputElement>('input.neo-color-picker[type="color"]'));
}

describe('neoThemePicker — render', { tags: ['jsdom'] }, () => {
  it('renders two reset buttons (background + text) and two color inputs', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Light } as never });
    await fireStylesheetLoad();
    const resetBg = container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme background color to default"]');
    const resetText = container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme text color to default"]');
    expect(resetBg).not.toBeNull();
    expect(resetText).not.toBeNull();
    expect(colorInputs(container).length).toBe(2);
  });

  it('honors labelBackground / labelText props on the reset buttons', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Light, labelBackground: 'Bg!', labelText: 'Tx!' } as never });
    await fireStylesheetLoad();
    const resetBg = container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme background color to default"]')!;
    const resetText = container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme text color to default"]')!;
    expect(resetBg.textContent).toContain('Bg!');
    expect(resetText.textContent).toContain('Tx!');
  });

  it('rounded=true propagates to the color picker inputs', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Light, rounded: true } as never });
    await fireStylesheetLoad();
    for (const input of colorInputs(container)) {
      expect(input.classList.contains('neo-rounded')).toBe(true);
    }
  });
});

describe('neoThemePicker — light theme writes light vars', { tags: ['jsdom'] }, () => {
  it('changing background sets --neo-background-color on the host', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Light } as never });
    await fireStylesheetLoad();
    const [bgInput] = colorInputs(container);
    bgInput.value = '#abcdef';
    await fireEvent.input(bgInput);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-background-color')).toBe('#abcdef');
    expect(host(container).style.getPropertyValue('--neo-dark-background-color')).toBe('');
  });

  it('changing text sets --neo-text-color on the host', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Light } as never });
    await fireStylesheetLoad();
    const [, textInput] = colorInputs(container);
    textInput.value = '#112233';
    await fireEvent.input(textInput);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-text-color')).toBe('#112233');
    expect(host(container).style.getPropertyValue('--neo-dark-text-color')).toBe('');
  });
});

describe('neoThemePicker — dark theme writes dark vars', { tags: ['jsdom'] }, () => {
  it('changing background sets --neo-dark-background-color on the host', async () => {
    const { container } = render(Harness, { props: { theme: NeoTheme.Dark } as never });
    await fireStylesheetLoad();
    const [bgInput] = colorInputs(container);
    bgInput.value = '#222222';
    await fireEvent.input(bgInput);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-dark-background-color')).toBe('#222222');
    expect(host(container).style.getPropertyValue('--neo-background-color')).toBe('');
  });
});

describe('neoThemePicker — reset clears vars', { tags: ['jsdom'] }, () => {
  it('clicking "Reset background" removes --neo-background-color', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { theme: NeoTheme.Light } as never });
    await fireStylesheetLoad();
    const [bgInput] = colorInputs(container);
    bgInput.value = '#abcdef';
    await fireEvent.input(bgInput);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-background-color')).toBe('#abcdef');
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme background color to default"]')!);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-background-color')).toBe('');
  });

  it('clicking "Reset text" removes --neo-text-color', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { theme: NeoTheme.Light } as never });
    await fireStylesheetLoad();
    const [, textInput] = colorInputs(container);
    textInput.value = '#332211';
    await fireEvent.input(textInput);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-text-color')).toBe('#332211');
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Reset theme text color to default"]')!);
    await tick();
    expect(host(container).style.getPropertyValue('--neo-text-color')).toBe('');
  });
});
