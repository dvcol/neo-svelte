<script lang="ts">
  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model.js';

  import NeoNotificationProvider from '~/floating/notification/NeoNotificationProvider.svelte';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

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

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoNotificationProvider stack={false}>
      <NeoNotificationStack bind:this={instance} bind:ref bind:paused {...rest} />
    </NeoNotificationProvider>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
  }
</style>
