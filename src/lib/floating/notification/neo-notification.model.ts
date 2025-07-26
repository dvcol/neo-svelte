import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoCloseButtonProps } from '~/buttons/neo-close-button.model.js';
import type { NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLTagProps, SvelteEvent } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, PositiveShadowElevation, PositiveShadowElevationString } from '~/utils/shadow.utils.js';

export const NeoNotificationStackDirection = {
  Up: 'up',
  Down: 'down',
} as const;

export type NeoNotificationStackDirections = (typeof NeoNotificationStackDirection)[keyof typeof NeoNotificationStackDirection];

export const NeoNotificationStatus = {
  /**
   * The notification is pending and will be displayed in the queue.
   */
  Pending: 'pending',
  /**
   * The notification has been dismissed by the user.
   */
  Dismissed: 'dismissed',
  /**
   * The notification has been cancelled by programmatic action.
   */
  Cancelled: 'cancelled',
  /**
   * The notification duration has expired.
   */
  Expired: 'expired',
} as const;

export type NeoNotificationStatuses = (typeof NeoNotificationStatus)[keyof typeof NeoNotificationStatus];

export const NeoNotificationType = {
  /**
   * The notification is an info message.
   */
  Info: 'info',
  /**
   * The notification is a warning message.
   */
  Warning: 'warning',
  /**
   * The notification is an error message.
   */
  Error: 'error',
  /**
   * The notification is a success message.
   */
  Success: 'success',
  /**
   * The notification is a default message.
   */
  Default: 'default',
} as const;

export type NeoNotificationTypes = (typeof NeoNotificationType)[keyof typeof NeoNotificationType];

export const NeoNotificationEvent = {
  /**
   * The notification has changed its status.
   */
  Status: 'status',
  /**
   * The notification content has changed.
   */
  Update: 'update',
  /**
   * The notification timeout has been paused.
   */
  Paused: 'paused',
  /**
   * The notification timeout has been resumed or restarted.
   */
  Restart: 'restart',
  /**
   * The notification has been hidden either by queue eviction or if the max visible queue size was reached.
   */
  Hidden: 'hidden',
  /**
   * The notification has been show, either by being added to the queue or if an earlier notification was dismissed.
   */
  Visible: 'visible',
} as const;

export type NeoNotificationEvents = (typeof NeoNotificationEvent)[keyof typeof NeoNotificationEvent];

export type NeoNotificationBlur = BlurElevation | BlurElevationString;
export type NeoNotificationElevation = PositiveShadowElevation | PositiveShadowElevationString;
export type NeoNotificationClickResult = NeoNotificationStatuses | false | undefined | void;

export interface NeoNotification {
  // Snippets

  /**
   * A function that renders the notification content.
   */
  render?: Snippet<[NeoNotificationQueued]>;
  /**
   * Optional snippets to run before and after the notification is queued.
   */
  before?: Snippet<[NeoNotificationQueued]>;
  /**
   * Optional snippets to run after the notification is de-queued.
   */
  after?: Snippet<[NeoNotificationQueued]>;

  // States

  /**
   * Unique identifier for the notification.
   */
  id?: string;
  /**
   * The type of the notification.
   */
  type?: NeoNotificationTypes;
  /**
   * The title of the notification.
   */
  title?: string;
  /**
   *  The subtitle of the notification.
   */
  subtitle?: string;
  /**
   * The content of the notification.
   */
  content?: string;
  /**
   * Whether the notification is currently loading.
   *
   * @default false
   */
  loading?: boolean;
  /**
   * Whether the notification has a progress bar.
   * Defaults to an indeterminate progress bar if true.
   *
   * @default false
   */
  progress?: boolean;
  /**
   * Whether the notification has a close button.
   *
   * @default true
   */
  close?: boolean;
  /**
   * Duration in milliseconds for which the notification will be displayed.
   * If not specified, the notification will remain until manually dismissed.
   *
   * @default 0 (indefinite)
   */
  duration?: number;
  /**
   * If true, the notification will be restarted when the user interacts with it (e.g., hover, click, touch).
   * @default true
   */
  restartOnTouch?: boolean;
  /**
   * If true, notifications timeout will be paused while the user hovers over the notification.
   * @default true
   */
  pauseOnHover?: boolean;

  // Styles
  /**
   * The shadow elevation of the notification.
   *
   * @default 1
   */
  elevation?: NeoNotificationElevation;
  /**
   * The blur level to apply to the notification backdrop (0 to 5).
   *
   * @default 1
   */
  blur?: NeoNotificationBlur;
  /**
   * Text color to use for the notification.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * If true, the notification will have a rounded border.
   */
  rounded?: BorderRadiusInput;
  /**
   * Tints the notification with the current color.
   */
  tinted?: boolean;
  /**
   * Fills the notification background.
   */
  filled?: boolean;
  /**
   * Whether to remove the border from the notification.
   */
  borderless?: boolean;

  // Events
  /**
   * Event handler that fires when the notification state changes.
   *
   * State changes can include:
   * - status changes (e.g., from pending to dismissed)
   * - visibility changes (e.g., when the notification is shown or hidden)
   * - timeout changes (e.g., when the notification is paused, resumed, or restarted)
   * @param payload
   */
  onChange?: (event: NeoNotificationEvents, item: NeoNotificationQueued) => void;

  // Other properties

  /**
   * Props to pass to the notification container element.
   */
  containerProps?: Omit<HTMLNeoBaseElement, 'children'> & HTMLTagProps;
  /**
   * Optional progress bar properties to display a progress bar within the notification.
   */
  progressProps?: NeoProgressBarProps;
  /**
   * Optional action button properties to display an action button within the notification.
   */
  actionProps?: Omit<NeoButtonProps, 'onclick'> & { onclick?: (e: SvelteEvent<MouseEvent>, checked?: boolean) => NeoNotificationClickResult | Promise<NeoNotificationClickResult> };
  /**
   * Optional close button properties to display a close button within the notification.
   */
  closeProps?: NeoCloseButtonProps;
}

export interface NeoNotificationDeQueued extends NeoNotification {
  /**
   * Unique identifier for the notification.
   */
  id: NonNullable<NeoNotification['id']>;
  /**
   * The notification's current status.
   */
  status: NeoNotificationStatuses;
  /**
   * The timestamp when the notification was added to the queue.
   */
  added: number;
  /**
   * The timestamp when the item was paused in the queue.
   */
  paused?: number;
  /**
   * The timestamp when the notification was shown (either by being added to the queue or if an earlier notification was dismissed).
   */
  visible?: number;
  /**
   * The timestamp when the notification was hidden (either by dismissal or if the max queue size was reached).
   */
  hidden?: number;
  /**
   * The timestamp when the notification was removed from the queue.
   */
  removed?: number;
}

export interface NeoNotificationQueued extends NeoNotificationDeQueued {
  /**
   * The notification's timeout reference.
   */
  timeout?: ReturnType<typeof setTimeout>;
  /**
   * The promise that resolves when the notification is de-queued.
   */
  promise: Promise<NeoNotificationDeQueued>;
  /**
   * Force the notification to be de-queued with the specified status.
   * @param status
   */
  cancel: (status?: NeoNotificationStatuses) => NeoNotificationDeQueued;
  /**
   * Update the notification with new properties while in the queue.
   * @param update
   */
  update: (update: Omit<NeoNotification, 'id'>) => NeoNotificationQueued;
  /**
   * Restart the notification's duration.
   * @param options
   */
  restart: (options?: { duration?: number; unshift?: boolean }) => NeoNotificationQueued;
}
