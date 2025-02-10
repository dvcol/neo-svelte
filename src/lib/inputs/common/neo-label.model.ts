import type { Snippet } from 'svelte';
import type { HTMLLabelAttributes } from 'svelte/elements';
import type { HTMLUseProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';

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
   * If `true` or `false`, the label will be displayed as valid or invalid.
   * If any other value (undefined, null, etc.), the label will be displayed as normal.
   */
  valid?: boolean;
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
   * The ref to bind to the label container.
   */
  containerRef?: HTMLRefProps['ref'];
  /**
   * The props to pass to the label container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;
} & HTMLRefProps<HTMLLabelElement> &
  HTMLLabelAttributes &
  HTMLUseProps;
