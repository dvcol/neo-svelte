import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';
import type { NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

export interface NeoNotificationItemProps<Tag extends keyof HTMLElementTagNameMap = 'li'> {
  children?: NeoNotificationStackProps['children'];

  ref?: HTMLElement;

  tag?: Tag | keyof HTMLElementTagNameMap;

  index: number;
  item: NeoNotificationQueued;

  posinset: number;
  setsize: number;

  reverse?: boolean;
}
