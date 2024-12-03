import type { Snippet } from 'svelte';
import type { NeoInputHTMLElement, NeoInputProps } from '~/inputs/neo-input.model.js';
import type { NeoValidationFieldContext, NeoValidationState } from '~/inputs/neo-validation.model.js';

export type NeoPinProps = {
  // Snippets
  /**
   * A snippet to display as the group separator.
   */
  icon?: Snippet;

  // State
  /**
   * If true, the input will be displayed as a password input.
   */
  password?: boolean;

  // Styles
  /**
   * The number of groups to display.
   */
  groups?: number;
  /**
   * The number of characters in each group.
   */
  count?: number;
  /**
   * The separator character to use between groups and inserted into value.
   * If `true`, the default separator will be used.
   * If `false`, no separator will be used.
   */
  separator?: boolean | string;
  /**
   * If true, groups will be stacked vertically.
   * @default true if `groups` is greater than 1, false otherwise
   */
  vertical?: boolean;

  // Other props
} & Omit<NeoInputProps, 'floating' | 'position'>;

export type NeoPinState = NeoValidationState<string>;

export type NeoPinMethods = {
  clear: () => void;
};

export type NeoPinContext = NeoValidationFieldContext<NeoInputHTMLElement, string> &
  NeoPinMethods & {
    /**
     * If true, the input will be disabled.
     */
    disabled?: boolean;
    /**
     * If true, the input will be readonly.
     */
    readonly?: boolean;
  };
