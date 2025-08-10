import type { Snippet } from 'svelte';

import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoRememberSelectorProps } from '~/providers/neo-remember-selector.model.js';
import type { NeoResetSelectorProps } from '~/providers/neo-reset-selector.model.js';
import type { NeoSourceSelectorProps } from '~/providers/neo-source-selector.model.js';
import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';
import type { NeoThemeSelectorProps } from '~/providers/neo-theme-selector.model.js';
import type { NeoTransitionSelectorProps } from '~/providers/neo-transition-selector.model.js';

export type NeoThemeSelectorsProps = {
  // Snippet

  /**
   * Any children to display in the theme selector.
   */
  children?: Snippet<[INeoThemeProviderContext]>;

  // State
  /**
   * Whether to show the dark/light theme button or not.
   */
  theme?: boolean;
  /**
   * The label to show in the theme selector.
   *
   * @default Theme
   */
  themeLabel?: NeoThemeSelectorProps['label'];
  /**
   * Whether to show the light source button or not.
   */
  source?: boolean;
  /**
   * The label to show in the source selector.
   *
   * @default Source
   */
  sourceLabel?: NeoSourceSelectorProps['label'];
  /**
   * Whether to show the reset style button or not.
   */
  reset?: boolean;
  /**
   * The label to show in the reset selector.
   *
   * @default Reset
   */
  resetLabel?: NeoResetSelectorProps['label'];
  /**
   * Whether to show the remember button or not.
   */
  remember?: boolean;
  /**
   * The label to show in the remember selector.
   *
   * @default Remember
   */
  rememberLabel?: NeoRememberSelectorProps['label'];
  /**
   * Which transition to use when changing the theme.
   */
  themeTransition?: boolean;
  /**
   * The label to show in the transition selector.
   *
   * @default Transition: <transition>
   */
  themeTransitionLabel?: NeoTransitionSelectorProps['label'];

  // Other Props

  /**
   * The props to pass to the reset button.
   */
  resetProps?: NeoResetSelectorProps;
  /**
   * The props to pass to the theme button.
   */
  themeProps?: NeoThemeSelectorProps;
  /**
   * The props to pass to the source button.
   */
  sourceProps?: NeoSourceSelectorProps;
  /**
   * The props to pass to the remember button.
   */
  rememberProps?: NeoRememberSelectorProps;
  /**
   * The props to pass to the transition button.
   */
  themeTransitionProps?: NeoTransitionSelectorProps;
} & Omit<NeoButtonGroupProps, 'children'>;
