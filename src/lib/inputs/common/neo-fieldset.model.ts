import type { Snippet } from 'svelte';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoFieldsetProps = {
  // Snippets
  /**
   * The fieldset content.
   */
  children?: Snippet;
  /**
   * Optional fieldset legend.
   */
  legend?: string | Snippet;

  // Styles

  /**
   * Hide the fieldset border.
   */
  borderless?: boolean;

  // Other props
  legendProps?: HTMLNeoBaseElement<HTMLLegendElement>;
} & HTMLNeoBaseElement<HTMLFieldSetElement>;
