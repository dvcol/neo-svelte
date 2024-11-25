import type { Snippet } from 'svelte';
import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

export type NeoThemeSelectorProps = {
  // Snippet
  children: Snippet<[INeoThemeProviderContext]>;
} & Omit<NeoButtonGroupProps, 'children'>;
