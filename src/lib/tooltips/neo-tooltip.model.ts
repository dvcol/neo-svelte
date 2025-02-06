import type {
  offset,
  UseDismissOptions,
  UseFloatingOptions,
  UseFloatingReturn,
  UseFocusOptions,
  UseHoverOptions,
  UseRoleOptions,
} from '@skeletonlabs/floating-ui-svelte';
import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { PositiveShadowElevation, PositiveShadowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export const NeoTooltipSizeStrategy = {
  Match: 'match' as const,
  Min: 'min' as const,
  Max: 'max' as const,
} as const;

export type NeoTooltipSizeStrategies = (typeof NeoTooltipSizeStrategy)[keyof typeof NeoTooltipSizeStrategy];

export type NeoTooltipElevation = PositiveShadowElevation | PositiveShadowElevationString;

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
  /**
   * The target to attach the tooltip to.
   */
  target?: HTMLElement | (() => HTMLElement);
  /**
   * The floating options to pass to the useFloating hook.
   */
  options?: UseFloatingOptions;
  /**
   * Modifies the placement by translating the floating element along the specified axes.
   * A number (shorthand for mainAxis or distance), or an axes configuration object may be passed.
   *
   * @default 6
   */
  offset?: Parameters<typeof offset>[0];
  /**
   * Where to place the floating element relative to its reference element.
   */
  placement?: UseFloatingOptions['placement'] | 'auto';

  // Styles

  /**
   * If true, the tooltip will have a rounded border.
   */
  rounded?: boolean;
  /**
   * The shadow elevation of the tooltip.
   *
   * @default 2
   */
  elevation?: NeoTooltipElevation;
  /**
   * The blur filter of the tooltip.
   *
   * @default match elevation (2)
   */
  blur?: NeoTooltipElevation;
  /**
   * Width strategy for the tooltip.
   * - `match`: the tooltip will match the width of the trigger.
   * - `min`: the tooltip will be at least as wide as the trigger.
   * - `max`: the tooltip will be at most as wide as the trigger.
   * - `string`: a css width value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  width?: NeoTooltipSizeStrategies | SizeInput<'width'>;
  /**
   * Width strategy for the tooltip.
   * - `match`: the tooltip will match the width of the trigger.
   * - `min`: the tooltip will be at least as wide as the trigger.
   * - `max`: the tooltip will be at most as wide as the trigger.
   * - `string`: a css width value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  height?: NeoTooltipSizeStrategies | SizeInput<'height'>;
  /**
   * Padding override for the tooltip.
   */
  padding?: CSSStyleDeclaration['padding'];

  // Hover

  /**
   * Whether the tooltip should open/close when hovering over the trigger.
   *
   * @default true
   */
  openOnHover?: boolean;
  /**
   * Whether the tooltip should remain open when mousing off the trigger.
   *
   * @default false
   */
  keepOpenOnHover?: boolean;
  /**
   * Options to pass to the useHover hook.
   */
  hoverOptions?: UseHoverOptions;

  // Focus

  /**
   * Whether the tooltip should open/close when focusing on the trigger.
   *
   * @default true
   */
  openOnFocus?: boolean;
  /**
   * Whether the tooltip should remain open when focusing off the trigger.
   *
   * @default false
   */
  keepOpenOnFocus?: boolean;
  /**
   * Options to pass to the useFocus hook.
   */
  focusOptions?: UseFocusOptions;

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
  triggerRef?: HTMLRefProps<NeoTooltipHTMLElement>['ref'];
  /**
   * The HTML tag to use for the trigger element.
   */
  triggerTag?: keyof HTMLElementTagNameMap;
  /**
   * Properties to pass to the trigger element.
   */
  triggerProps?: HTMLNeoBaseElement;
} & HTMLRefProps<NeoTooltipHTMLElement> &
  HTMLActionProps &
  Omit<HTMLNeoBaseElement, 'children'>;

export type NeoTooltipMethods = {
  toggle: (open?: boolean) => boolean;
  update: UseFloatingReturn['update'];
};

export type NeoTooltipHTMLElement<T extends HTMLElement = HTMLElement> = T & Partial<NeoTooltipMethods>;
