import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import type { BlurElevation, BlurElevationString } from '~/utils/shadow.utils.js';

export type HTMLDialogElementRef = HTMLDialogElement & {
  /**
   * Closes the dialog element.
   *
   * The argument, if provided, provides a return value.
   * Emits a `cancel` event before closing the dialog.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/requestClose)
   */
  requestClose?: (returnValue?: string) => void;
};

export type NeoDialogBlur = BlurElevation | BlurElevationString;

export type NeoDialogContext = {
  /**
   * The dialog element reference.
   */
  ref?: HTMLDialogElementRef;
  /**
   * Whether the dialog is open or not.
   * A change in this prop will trigger the dialog to open or close.
   */
  open?: boolean;
  /**
   * Whether the dialog should be modal or not when triggered by a change in the `open` prop.
   *
   * @default true
   */
  modal?: boolean;
  /**
   * The return value when the dialog is closed.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/returnValue)
   */
  returnValue?: string;
  /**
   * Manages the dialog's closing behavior on supported platforms.
   * If set, disables custom closeOnClickOutside logic.
   *
   * @see [support](https://caniuse.com/mdn-html_elements_dialog_closedby)
   * @see closeOnClickOutside
   */
  closedby?: 'any' | 'closerequest' | 'none';
  /**
   * Disables the window.body scroll overflow when the dialog is open.
   * @default mirror the `modal` prop
   */
  disableBodyScroll?: boolean;
  /**
   * Closes the dialog and emits a `cancel` event when the user clicks outside the dialog.
   *
   * @see closedby
   * @default true
   */
  closeOnClickOutside?: boolean;
};

export type NeoDialogProps = {
  /**
   * The dialog content.
   */
  children?: Snippet<[NeoDialogContext]>;

  // style
  /**
   * The blur level to apply to the backdrop (0 to 5) when open.
   *
   * @default 1
   * @see glass
   */
  blur?: NeoDialogBlur;
  /**
   * Whether the dialog should transition in/out with a fade effect.
   *
   * @default true
   */
  fade?: boolean;
} & NeoDialogContext &
  HTMLDialogAttributes;
