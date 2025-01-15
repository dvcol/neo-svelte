import type { UseDismissOptions, UseFloatingReturn, UseHoverOptions, UseRoleOptions } from '@skeletonlabs/floating-ui-svelte';
import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoTooltipProps = {
  // Snippets

  /**
   * Element(s) to render inside the trigger.
   */
  children?: Snippet<[UseFloatingReturn]>;
  /**
   * A snippet or a string to display as the input label.
   */
  tooltip?: string | Snippet<[UseFloatingReturn]>;

  // States

  /**
   * The aria role of the tooltip.
   */
  role?: UseRoleOptions['role'];
  /**
   * The HTML tag to use for the tooltip component.
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * Represents the open/ close state of the tooltip.
   */
  open?: boolean;

  // Hover

  /**
   * Whether the tooltip should open/close when hovering over the trigger.
   */
  openOnHover?: boolean;
  /**
   * Whether the tooltip should remain open when mousing off the trigger.
   */
  keepOpenOnHover?: boolean;
  /**
   * Options to pass to the useHover hook.
   */
  hoverOptions?: UseHoverOptions;

  // Dismiss

  /**
   * Whether the tooltip should close when clicking outside, pressing escape, or scrolling.
   */
  closeOnDismiss?: boolean;
  /**
   * Options to pass to the useDismiss hook.
   */
  dismissOptions?: UseDismissOptions;

  // Other props

  /**
   * Reference to the trigger element.
   */
  triggerRef?: HTMLRefProps['ref'];
  /**
   * The HTML tag to use for the trigger element.
   */
  triggerTag?: keyof HTMLElementTagNameMap;
  /**
   * Properties to pass to the trigger element.
   */
  triggerProps?: HTMLNeoBaseElement;
} & HTMLRefProps &
  HTMLActionProps &
  HTMLNeoBaseElement;
