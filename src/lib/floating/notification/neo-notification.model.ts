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
  id?: string;
  /**
   * Duration in milliseconds for which the notification will be displayed.
   * If not specified, the notification will remain until manually dismissed.
   *
   * @default 0 (indefinite)
   */
  duration?: number;
  /**
   * Props to pass to the notification container element.
   */
  containerProps?: Omit<HTMLNeoBaseElement, 'children'>;
}

export interface NeoNotificationDeQueued extends NeoNotification {
  status: NeoNotificationStatuses;
  added: number;
  removed?: number;
}

export interface NeoNotificationQueued extends NeoNotificationDeQueued {
  timeout?: ReturnType<typeof setTimeout>;
  promise: Promise<NeoNotificationDeQueued>;
  cancel: (status: NeoNotificationStatuses) => NeoNotificationDeQueued;
  update: (update: Omit<NeoNotification, 'id'>) => NeoNotificationQueued;
  restart: (options?: { duration?: number; unshift?: boolean }) => NeoNotificationQueued;
}
