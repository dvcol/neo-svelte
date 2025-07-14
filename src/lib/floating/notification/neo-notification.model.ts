import type { Snippet } from 'svelte';
import type { SvelteMap } from 'svelte/reactivity';

import type { NeoNotificationPlacement } from '~/floating/common/neo-placement.model.js';

import { getContext, setContext } from 'svelte';

import { NeoErrorNotificationServiceNotFound } from '~/utils/error.utils.js';

/**
 * Common properties between NeoNotification and NeoNotificationStack
 */
interface NeoNotificationCommon {
  /**
   * Duration in milliseconds for which the notification will be displayed.
   * If not specified, the notification will remain until manually dismissed.
   *
   * @default 0 (indefinite)
   */
  duration?: number;
}

export interface NeoNotificationStackProps<Tag extends keyof HTMLElementTagNameMap = 'ol'> extends NeoNotificationCommon {
  // Snippets
  children?: Snippet<[NeoNotificationQueued]>;

  /**
   * Unique identifier for the notification stack.
   */
  id?: string;
  ref?: HTMLElementTagNameMap[Tag];
  tag?: Tag;

  placement?: NeoNotificationPlacement;
  queue?: SvelteMap<NeoNotificationQueued['id'], NeoNotificationQueued>;
}

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

export interface NeoNotification extends NeoNotificationCommon {
  id?: string;
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

type NeoNotificationServices = SvelteMap<NeoNotificationStackService['id'], NeoNotificationStackService>;

export interface NotificationProviderProps {
  /**
   * The children to render inside the notification provider.
   */
  children?: Snippet<[NeoNotificationServices]>;
  /**
   * Service map for notification stacks.
   */
  services?: NeoNotificationServices;
  /**
   * Optional notification stack properties.
   * If set to `false`, no default stack will be created.
   */
  stack?: NeoNotificationStackProps | false;
}

export interface NeoNotificationStackService {
  /**
   * Unique identifier for the notification stack.
   */
  id: NeoNotificationStackProps['id'];

  /**
   * Adds a notification to the stack.
   * @param notification - The notification to add.
   * @returns A promise that resolves when the notification is processed.
   */
  add: (notification: NeoNotification) => NeoNotificationQueued;

  /**
   * Retrieves a notification from the stack by its ID.
   * @param id - The Unique ID of the notification to retrieve.
   */
  get: (id: string) => NeoNotificationQueued | undefined;

  /**
   * Removes a notification from the stack by its ID.
   * @param id - The Unique ID of the notification to remove.
   */
  remove: (id: string) => NeoNotificationDeQueued;

  /**
   * Updates an existing notification in the stack.
   * @param id - The ID of the notification to update.
   * @param update - The properties to update.
   * @returns The updated notification, or undefined if not found.
   */
  update: (id: string, update: Omit<NeoNotification, 'id'>) => NeoNotificationQueued;

  /**
   * Restarts a notification in the stack with a new duration.
   * @param id - The ID of the notification to restart.
   * @param options - Whether to unshift the notification to the front of the queue.
   */
  restart: (id: string, options?: { duration?: number; unshift?: boolean }) => NeoNotificationQueued;

  /**
   * Clears all notifications from the stack.
   */
  clear: () => void;
}

export interface NeoNotificationProviderContext {
  register: (service: NeoNotificationStackService) => void;
  unregister: (id: NeoNotificationStackService['id']) => void;
  get: (id?: NeoNotificationStackService['id']) => NeoNotificationStackService | undefined;
}

const NeoNotificationProviderContextSymbol = Symbol('NeoNotificationProviderContext');

export function setNeoNotificationProviderContext(context: NeoNotificationProviderContext) {
  return setContext(NeoNotificationProviderContextSymbol, context);
}

export function getNeoNotificationProviderContext(): NeoNotificationProviderContext {
  return getContext<NeoNotificationProviderContext>(NeoNotificationProviderContextSymbol);
}

export function useNotificationService(id?: NeoNotificationStackService['id']): NeoNotificationStackService {
  const context = getNeoNotificationProviderContext();
  if (!context) throw new NeoErrorNotificationServiceNotFound();
  const service = context.get(id);
  if (!service) throw new NeoErrorNotificationServiceNotFound(id);
  return service;
}
