import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';

import type { NeoArrowButtonProps } from '~/buttons/neo-arrow-button.model.js';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';

export type NeoConfirmProps = {
  // Snippet
  /**
   * Element(s) to render inside the component.
   */
  children?: Snippet;
  /**
   * Element(s) to render inside the header.
   */
  header?: Snippet;

  // States
  /**
   * The HTML tag to render the content wrapper as.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * The loading state of the confirm & cancel buttons.
   */
  loading?: {
    confirm?: boolean;
    cancel?: boolean;
  };
  /**
   * The disabled state of the confirm & cancel buttons.
   */
  disabled?:
    | boolean
    | {
      confirm?: boolean;
      cancel?: boolean;
    };

  // State
  /**
   * Whether the confirm has a close button shown.
   *
   * @default true
   */
  closable?: boolean;

  // Styles
  /**
   * Whether to style the buttons as rounded.
   */
  rounded?: BorderRadiusInput;

  // Events
  /**
   * Event Handlers that fires on close.
   */
  onClose?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Event Handlers that fires on cancel.
   */
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Event Handlers that fires on confirm.
   * @param e
   */
  onConfirm?: MouseEventHandler<HTMLButtonElement>;

  // Other props
  /**
   * Optional props to pass to the controls.
   */
  controlsProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the header.
   */
  headerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the content wrapper.
   */
  contentProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the close button.
   */
  closeProps?: NeoIconButtonProps;
  /**
   * Optional props to pass to the cancel button.
   */
  cancelProps?: NeoIconButtonProps;
  /**
   * Optional props to pass to the confirm button.
   */
  confirmProps?: NeoArrowButtonProps;
  /**
   * Optional props to pass to all buttons.
   */
  buttonProps?: NeoButtonProps;
} & HTMLNeoBaseElement;
