import type { Snippet } from 'svelte';
import type { SvelteMap } from 'svelte/reactivity';

import type { NeoNotificationPlacement } from '~/floating/common/neo-placement.model.js';
import type { NeoNotification, NeoNotificationQueued, NeoNotificationStackDirections } from '~/floating/notification/neo-notification.model.js';
import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

export interface NeoNotificationStackProps<Tag extends keyof HTMLElementTagNameMap = 'ol'> extends Pick<NeoNotification, 'duration'> {
  // Snippets
  children?: Snippet<[NeoNotificationQueued]>;

  /**
   * Unique identifier for the notification stack.
   */
  id?: string;
  ref?: HTMLElementTagNameMap[Tag];
  tag?: Tag;

  queue?: SvelteMap<NonNullable<NeoNotificationQueued['id']>, NeoNotificationQueued>;
  paused?: boolean;
  hovered?: boolean;
  focused?: boolean;
  expand?: boolean;
  delay?: number;
  max?: number;

  // Item Props
  /**
   * If true, notifications timeout will be paused while the user hovers over the notification.
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * If true, notifications can be dragged to dismiss them.
   * @default true
   */
  draggable?: boolean;
  /**
   * The fraction of the notification stack height/width that must be scrolled before the notification is considered dismissed.
   * @default 3 (1/3 of the stack height/width)
   */
  threshold?: number;

  // Placement
  placement?: NeoNotificationPlacement;
  direction?: NeoNotificationStackDirections;
  portal?: boolean;

  portalProps?: NeoPortalProps;
}
