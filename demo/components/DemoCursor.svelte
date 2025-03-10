<script lang="ts">
  import { round } from '@dvcol/common-utils';

  import type { NeoCursorProps } from '../../src/lib/cursor/neo-cursor.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { NeoCursor } from '~/cursor';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';

  const options = $state<NeoCursorProps>({
    snap: true,
    delay: 10,
    disabled: false,

    tilt: true,
    pressure: true,
    watch: undefined,
  });

  let cursor = $state<NeoCursorProps['cursor']>();
  let pointer = $state<NeoCursorProps['pointer']>();
  let contact = $state<NeoCursorProps['contact']>();
  let position = $state<NeoCursorProps['position']>();
  let snapping = $state<NeoCursorProps['snapping']>(false);
  let touching = $state<NeoCursorProps['touching']>(false);

  $effect(() => {
    document.documentElement.dataset.overscroll = 'none';
    return () => {
      document.documentElement.dataset.overscroll = '';
    };
  });
</script>

<div class="row">
  <NeoButtonGroup>
    <NeoButton toggle bind:checked={options.snap}>Snap</NeoButton>
    <NeoButton toggle bind:checked={options.tilt}>Tilt</NeoButton>
    <NeoButton toggle bind:checked={options.pressure}>Pressure</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
  </NeoButtonGroup>
  <NeoNumberStep
    label="Delay"
    placement="left"
    center
    bind:value={options.delay}
    min={0}
    max={1000}
    step={10}
    defaultValue={10}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 4rem' }}
  />
</div>

<NeoCursor bind:cursor bind:pointer bind:contact bind:snapping bind:touching bind:position {...options} />

<div class="row">
  <div>
    <div>Cursor</div>
    <span>{cursor || 'auto'}</span>
  </div>
  <div>
    <div>Pointer</div>
    <span>{pointer || 'auto'}</span>
  </div>
  <div>
    <div>Coordinates</div>
    <span>{round(position?.x) || 0} - {round(position?.y) || 0}</span>
  </div>
  <div>
    <div>Size</div>
    <span>{round(contact?.size?.width) || 0} - {round(contact?.size?.height) || 0}</span>
  </div>
  <div>
    <div>Tilt</div>
    <span>{round(contact?.tilt?.x) || 0} - {round(contact?.tilt?.y) || 0}</span>
  </div>
  <div>
    <div>Twist</div>
    {contact?.twist || 0}
  </div>
  <div>
    <div>Angle</div>
    <span>{round(contact?.angle?.azimuth, 2) || 0} - {round(contact?.angle?.altitude, 2) || 0}</span>
  </div>
  <div>
    <div>Pressure</div>
    <span>{round(contact?.pressure?.point, 2) || 0} - {round(contact?.pressure?.tangential, 2) || 0}</span>
  </div>
  <div>
    <div>Snapping</div>
    <span>{snapping ? 'true' : 'false'}</span>
  </div>
  <div>
    <div>Touching</div>
    <span>{touching ? 'true' : 'false'}</span>
  </div>
</div>

<div class="row">
  <span class="label">Clickable</span>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 4rem 0;
    // stylelint-disable-next-line property-no-vendor-prefix -- still required for Safari
    -webkit-user-select: none;
    user-select: none;
    overscroll-behavior: none;
  }

  @media (width < 1200px) {
    .row {
      margin: 2rem 0;
    }
  }
</style>
