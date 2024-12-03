import type { Snippet } from 'svelte';
import type { NeoInputHTMLElement, NeoInputProps } from '~/inputs/neo-input.model.js';
import type { NeoValidationFieldContext, NeoValidationState } from '~/inputs/neo-validation.model.js';

export type NeoPinProps = {
  // Snippets
  icon?: Snippet;

  // State
  copy?: boolean;
  password?: boolean;

  // Styles
  groups?: number;
  count?: number;
  separator?: boolean | string;

  // Other props
} & Omit<NeoInputProps, 'floating' | 'position' | 'before' | 'beforeRef' | 'beforeTag' | 'beforeProps'>;

export type NeoPinState = NeoValidationState<string>;

export type NeoPinMethods = {
  clear: () => void;
};

export type NeoPinContext = NeoValidationFieldContext<NeoInputHTMLElement, string> & NeoPinMethods;
