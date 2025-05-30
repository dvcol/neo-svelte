import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

import type { NeoHandleProps } from '~/floating/common/neo-handle.model.js';
import type { NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';
import type { NeoMovable, NeoMovableOutside, NeoMovableResetOptions, NeoMoved } from '~/floating/dialog/use-movable.svelte.js';
import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, PositiveShadowElevation, PositiveShadowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoDialogBlur = BlurElevation | BlurElevationString;
export type NeoDialogElevation = PositiveShadowElevation | PositiveShadowElevationString;

export type NeoDialogHTMLElement = HTMLDialogElement & {
  /**
   * Closes the dialog element.
   *
   * The argument, if provided, provides a return value.
   * Emits a `cancel` event before closing the dialog.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/requestClose)
   */
  requestClose?: (returnValue?: string) => void;
  /**
   * Resets the dialog offset.
   */
  reset?: (options?: NeoMovableResetOptions) => Promise<boolean>;
};

export interface NeoDialogContext<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  /**
   * The dialog element reference.
   */
  ref?: NeoDialogHTMLElement;
  /**
   * The HTML tag to use for the dialog element.
   *
   * If 'dialog', the dialog will be a native dialog element.
   * If not dialog methods (show, showModal, close, requestClose) will be emulated.
   *
   * @default `dialog` if `unmountOnClose` is true, otherwise `div`
   * @see unmountOnClose
   */
  tag?: Tag;
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
  /**
   * Whether to unmount the dialog content when closed.
   *
   * @default true
   */
  unmountOnClose?: boolean;
  /**
   * Where to place the modal element relative to the viewport (modal only).
   *
   * @see modal
   * @default center
   */
  placement?: NeoDialogPlacement;
  /**
   * The dialog's offset from it's original position if any (applied transform).
   *
   * @default { x: 0, y: 0 }
   * @see movable
   */
  moved?: NeoMoved;
  /**
   * Whether the dialog can be dragged around.
   *
   * @default false
   */
  movable?: boolean | Partial<NeoMovable>;
  /**
   * Whether the dialog should be rendered in place or as a portal.
   * If not portal target is provided, the dialog will be attached to the body.
   *
   * @default false
   */
  portal?: boolean;
  /**
   * Whether the dialog is outside the viewport.
   *
   * @default false
   * @see movable
   */
  readonly outside?: NeoMovableOutside;
}

export type NeoDialogProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  /**
   * The dialog content.
   */
  children?: Snippet<[NeoDialogContext<Tag>]>;

  // style

  /**
   * The shadow elevation of the dialog.
   *
   * @default 2
   */
  elevation?: NeoDialogElevation;
  /**
   * The blur level to apply to the backdrop (0 to 5) when open.
   *
   * @default 1
   * @see glass
   */
  blur?: NeoDialogBlur;
  /**
   * Text color to use for the dialog.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * Whether the dialog should transition in/out with a fade effect.
   *
   * @default true
   */
  fade?: boolean;
  /**
   * Whether the dialog should transition in/out with a slide effect.
   *
   * @default true
   */
  slide?: boolean;
  /**
   * If true, the dialog will have a rounded border.
   */
  rounded?: BorderRadiusInput;
  /**
   * Tints the dialog with the current color.
   */
  tinted?: boolean;
  /**
   * Fills the dialog background.
   */
  filled?: boolean;
  /**
   * Whether to show the dialog backdrop (modal only).
   *
   * @default true
   * @see modal
   */
  backdrop?: boolean;
  /**
   * Whether to remove the border from the dialog.
   */
  borderless?: boolean;

  // Sizing
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;
  /**
   * Padding override for the tooltip.
   */
  padding?: CSSStyleDeclaration['padding'];
  /**
   * Whether the dialog should take up the full available space.
   * If center, the dialog will fill the viewport.
   * If bottom/top, the dialog will fill the viewport horizontally.
   * If left/right, the dialog will fill the viewport vertically.
   *
   * @default false
   * @see placement
   */
  full?: boolean;

  // Other Props
  /**
   * Optional properties to pass to the backdrop element.
   *
   * Only applies when `backdrop` is true, `modal` is true, and the dialog is non-native.
   *
   * @see backdrop
   * @see modal
   * @see tag
   */
  backdropProps?: HTMLNeoBaseElement;
  /**
   * Optional properties to pass to the dialog drag handle.
   */
  handleProps?: NeoHandleProps;
  /**
   * Optional properties to pass to the portal element.
   */
  portalProps?: Omit<NeoPortalProps, 'children'>;
} & HTMLFlexProps &
HTMLActionProps &
NeoDialogContext<Tag> &
Omit<HTMLDialogAttributes, 'children'>;
