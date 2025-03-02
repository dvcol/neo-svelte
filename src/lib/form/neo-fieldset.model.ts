import type { Snippet } from 'svelte';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

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

  // Size
  /**
   * Overrides the default flex value.
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;

  // Other props
  legendProps?: HTMLNeoBaseElement<HTMLLegendElement>;
} & HTMLNeoBaseElement<HTMLFieldSetElement>;
