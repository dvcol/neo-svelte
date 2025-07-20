import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

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

export interface NeoNotification {
  /**
   * Unique identifier for the notification.
   */
  id?: string;
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
   * Props to pass to the notification container element.
   */
  containerProps?: Omit<HTMLNeoBaseElement, 'children'>;
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
  cancel: (status: NeoNotificationStatuses) => NeoNotificationDeQueued;
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
