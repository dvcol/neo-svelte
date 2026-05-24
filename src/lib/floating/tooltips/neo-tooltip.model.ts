import type { Snippet } from 'svelte';

import type { NeoTooltipPlacement } from '~/floating/common/neo-placement.model.js';
import type {
  AutoPlacementOptions,
  ClickOptions,
  DismissOptions,
  FlipOptions,
  FocusOptions,
  HoverOptions,
  offset,
  Popover,
  PopoverOptions,
  RoleOptions,
  ShiftOptions,
  SizeOptions,
} from '~/floating/common/popover/index.js';
import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { PositiveShadowElevation, PositiveShadowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export const NeoTooltipSizeStrategy = {
  /** Match the size of the trigger */
  Match: 'match',
  /** At least as wide/tall as the trigger */
  Min: 'min',
  /** At most as wide/tall as the trigger */
  Max: 'max',
  /** At most as wide/tall as the available space */
  Available: 'available',
} as const;

export type NeoTooltipSizeStrategies = (typeof NeoTooltipSizeStrategy)[keyof typeof NeoTooltipSizeStrategy];

export type NeoTooltipElevation = PositiveShadowElevation | PositiveShadowElevationString;

export type NeoTooltipContext = Popover;

export type NeoTooltipToggle = (open?: boolean) => boolean;

export type NeoTooltipOffsetFunction = (placement?: NeoTooltipPlacement) => Parameters<typeof offset>[0];

export const isOffsetFunction = (fn: NeoTooltipProps['offset']): fn is NeoTooltipOffsetFunction => typeof fn === 'function';

export type NeoTooltipProps = {
  // Snippets

  /**
   * Element(s) to render inside the trigger.
   */
  children?: Snippet<[NeoTooltipContext, NeoTooltipToggle]>;
  /**
   * A snippet or a string to display as the input label.
   */
  tooltip?: string | Snippet<[NeoTooltipContext, NeoTooltipToggle]>;

  // States

  /**
   * The aria role of the tooltip.
   */
  role?: RoleOptions['role'];
  /**
   * The HTML tag to use for the tooltip component.
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * Represents the open/ close state of the tooltip.
   */
  open?: boolean;
  /**
   * If true, all open interactions (hover, focus, click) are inert.
   *
   * `dismiss` (Escape, outside-press) remains active so an externally-opened
   * tooltip (`bind:open`) can still be closed by the user. `disabled` takes
   * precedence over per-interaction `*.enabled` getters and `openOn*` flags.
   */
  disabled?: boolean;
  /**
   * The target to attach the tooltip to.
   */
  target?: HTMLElement | (() => HTMLElement);
  /**
   * Additive options forwarded to the underlying `Popover` instance.
   *
   * - `target` and `autoUpdate` have no top-level NeoTooltip prop and are
   *   passed through reactively.
   * - `onOpenChange` runs as a **pre-hook** before NeoTooltip's local
   *   handler. Call `event.preventDefault()` from inside the callback to
   *   veto the local `keepOpenOn*` chain and the `bind:open` write.
   *
   * `placement` is intentionally excluded — use the top-level
   * `placement` prop. `open`, `middleware`, and `interactions` are
   * NeoTooltip-internal and not overridable here.
   */
  options?: Pick<PopoverOptions, 'target' | 'autoUpdate' | 'onOpenChange'>;
  /**
   * Modifies the placement by translating the floating element along the specified axes.
   * A number (shorthand for mainAxis or distance), or an axes configuration object may be passed.
   *
   * @default 6
   */
  offset?: Parameters<typeof offset>[0] | NeoTooltipOffsetFunction;
  /**
   * Where to place the floating element relative to its reference element.
   */
  placement?: NeoTooltipPlacement;
  /**
   * Actual tooltip position after flip & re-flow to fit viewport
   */
  position?: NeoTooltipPlacement;
  /**
   * Whether the tooltip should be rendered in place or as a portal.
   * If not portal target is provided, the dialog will be attached to the body.
   *
   * @default false
   */
  portal?: boolean;
  /**
   * Options forwarded to the floating-ui `flip()` middleware.
   *
   * Spread on top of NeoTooltip's defaults (`{ fallbackAxisSideDirection: 'end' }`),
   * so user values win. Only used when `placement !== 'auto'`.
   */
  flipOptions?: FlipOptions;
  /**
   * Options forwarded to the floating-ui `shift()` middleware.
   *
   * Spread on top of NeoTooltip's defaults (`{ padding: 8 }`), so user values win.
   */
  shiftOptions?: ShiftOptions;
  /**
   * Options forwarded to the floating-ui `size()` middleware.
   *
   * The `apply` callback runs *after* NeoTooltip's internal `availableWidth` /
   * `availableHeight` capture, so consumers can compose additional sizing logic
   * without losing the built-in behavior.
   */
  sizeOptions?: SizeOptions;
  /**
   * Options forwarded to the floating-ui `autoPlacement()` middleware.
   *
   * Only used when `placement === 'auto'`.
   */
  autoPlacementOptions?: AutoPlacementOptions;

  // Styles

  /**
   * If true, the tooltip will have a rounded border.
   */
  rounded?: BorderRadiusInput;
  /**
   * Tints the tooltip with the current color.
   */
  tinted?: boolean;
  /**
   * Fills the tooltip background.
   */
  filled?: boolean;
  /**
   * Text color to use for the tooltip.
   */
  color?: Color | CSSStyleDeclaration['color'];
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
   * Whether to remove the border from the tooltip.
   */
  borderless?: boolean;

  // Size

  /**
   * Padding override for the tooltip.
   */
  padding?: CSSStyleDeclaration['padding'];
  /**
   * Width strategy for the tooltip.
   * - `match`: the tooltip will match the width of the trigger.
   * - `min`: the tooltip will be at least as wide as the trigger.
   * - `max`: the tooltip will be at most as wide as the trigger.
   * - `available`: the tooltip will be at most as wide as the available space.
   * - `string`: a css width value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  width?: NeoTooltipSizeStrategies | SizeInput<'width'>;
  /**
   * Height strategy for the tooltip.
   * - `match`: the tooltip will match the height of the trigger.
   * - `min`: the tooltip will be at least as tall as the trigger.
   * - `max`: the tooltip will be at most as tall as the trigger.
   * - `available`: the tooltip will be at most as tall as the available space.
   * - `string`: a css height value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  height?: NeoTooltipSizeStrategies | SizeInput<'height'>;

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
   * The delay in milliseconds before the tooltip opens on hover.
   *
   * @default 500
   */
  hoverDelay?: HoverOptions['restMs'];
  /**
   * The delay in milliseconds before the tooltip open state changes.
   *
   * @default 100
   */
  openDelay?: HoverOptions['delay'];
  /**
   * Options to pass to the underlying `hover()` interaction.
   */
  hoverOptions?: HoverOptions;

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
   * Options to pass to the underlying `focus()` interaction.
   */
  focusOptions?: FocusOptions;

  // Click

  /**
   * Whether the tooltip should open/close when clicking on the trigger.
   *
   * @default false
   */
  openOnClick?: boolean;
  /**
   * Whether the tooltip should remain open when clicking off the trigger.
   */
  keepOpenOnClick?: boolean;
  /**
   * Options to pass to the underlying `click()` interaction.
   */
  clickOptions?: ClickOptions;

  // Dismiss

  /**
   * Whether the tooltip should close when clicking outside, pressing escape, or scrolling.
   */
  closeOnDismiss?: boolean;
  /**
   * Options to pass to the underlying `dismiss()` interaction.
   */
  dismissOptions?: DismissOptions;

  // Mounting

  /**
   * Whether to unmount the tooltip content when closed.
   *
   * @default true
   */
  unmountOnClose?: boolean;
  /**
   * Whether to apply in/out transition with a fade effect.
   *
   * @default true
   */
  fade?: boolean;

  // Events
  /**
   * Event Handlers that fires on state change.
   * @param open
   */
  onChange?: (open: boolean) => void;
  /**
   * Event Handlers that fires on open.
   */
  onOpen?: () => void;
  /**
   * Event Handlers that fires on close.
   */
  onClose?: () => void;

  // Other props

  /**
   * Reference to the trigger element.
   */
  triggerRef?: HTMLRefProps<HTMLElement>['ref'];
  /**
   * Properties to pass to the trigger element.
   */
  triggerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional properties to pass to the portal element.
   */
  portalProps?: Omit<NeoPortalProps, 'children'>;
} & HTMLFlexProps
& HTMLRefProps<HTMLElement>
& HTMLActionProps
& Omit<HTMLNeoBaseElement, 'children'>;
