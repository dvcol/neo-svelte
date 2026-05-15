<script lang="ts">
  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';

  import NeoNotificationProvider from '~/floating/notification/NeoNotificationProvider.svelte';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';

  type StackInstance = ReturnType<typeof NeoNotificationStack>;

  type HarnessProps = Partial<NeoNotificationStackProps> & {
    instance?: StackInstance;
    onInstance?: (instance: StackInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLOListElement | undefined>(undefined),
    paused = $bindable(false),
    instance = $bindable<StackInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoNotificationProvider stack={false}>
  <NeoNotificationStack bind:this={instance} bind:ref bind:paused {...rest} />
</NeoNotificationProvider>
