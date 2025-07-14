<script lang="ts">

  import type {
    NeoNotification,
    NeoNotificationDeQueued,
    NeoNotificationQueued,
    NeoNotificationStackProps,
    NeoNotificationStackService,
  } from '~/floating/notification/neo-notification.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { onDestroy, onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import { NeoPlacements } from '~/floating/common/neo-placement.model.js';
  import { getNeoNotificationProviderContext, NeoNotificationStatus } from '~/floating/notification/neo-notification.model.js';
  import { NeoErrorNotificationNotFound } from '~/utils/error.utils.js';

  let {
    // Snippets
    children,

    // Stats
    id = $bindable<string>(getUUID()),
    ref = $bindable(),
    tag = 'ol',
    placement = NeoPlacements.TopEnd,
    duration = 10000,
    queue = $bindable(new SvelteMap<NeoNotificationQueued['id'], NeoNotificationQueued>()),

    // Other props
    ...rest
  }: NeoNotificationStackProps = $props();

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
        if (options.unshift) queue.delete(id);

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

<svelte:element
  bind:this={ref}
  this={tag}
  id="neo-notification-stack-${id}"
  aria-live="polite"
  aria-relevant="additions text"
  aria-atomic="false"
  data-placement={placement}
  class:neo-notification-container={true}
  {...rest}
>
  {#each Array.from(queue.values()).reverse() as item, index (item.id ?? index)}
    {#if children}
      {@render children?.(item)}
    {:else}
      <div class="neo-notification-item">
        Item {index + 1}: {item.id} - {item.timeout}
      </div>
    {/if}
  {/each}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-container {
    z-index: var(--neo-z-index-layer-ui, 1000);
    width: fit-content;
    height: fit-content;

    @include mixin.fixed(
      $margin: --neo-notification-margin,
      $margin-top: --neo-notification-margin-top,
      $margin-bottom: --neo-notification-margin-bottom,
      $margin-left: --neo-notification-margin-left,
      $margin-right: --neo-notification-margin-right,
    );
  }
</style>
