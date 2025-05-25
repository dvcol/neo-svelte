<script lang="ts">
  import type { NeoMediaProps } from '~/media/neo-media.model';

  import { displayValue } from '~';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoMedia from '~/media/NeoMedia.svelte';
  import { DefaultShadowElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  import NeoNumberStep from '../../src/lib/inputs/NeoNumberStep.svelte';
  import NeoSelect from '../../src/lib/inputs/NeoSelect.svelte';
  import { colorOptions } from '../utils/color.utils';

  const options = $state<NeoMediaProps>({
    color: '',
    elevation: DefaultShadowElevation,
    loading: false,
    glass: false,
    tinted: false,
    filled: false,
    rounded: false,
    pressed: false,
    borderless: false,
    skeletonMediaProps: {
      ratio: '3/2',
    },
  });

  const src = 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.loading}>Skeleton</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.filled}>Filled</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.pressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
  </NeoButtonGroup>
</div>

<div class="row">
  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShadowElevation}
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
    display={displayValue}
    size={10}
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 4rem' }}
    options={colorOptions}
    openOnFocus
    rounded
    glass
  />
</div>

<section>
  <div class="row">
    <div class="column">
      <span class="label">No content</span>
      <div class="content">
        <NeoMedia {...options} caption="Image caption title." image={{ src }} ratio="3/2" />
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .content {
    width: min(70rem, 80vw);
  }

  .column {
    @include flex.column($gap: var(--neo-gap-lg));

    align-items: center;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
