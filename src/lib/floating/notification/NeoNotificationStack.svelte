<script lang="ts">

  import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';
  import type { NeoNotification, NeoNotificationDeQueued, NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { onDestroy, onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import { NeoPlacements } from '~/floating/common/neo-placement.model.js';
  import { getNeoNotificationProviderContext } from '~/floating/notification/neo-notification-provider.model.js';
  import { NeoNotificationStackDirection, NeoNotificationStatus } from '~/floating/notification/neo-notification.model.js';
  import NeoNotificationItem from '~/floating/notification/NeoNotificationItem.svelte';
  import NeoPortal from '~/floating/portal/NeoPortal.svelte';
  import { NeoErrorNotificationNotFound } from '~/utils/error.utils.js';

  let {
    // Snippets
    children,

    // Stats
    id = $bindable<string>(getUUID()),
    ref = $bindable(),
    tag = 'ol',
    queue = $bindable(new SvelteMap<NeoNotificationQueued['id'], NeoNotificationQueued>()),
    duration = 10000,
    max = 6,

    // Position
    placement = NeoPlacements.BottomEnd,
    direction,
    portal,

    // Other props
    portalProps,
    ...rest
  }: NeoNotificationStackProps = $props();

  const reverse = $derived.by(() => {
    if (direction !== undefined) return direction === NeoNotificationStackDirection.Down;
    return placement?.startsWith('top') || NeoPlacements.TopStart === placement || NeoPlacements.TopEnd === placement;
  });

  const visible = $derived.by(() => {
    if (!queue) return [];
    return Array.from(queue.values()).map((item, index) => ({ item, index })).slice(-max);
  });

  export function add(item: NeoNotification): NeoNotificationQueued {
    const { promise, resolve } = Promise.withResolvers<NeoNotificationDeQueued>();

    const response: NeoNotificationDeQueued = {
      id: getUUID(),
      duration,
      ...item,
      status: NeoNotificationStatus.Pending,
      added: Date.now(),
    };

    const queued: NeoNotificationQueued = {
      ...response,
      promise,
      cancel: (status = NeoNotificationStatus.Cancelled) => {
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(id);
        queue.delete(response.id);
        response.removed = Date.now();
        response.status = status;
        resolve(response);
        return response;
      },
      update: (update: Omit<NeoNotification, 'id'>): NeoNotificationQueued => {
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(response.id);
        if ('id' in update) delete update.id; // Ensure we don't overwrite the id
        Object.assign(item, update);
        if (item.duration) return item.restart();
        return item;
      },
      restart: (options: { duration?: number; unshift?: boolean } = {}): NeoNotificationQueued => {
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(response.id);

        clearTimeout(item.timeout);
        item.duration = options.duration ?? item.duration ?? duration;

        // Remove the item from the queue before restarting
        if (options.unshift) queue.delete(response.id);

        if (item.duration) {
          item.timeout = setTimeout(() => {
            if (!queue.has(item.id)) return;
            item.cancel(NeoNotificationStatus.Expired);
          }, item.duration);
        }

        // Re-add the item to the queue
        if (options.unshift) queue.set(response.id, item);
        return item;
      },
    };

    queue.set(response.id, queued);
    return queued.restart();
  }

  export function get(uuid: string): NeoNotificationQueued | undefined {
    return queue.get(uuid);
  }

  export function remove(uuid: string, status = NeoNotificationStatus.Cancelled): NeoNotificationDeQueued {
    const item = queue.get(uuid);
    if (!item) throw new NeoErrorNotificationNotFound(uuid);
    return item.cancel(status);
  }

  export function update(uuid: string, update: Omit<NeoNotification, 'id'>): NeoNotificationQueued {
    const item = queue.get(uuid);
    if (!item) throw new NeoErrorNotificationNotFound(uuid);
    return item.update(update);
  }

  export function restart(uuid: string, options?: { duration?: number; unshift?: boolean }): NeoNotificationQueued {
    const item = queue.get(uuid);
    if (!item) throw new NeoErrorNotificationNotFound(uuid);
    return item.restart(options);
  }

  export function clear(): void {
    queue.forEach(item => item.cancel(NeoNotificationStatus.Cancelled));
    queue.clear();
  }

  const context = getNeoNotificationProviderContext();

  onMount(() => {
    if (!context) return;
    context.register({ id, add, get, remove, update, restart, clear } satisfies NeoNotificationStackService);
  });

  onDestroy(() => {
    context.unregister(id);
  });
</script>

<NeoPortal enabled={portal} {...portalProps}>
  <svelte:element
    bind:this={ref}
    this={tag}
    id="neo-notification-stack-${id}"
    aria-live="polite"
    aria-relevant="additions text"
    aria-atomic="false"
    data-placement={placement}
    class:neo-notification-stack={true}
    {...rest}
  >
    {#each visible as { item, index }, i (item.id ?? i)}
      <NeoNotificationItem
        tag={['ul', 'ol'].includes(tag) ? 'li' : 'div'}
        index={i}
        setsize={queue.size}
        posinset={index + 1}

        {item}
        {reverse}
        {children}
      />
    {/each}
  </svelte:element>
</NeoPortal>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-stack {
    z-index: var(--neo-z-index-layer-top, 1000);
    gap: var(--neo-notification-stack-gap, var(--neo-gap));
    width: 100%;
    list-style: none;
    pointer-events: none;

    @include mixin.fixed(
      $margin: --neo-notification-margin,
      $margin-top: --neo-notification-margin-top,
      $margin-bottom: --neo-notification-margin-bottom,
      $margin-left: --neo-notification-margin-left,
      $margin-right: --neo-notification-margin-right,
      $align-items: true,
    );
  }
</style>
