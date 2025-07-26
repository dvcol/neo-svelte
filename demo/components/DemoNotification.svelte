<script lang="ts">

  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model';
  import type { NeoNotification } from '~/floating/notification/neo-notification.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { NeoNotificationPlacements } from '~/floating/common/neo-placement.model.js';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { MaxShadowElevation } from '~/utils/shadow.utils';

  import { colorOptions } from '../utils/color.utils';
  import { positionOptions } from '../utils/placement.utils';

  const position = positionOptions.filter(o => !o.value?.startsWith('left') && !o.value?.startsWith('right'));

  const container = $state<NeoNotificationStackProps>({
    placement: NeoNotificationPlacements.TopEnd,
    duration: 5000,
    expand: false,
    draggable: true,
    swipeable: true,
    close: true,
    loading: false,
    elevation: 1,
    color: '',
    filled: false,
    tinted: false,
    rounded: false,
    borderless: false,
  });
  let stack = $state<NeoNotificationStack>();

  const pushNotification = (notif?: NeoNotification) => {
    if (!stack) return;
    (window as any).stack = (window as any).stack || [];
    (window as any).stack.push(stack.add({
      title: `Item: ${new Date().toLocaleTimeString()}`,
      subtitle: 'Subtitle: this is a notification item',
      content: `This is a notification item created at ${new Date().toLocaleTimeString()}.
      You can customize it with various properties.`,
      ...notif,
    }));
  };

</script>

<div class="row">
  <NeoNumberStep
    label="Duration"
    placement="left"
    center
    bind:value={container.duration}
    min={0}
    max={60000}
    defaultValue={0}
    step={1000}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />

  <NeoSelect
    label="Placement"
    placeholder="Select placement"
    placement="left"
    floating={false}
    bind:value={container.placement}
    containerProps={{ style: 'margin-left: 6.75rem' }}
    options={position}
    size={15}
    openOnFocus
    rounded
    glass
  />
</div>

<div class="row">
  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={container.elevation}
    min={0}
    max={MaxShadowElevation}
    defaultValue={1}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />

  <NeoSelect
    label="Color"
    placeholder="Select color"
    placement="left"
    floating={false}
    color={container.color}
    size={10}
    bind:value={container.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
    openOnFocus
    rounded
    glass
  />
</div>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={container.expand}>Expand</NeoButton>
    <NeoButton toggle bind:checked={container.draggable}>Draggable</NeoButton>
    <NeoButton toggle bind:checked={container.swipeable}>Swipeable</NeoButton>
    <NeoButton toggle bind:checked={container.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={container.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={container.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={container.filled}>Filled</NeoButton>
    <NeoButton toggle bind:checked={container.rounded}>Rounded</NeoButton>
    <NeoButton onclick={stack?.clear}>Clear</NeoButton>
  </NeoButtonGroup>
</div>

<NeoNotificationStack bind:this={stack} {...container} expand={container.expand ? true : undefined} />

<section>
  <div class="row">
    <span class="label">Semantic types</span>

    <NeoButton elevation="0" onclick={() => pushNotification({ type: 'info' })}>Info</NeoButton>
    <NeoButton elevation="0" onclick={() => pushNotification({ type: 'warning' })}>Warning</NeoButton>
    <NeoButton elevation="0" onclick={() => pushNotification({ type: 'error' })}>Error</NeoButton>
    <NeoButton elevation="0" onclick={() => pushNotification({ type: 'success' })}>Success</NeoButton>
  </div>

  <div class="row">
    <span class="label">Custom</span>

    <NeoButton elevation="0" onclick={() => pushNotification()}>Default</NeoButton>
    <NeoButton
      elevation="0" onclick={() => pushNotification({
        title: undefined,
        subtitle: undefined,
        content: `This is a notification item created at ${new Date().toLocaleTimeString()}.`,
      })}
    >Compact</NeoButton>
    <NeoButton
      elevation="0"
      onclick={() => pushNotification({ actionProps: {
        label: 'Action',
        onclick: () => {
          return 'dismissed';
        },
      } })}
    >
      Action
    </NeoButton>
    <NeoButton
      elevation="0"
      onclick={() => pushNotification({
        progress: true,
        pauseOnHover: false,
      })}
    >
      Progress
    </NeoButton>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
