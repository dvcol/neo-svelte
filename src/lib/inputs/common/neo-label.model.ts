import type { Snippet } from 'svelte';
import type { HTMLLabelAttributes } from 'svelte/elements';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoLabelProps = {
  // Snippets
  /**
   * The element(s) to wrap with the label.
   */
  children?: Snippet;
  /**
   * A snippet or a string to display as the label.
   */
  label?: Snippet | string;

  // States
  /**
   * If `true`, the label will be displayed a required asterisk.
   */
  required?: boolean | null;
  /**
   * If `true`, the label will be displayed as disabled.
   */
  disabled?: boolean | null;

  // Other props
  /**
   * The HTML tag to use for the container.
   * @default div
   */
  containerTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the label container.
   */
  containerProps?: HTMLNeoBaseElement;
} & HTMLRefProps<HTMLLabelElement> &
  HTMLLabelAttributes;
