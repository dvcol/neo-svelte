<script lang="ts">
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';

  import { DefaultShadowPressedElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils.js';

  const options = $state<NeoDividerProps>({
    rounded: true,
    vertical: false,
    skeleton: false,
    glass: false,
    elevation: 0,
    margin: '5px',
  });
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShadowElevation}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowPressedElevation}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />
</div>

<section>
  <div class="row">
    <div class="column content" class:vertical={options.vertical}>
      <span class="label">Divider</span>

      <SphereBackdrop glass={options.glass} style="width: 100%; height: 100%">
        <NeoDivider {...options} />
      </SphereBackdrop>
    </div>
  </div>

  <div class="row">
    <div class="column content" class:vertical={options.vertical}>
      <span class="label">Custom {options.vertical ? 'Width' : 'Height'}</span>
      <SphereBackdrop glass={options.glass} style="width: 100%; height: 100%">
        <NeoDivider height={options.vertical ? undefined : '2rem'} width={options.vertical ? '2rem' : undefined} {...options} />
      </SphereBackdrop>
    </div>
  </div>

  <div class="row">
    <div class="column content" class:vertical={options.vertical}>
      <span class="label">Custom {options.vertical ? 'Height' : 'Width'}</span>

      <SphereBackdrop glass={options.glass} style="width: 100%; height: 100%">
        <NeoDivider width={options.vertical ? undefined : '50%'} height={options.vertical ? '50%' : undefined} {...options} />
      </SphereBackdrop>
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
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.vertical {
      height: min(50vw, 20rem);
    }

    &:not(.vertical) {
      width: max(20vw, 20rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
