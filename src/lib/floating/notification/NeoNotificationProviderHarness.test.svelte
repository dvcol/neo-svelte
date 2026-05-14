<script lang="ts">
  import type { NotificationProviderProps, useNotificationService } from '~/floating/notification/neo-notification-provider.model.js';
  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';

  import NeoNotificationProvider from '~/floating/notification/NeoNotificationProvider.svelte';
  import NeoNotificationServiceProbe from '~/floating/notification/NeoNotificationServiceProbe.test.svelte';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';

  type ServiceCallback = (
    service: ReturnType<typeof useNotificationService> | undefined,
    error?: unknown,
  ) => void;

  type HarnessProps = Partial<NotificationProviderProps> & {
    extraStacks?: Array<Partial<NeoNotificationStackProps>>;
    serviceId?: string;
    onService?: ServiceCallback;
  };

  const { stack, extraStacks = [], serviceId, onService }: HarnessProps = $props();
</script>

<NeoNotificationProvider {stack}>
  {#each extraStacks as stackProps, i (stackProps.id ?? i)}
    <NeoNotificationStack {...stackProps} />
  {/each}
  {#if onService}
    <NeoNotificationServiceProbe id={serviceId} {onService} />
  {/if}
</NeoNotificationProvider>
