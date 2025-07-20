<script lang="ts">

  import type { NeoNotificationStackProps } from '~/floating/notification/neo-notification-stack.model';

  import { randomInt } from '@dvcol/common-utils/common/math';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { NeoPlacements } from '~/floating/common/neo-placement.model.js';
  import NeoNotificationStack from '~/floating/notification/NeoNotificationStack.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { DefaultShadowElevation, MaxShadowElevation } from '~/utils/shadow.utils';

  import { colorOptions } from '../utils/color.utils';
  import { positionOptions } from '../utils/placement.utils';

  const container = $state<NeoNotificationStackProps>({
    placement: NeoPlacements.TopEnd,
    duration: 0,
    expand: false,
  });

  const options = $state({
    elevation: DefaultShadowElevation,
    color: '',
  });

  let stack = $state<NeoNotificationStack>();

  const pushNotification = () => {
    if (!stack) return;
    (window as any).stack = (window as any).stack || [];
    (window as any).stack.push(stack.add({
      containerProps: { style: `height: ${8 ?? randomInt(2, 6)}rem; width: ${20 ?? randomInt(10, 20)}rem` },
    }),
    );
  };

</script>

<div class="row">
  <NeoNumberStep
    label="Duration"
    placement="left"
    center
    bind:value={container.duration}
    min={0}
    max={10000}
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
    options={positionOptions}
    size={15}
    openOnFocus
    rounded
    glass
  />
  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={0}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowElevation}
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
    color={options.color}
    size={10}
    bind:value={options.color}
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
    <NeoButton onclick={stack?.clear}>Clear</NeoButton>
  </NeoButtonGroup>
</div>

<NeoNotificationStack bind:this={stack} {...container} expand={container.expand ? true : undefined} />

<section>
  <div class="row">
    <div class="column">
      <span class="label">Notification</span>

      <NeoButton elevation="0" onclick={pushNotification}>Default</NeoButton>
    </div>
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

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
