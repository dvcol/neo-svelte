<script lang="ts">
  import { round } from '@dvcol/common-utils';

  import type { NeoCursorProps } from '../../src/lib/cursor/neo-cursor.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { NeoCursor } from '~/cursor';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';

  const options = $state<NeoCursorProps>({
    snap: true,
    delay: 10,
    disabled: false,

    tilt: false,
    pressure: false,
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

{#snippet after()}
  <NeoButton text aria-label="After button snippet">
    {#snippet icon()}
      <IconFileUpload style="min-width: 1.25rem; min-height:1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

<div class="row">
  <div class="column">
    <span class="label">Clickable</span>
    <NeoButton elevation="0" label="Click me" />
    <NeoInput elevation="0" label="Type here" {after} />
  </div>

  <div class="column" data-neo-cursor="snap">
    <span class="label">Force snap</span>
    <p>This enforce snapping (if enabled).</p>
  </div>

  <div class="column">
    <span class="label">Text</span>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </div>
</div>

<div class="row">
  <div class="column neo-select">
    <span class="label">No select</span>
    <p>This is not selectable, try to use a pen to see tilt & pressure effects !</p>
  </div>

  <div class="column" data-neo-cursor="none">
    <span class="label">No cursor</span>
    <p>This disable the neo-cursor.</p>
  </div>

  <div class="column" data-neo-cursor="auto">
    <span class="label">Force auto</span>
    <p>This enforce the default cursor and ignore text elements.</p>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .neo-select {
    // stylelint-disable-next-line property-no-vendor-prefix -- still required for Safari
    -webkit-user-select: none;
    user-select: none;
    overscroll-behavior: none;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xxl), $flex: 0 1 auto);

    margin: 4rem 0;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    padding: var(--neo-gap-sm);
    border-radius: var(--neo-border-radius);
  }

  @media (width < 1200px) {
    .row {
      margin: 2rem 0;
    }
  }
</style>
