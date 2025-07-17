import type { Snippet } from 'svelte';
import type { SvelteMap } from 'svelte/reactivity';

import type { NeoNotificationPlacement } from '~/floating/common/neo-placement.model.js';
import type { NeoNotificationQueued, NeoNotificationStackDirections } from '~/floating/notification/neo-notification.model.js';
import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

export interface NeoNotificationStackProps<Tag extends keyof HTMLElementTagNameMap = 'ol'> {
  // Snippets
  children?: Snippet<[NeoNotificationQueued]>;

  /**
   * Unique identifier for the notification stack.
   */
  id?: string;
  ref?: HTMLElementTagNameMap[Tag];
  tag?: Tag;

  /**
   * Duration in milliseconds for which the notification will be displayed.
   * If not specified, the notification will remain until manually dismissed.
   *
   * @default 0 (indefinite)
   */
  duration?: number;
  queue?: SvelteMap<NeoNotificationQueued['id'], NeoNotificationQueued>;
  max?: number;

  // Placement
  placement?: NeoNotificationPlacement;
  direction?: NeoNotificationStackDirections;
  portal?: boolean;

  portalProps?: NeoPortalProps;
}
