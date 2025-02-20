import type { Snippet } from 'svelte';
import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

export type NeoThemeSelectorProps = {
  // Snippet

  /**
   * Any children to display in the theme selector.
   */
  children?: Snippet<[INeoThemeProviderContext]>;

  // State
  /**
   * Whether to show the reset style button or not.
   */
  reset?: boolean;
  /**
   * Whether to show the dark/light theme button or not.
   */
  theme?: boolean;
  /**
   * The label to show in the theme selector.
   *
   * @default Theme
   */
  themeLabel?: string;
  /**
   * Whether to show the light source button or not.
   */
  source?: boolean;
  /**
   * The label to show in the source selector.
   *
   * @default Source
   */
  sourceLabel?: string;
  /**
   * Whether to show the remember button or not.
   */
  remember?: boolean;

  // Other Props

  /**
   * The props to pass to the reset button.
   */
  resetProps?: NeoButtonProps;
  /**
   * The props to pass to the theme button.
   */
  themeProps?: NeoButtonProps;
  /**
   * The props to pass to the source button.
   */
  sourceProps?: NeoButtonProps;
  /**
   * The props to pass to the remember button.
   */
  rememberProps?: NeoButtonProps;
} & Omit<NeoButtonGroupProps, 'children'>;
