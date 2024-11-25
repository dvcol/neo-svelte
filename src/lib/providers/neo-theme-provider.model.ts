import { type Snippet } from 'svelte';

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

export type INeoThemeProviderContext = {
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
   * If the theme and source are stored in local-storage
   */
  readonly remember: boolean;
  /**
   * The target to which scope the theme variables
   */
  readonly root?: HTMLElement | ShadowRoot;
};

export type NeoThemeProviderProps = {
  // Snippets

  /**
   * Child element to wrap in the theme context.
   */
  children?: Snippet<[INeoThemeProviderContext]>;

  // States

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
   * To store the last used source & theme in local storage (if available)
   *
   * @default false
   */
  remember?: boolean;
  /**
   * The target to which scope the theme variables
   *
   * @default document.documentElement
   */
  target?: HTMLElement | ShadowRoot | (() => HTMLElement | ShadowRoot);
};

export const NeoThemeRoot = 'neo-theme-root';
export const NeoThemeReset = 'neo-reset';
export const NeoThemeKey = 'neo-theme';
export const NeoSourceKey = 'neo-source';

export const getSavedTheme = () => localStorage?.getItem(NeoThemeKey) as NeoThemes | null;
export const getPreferTheme = (): NeoThemes => (window.matchMedia('(prefers-color-scheme: dark)').matches ? NeoTheme.Dark : NeoTheme.Light);
export const getTheme = () => getSavedTheme() ?? getPreferTheme();

export const getSavedSource = () => localStorage?.getItem(NeoSourceKey) as NeoSources | null;
export const getSource = () => getSavedSource() ?? NeoSource.TopLeft;

export const hasSaved = () => !!getSavedTheme() || !!getSavedSource();
