import type { Snippet } from 'svelte';
import type { NeoInputHTMLElement, NeoInputProps } from '~/inputs/neo-input.model.js';
import type { NeoValidationFieldContext } from '~/inputs/neo-validation.model.js';

export type NeoPinState = {
  // Snippets
  /**
   * A snippet to display as the group separator.
   */
  icon?: Snippet;

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
};

export type NeoPinProps = NeoPinState & Omit<NeoInputProps, 'floating' | 'position'>;

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
