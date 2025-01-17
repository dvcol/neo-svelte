import type { Snippet } from 'svelte';
import type { HTMLOptionAttributes } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

export type NeoSelectOption = {
  value: any;
  label?: string | Snippet;
} & HTMLOptionAttributes;

export type NeoSelectProps = {
  /**
   * Button properties to pass to the show/hide password button.
   */
  buttonProps?: NeoButtonProps;
  /**
   * The array of options to display in the select.
   */
  options?: NeoSelectOption[];
} & NeoInputProps;
