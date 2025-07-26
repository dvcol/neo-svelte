<script lang="ts">

  import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';
  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';
  import type { NeoNotification, NeoNotificationDeQueued, NeoNotificationQueued } from '~/floating/notification/neo-notification.model.js';

  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { onDestroy, onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import { NeoNotificationPlacements } from '~/floating/common/neo-placement.model.js';
  import { getNeoNotificationProviderContext } from '~/floating/notification/neo-notification-provider.model.js';
  import { NeoNotificationEvent, NeoNotificationStackDirection, NeoNotificationStatus } from '~/floating/notification/neo-notification.model.js';
  import NeoNotificationItem from '~/floating/notification/NeoNotificationItem.svelte';
  import NeoPortal from '~/floating/portal/NeoPortal.svelte';
  import { NeoErrorNotificationMissingId, NeoErrorNotificationNotFound } from '~/utils/error.utils.js';

  let {
    // Snippets
    children,
    before,
    after,

    // Stats
    id = $bindable<string>(getUUID()),
    ref = $bindable(),
    tag = 'ol',
    queue = $bindable(new SvelteMap<NonNullable<NeoNotificationQueued['id']>, NeoNotificationQueued>()),
    paused = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    expand,
    delay = 900,
    max = expand ? 6 : 3,

    // Item Props
    duration = 10000,
    pauseOnHover = true,
    draggable = true,
    swipeable = true,
    threshold = { x: 3, y: 2 },
    restartOnTouch,
    progress,
    loading,
    close = true,

    // Style
    elevation = 1,
    blur,
    color,
    filled,
    tinted,
    rounded,
    borderless,

    // Position
    placement = NeoNotificationPlacements.BottomEnd,
    direction,
    portal,

    // Other props
    portalProps,
    containerProps,
    actionProps,
    closeProps,
    ...rest
  }: NeoNotificationStackProps = $props();

  let active = $state(false);

  const debounceActive = debounce((value: boolean) => {
    active = value;
  }, delay);

  function setActive(value: boolean): void {
    if (value) {
      active = true;
      debounceActive.cancel();
    } else {
      debounceActive(value);
    }
  }

  const expanded = $derived(expand ?? active);

  const reverse = $derived.by(() => {
    if (direction !== undefined) return direction === NeoNotificationStackDirection.Down;
    return placement?.startsWith('top');
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
        if (!response.id) throw new NeoErrorNotificationMissingId();
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(id);
        queue.delete(response.id);
        response.removed = Date.now();
        response.status = status;
        resolve(response);
        item.onChange?.(NeoNotificationEvent.Status, item);
        return response;
      },
      update: (update: Omit<NeoNotification, 'id'>): NeoNotificationQueued => {
        if (!response.id) throw new NeoErrorNotificationMissingId();
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(response.id);
        if ('id' in update) delete update.id; // Ensure we don't overwrite the id
        Object.assign(item, update);
        item.onChange?.(NeoNotificationEvent.Update, item);
        if (item.duration) return item.restart();
        return item;
      },
      restart: (options: { duration?: number; unshift?: boolean } = {}): NeoNotificationQueued => {
        if (!response.id) throw new NeoErrorNotificationMissingId();
        const item = queue.get(response.id);
        if (!item) throw new NeoErrorNotificationNotFound(response.id);

        clearTimeout(item.timeout);
        item.duration = options.duration ?? item.duration ?? duration;

        // Remove the item from the queue before restarting
        if (options.unshift) queue.delete(response.id);

        if (item.duration && !paused) {
          item.timeout = setTimeout(() => {
            if (!item.id) throw new NeoErrorNotificationMissingId();
            if (!queue?.has(item.id)) return;
            item.cancel(NeoNotificationStatus.Expired);
          }, item.duration);
        }

        // Re-add the item to the queue
        if (options.unshift) queue.set(response.id, item);
        item.onChange?.(NeoNotificationEvent.Restart, item);
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
    queue?.forEach(item => item.cancel(NeoNotificationStatus.Cancelled));
    queue?.clear();
  }

  const resume = debounce(() => queue?.forEach((item) => {
    if (!item.paused || !item.duration) return;
    // restart the item with a duration base on item.added and item.paused
    item.restart({ duration: item.duration - (item.paused - item.added), unshift: false });
    delete item.paused;
  }), delay);

  export function pause(_paused: boolean = true): void | Promise<void> {
    paused = _paused;

    if (!_paused) return resume();
    queue?.forEach((item) => {
      if (!item.timeout) return;
      if (!(item.pauseOnHover ?? pauseOnHover)) return;
      item.paused = Date.now();
      item.onChange?.(NeoNotificationEvent.Paused, item);
      clearTimeout(item.timeout);
    });
  }

  let swiped = $state(false);
  const debounceSwiped = debounce((swipe: boolean) => {
    swiped = swipe;
  }, 600);

  const context = getNeoNotificationProviderContext();

  onMount(() => {
    if (!context) return;
    context.register({ id, add, get, remove, update, pause, restart, clear } satisfies NeoNotificationStackService);
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
    data-max={max}
    data-visible={visible.length}
    data-setsize={queue.size}
    aria-live="polite"
    aria-relevant="additions text"
    aria-atomic="false"
    data-placement={placement}
    class:neo-notification-stack={true}
    {...rest}
  >
    {#each visible as { item, index }, i (item?.id)}
      <NeoNotificationItem
        tag={['ul', 'ol'].includes(tag) ? 'li' : 'div'}

        index={i}
        posinset={index + 1}
        setsize={queue.size}
        visible={visible.length}

        expand={expanded}
        {reverse}
        {draggable}
        {swipeable}
        {placement}
        {threshold}
        {swiped}

        {item}
        {before}
        {after}
        {children}

        {restartOnTouch}
        {progress}
        {loading}
        {close}

        {elevation}
        {blur}
        {color}
        {filled}
        {tinted}
        {rounded}
        {borderless}

        {containerProps}
        {actionProps}
        {closeProps}

        onChange={(state) => {
          hovered = state.hovered;
          focused = state.focused;
          setActive(hovered || focused);
          pause(hovered || focused);
        }}

        onCancel={({ event }) => {
          if (!(event instanceof WheelEvent)) return;
          swiped = true;
          debounceSwiped.cancel();
          debounceSwiped(false);
        }}
      />
    {/each}
  </svelte:element>
</NeoPortal>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-notification-stack {
    z-index: var(--neo-z-index-layer-top, 2000000000);
    width: 0;
    height: 0;
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
