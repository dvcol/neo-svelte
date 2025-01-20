import type { Snippet } from 'svelte';
import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { INeoThemeProviderContext } from '~/providers/neo-theme-provider.model.js';

export type NeoThemePickerProps = {
  // Snippet

  children?: Snippet<[INeoThemeProviderContext]>;

  /**
   * The label to show in the background picker.
   *
   * @default Background
   */
  labelBackground?: string;
  /**
   * The label to show in the text selector.
   *
   * @default Text
   */
  labelText?: string;
} & Omit<NeoButtonGroupProps, 'children'>;
