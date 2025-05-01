import type { Snippet } from 'svelte';

import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

/**
 * The active theme (`dark` or `light`)
 */
export const NeoTheme = {
  Light: 'light' as const,
  Dark: 'dark' as const,
} as const;

export type NeoThemes = (typeof NeoTheme)[keyof typeof NeoTheme];

/**
 * The light source to simulate shadows
 */
export const NeoSource = {
  TopLeft: 'top-left' as const,
  TopRight: 'top-right' as const,
  BottomRight: 'bottom-right' as const,
  BottomLeft: 'bottom-left' as const,
} as const;

export type NeoSources = (typeof NeoSource)[keyof typeof NeoSource];

export interface INeoThemeProviderContext {
  /**
   * If styles have finished loading.
   */
  readonly ready?: boolean;
  /**
   * If a style reset is applied.
   */
  readonly reset?: boolean;
  /**
   * The active theme (`dark` or `light`)
   */
  readonly theme: NeoThemes;
  /**
   * The active light source to simulate shadows
   */
  readonly source: NeoSources;
  /**
   * If the reset, theme and source are stored in local-storage
   */
  readonly remember: boolean;
  /**
   * The target to which scope the theme variables
   */
  readonly root?: HTMLElement | ShadowRoot;
}

export interface NeoThemeProviderProps<Tag extends keyof HTMLElementTagNameMap = 'div'> extends Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'> {
  // Snippets

  /**
   * Child element to wrap in the theme context.
   */
  children?: Snippet<[INeoThemeProviderContext]>;

  // States

  /**
   * The HTML reference to the inner element when target is `self`.
   * @see target
   */
  ref?: HTMLElement;
  /**
   * The HTML tag to use for the container.
   * @default 'div'
   */
  tag?: Tag;
  /**
   * If `true`, injects a css reset for common styling.
   */
  reset?: boolean;
  /**
   * Enforce `dark` or `light` theme.
   *
   * @default prefers-color-scheme
   */
  theme?: NeoThemes;
  /**
   * The light source to simulate shadows
   *
   * @default top-left
   */
  source?: NeoSources;
  /**
   * To store the last used reset & theme & source in local storage (if available)
   *
   * @default true
   */
  remember?: boolean;
  /**
   * The target to which scope the theme variables
   *
   * @default document.documentElement
   */
  target?: 'self' | HTMLElement | ShadowRoot | (() => HTMLElement | ShadowRoot);
}

export const NeoThemeRoot = 'neo-theme-root';

export const NeoThemeStorageKey: Record<string, `neo-${keyof INeoThemeProviderContext | 'transition'}`> = {
  Reset: 'neo-reset' as const,
  Theme: 'neo-theme' as const,
  Source: 'neo-source' as const,
  Remember: 'neo-remember' as const,
  Transition: 'neo-transition' as const,
} as const;

export type NeoThemeStorageKeys = (typeof NeoThemeStorageKey)[keyof typeof NeoThemeStorageKey];

export const getSavedTheme = () => localStorage?.getItem(NeoThemeStorageKey.Theme) as NeoThemes | null;
export const getPreferTheme = (): NeoThemes => (window.matchMedia('(prefers-color-scheme: dark)').matches ? NeoTheme.Dark : NeoTheme.Light);
export const getTheme = () => getSavedTheme() ?? getPreferTheme();

export const getSavedSource = () => localStorage?.getItem(NeoThemeStorageKey.Source) as NeoSources | null;
export const getSource = () => getSavedSource() ?? NeoSource.TopLeft;

function getBoolean(str?: string | null, fallback: boolean = false): boolean {
  // If saved reset is always truthy as it is a string
  if (!str) return fallback;
  return str === 'true';
}

export const getSavedReset = () => localStorage?.getItem(NeoThemeStorageKey.Reset);
export const getReset = () => getBoolean(getSavedReset(), true);

export const getSavedRemember = () => localStorage?.getItem(NeoThemeStorageKey.Remember);
export const getRemember = () => getBoolean(getSavedRemember(), true);
