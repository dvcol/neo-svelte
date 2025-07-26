import type { NeoNotificationItemProps } from '~/floating/notification/neo-notification-item.model.js';
import type { NeoNotification } from '~/floating/notification/neo-notification.model.js';
import type { NeoProgressHTMLElement } from '~/progress/neo-progress.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export interface NeoSimpleNotificationProps<Tag extends keyof HTMLElementTagNameMap = 'div'>
  extends Omit<HTMLNeoBaseElement, 'children'>,
  Pick<NeoNotificationItemProps, 'before' | 'after'
  | 'item' | 'index' | 'restartOnTouch' | 'progress' | 'loading' | 'close' | 'rounded'
  | 'progressProps' | 'actionProps' | 'closeProps'
  | 'onCancel'> {
  /**
   * Optional content to display below the notification content.
   */
  children?: NeoNotification['render'];

  ref?: HTMLElement;
  bar?: NeoProgressHTMLElement;
  height?: HTMLElement['offsetHeight'];
  tag?: Tag | keyof HTMLElementTagNameMap;
}
