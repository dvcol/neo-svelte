import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';
import type { NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export interface NeoNotificationItemProps<Tag extends keyof HTMLElementTagNameMap = 'li'> extends Omit<HTMLNeoBaseElement, 'children'> {
  children?: NeoNotificationStackProps['children'];

  ref?: HTMLElement;
  hovered?: boolean;
  focused?: boolean;

  tag?: Tag | keyof HTMLElementTagNameMap;

  index: number;
  item: NeoNotificationQueued;

  posinset: number;
  setsize: number;
  visible?: number;

  expand?: boolean;
  reverse?: boolean;
  draggable?: NeoNotificationStackProps['draggable'];
  swipeable?: NeoNotificationStackProps['swipeable'];
  placement?: NeoNotificationStackProps['placement'];
  threshold?: NeoNotificationStackProps['threshold'];
  stagger?: NeoNotificationStackProps['stagger'];

  onChange?: (payload: { item: NeoNotificationQueued; index: number; hovered: boolean; focused: boolean; event: PointerEvent | FocusEvent }) => void;
  onDrag?: (payload: { item: NeoNotificationQueued; index: number; event: PointerEvent; initial: { x: number; y: number } | false; offset: { x: number; y: number } }) => void;
}
