<script lang="ts">
  import type {
    NeoNotificationProviderContext,
    NeoNotificationStackService,
    NotificationProviderProps,
  } from '~/floating/notification/neo-notification.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { SvelteMap } from 'svelte/reactivity';

  import { setNeoNotificationProviderContext } from '~/floating/notification/neo-notification.model.js';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';
  import { NeoErrorNotificationDuplicateId } from '~/utils/error.utils.js';

  let {
    // Snippets
    children,

    // States
    services = $bindable(new SvelteMap<NeoNotificationStackService['id'], NeoNotificationStackService>()),

    // Other props
    stack = { id: `default-${getUUID()}` },
  }: NotificationProviderProps = $props();

  setNeoNotificationProviderContext(
    {
      register: (service: NeoNotificationStackService) => {
        if (services.has(service.id)) throw new NeoErrorNotificationDuplicateId(service.id!);
        services.set(service.id, service);
        console.info('Registered notification stack service:', service.id);
      },
      unregister: (id: NeoNotificationStackService['id']) => {
        if (!services.has(id)) return;
        services.delete(id);
      },
      get: (id?: NeoNotificationStackService['id']) => {
        if (!id) return services.values().next().value;
        return services.get(id);
      },
    } satisfies NeoNotificationProviderContext,
  );
</script>

{@render children?.(services)}

{#if stack}
  <NeoNotificationStack {...stack} />
{/if}
