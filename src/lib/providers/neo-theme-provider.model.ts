import { type Snippet } from 'svelte';

export const NeoTheme = {
  Light: 'light' as const,
  Dark: 'dark' as const,
} as const;

export type NeoThemes = (typeof NeoTheme)[keyof typeof NeoTheme];

export const NeoSource = {
  TopLeft: 'top-left' as const,
  TopRight: 'top-right' as const,
  BottomRight: 'bottom-right' as const,
  BottomLeft: 'bottom-left' as const,
} as const;

export type NeoSources = (typeof NeoSource)[keyof typeof NeoSource];

export type INeoThemeProviderContext = {
  readonly theme: NeoThemes;
  readonly source: NeoSources;
  readonly remember: boolean;
  readonly root?: HTMLElement | ShadowRoot;
};

export type NeoThemeProviderProps = {
  // Snippets

  children?: Snippet<[INeoThemeProviderContext]>;

  // States

  theme?: NeoThemes;
  source?: NeoSources;
  remember?: boolean;
  target?: HTMLElement | ShadowRoot | (() => HTMLElement | ShadowRoot);
};

export const NeoThemeRoot = 'neo-theme-root';
export const NeoThemeKey = 'neo-theme';
export const NeoSourceKey = 'neo-source';

export const getSavedTheme = () => localStorage?.getItem(NeoThemeKey) as NeoThemes | null;
export const getPreferTheme = (): NeoThemes => (window.matchMedia('(prefers-color-scheme: dark)').matches ? NeoTheme.Dark : NeoTheme.Light);
export const getTheme = () => getSavedTheme() ?? getPreferTheme();

export const getSavedSource = () => localStorage?.getItem(NeoSourceKey) as NeoSources | null;
export const getSource = () => getSavedSource() ?? NeoSource.TopLeft;

export const hasSaved = () => !!getSavedTheme() || !!getSavedSource();
