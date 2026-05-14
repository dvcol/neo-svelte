<script lang="ts">
  import type { NeoNotificationStackService } from '~/floating/notification/neo-notification-provider.model.js';

  import { onMount, tick } from 'svelte';

  import {
    getNeoNotificationProviderContext,
  } from '~/floating/notification/neo-notification-provider.model.js';
  import { NeoErrorNotificationServiceNotFound } from '~/utils/error.utils.js';

  type ServiceCallback = (
    service: NeoNotificationStackService | undefined,
    error?: unknown,
  ) => void;

  const { id, onService }: { id?: string; onService: ServiceCallback } = $props();

  const context = getNeoNotificationProviderContext();

  onMount(async () => {
    // Defer past sibling onMount handlers so any auto-registered stacks land first.
    await tick();
    try {
      if (!context) throw new NeoErrorNotificationServiceNotFound();
      const service = context.get(id);
      if (!service) throw new NeoErrorNotificationServiceNotFound(id);
      onService(service);
    } catch (error) {
      onService(undefined, error);
    }
  });
</script>
