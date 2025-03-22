<script lang="ts">
  import { MaxShallowShadowElevation, MinShallowShadowElevation } from '../../src/lib/utils/shadow.utils';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { colorOptions } from '../utils/color.utils';

  import NeoBadge from '~/badge/NeoBadge.svelte';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import IconMail from '~/icons/IconMail.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoPill from '~/pill/NeoPill.svelte';

  const options = $state({
    elevation: 1,
    hover: 0,

    size: 'large',
    color: '',
    close: false,
    loading: false,
    disabled: false,
    skeleton: false,

    borderless: false,
    rounded: true,
    glass: false,
    filled: false,
    tinted: false,
  });

  const onElevation = () => {
    if (options.elevation + options.hover < -2) options.hover += 1;
    if (options.elevation + options.hover > 2) options.hover -= 1;
  };
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.filled}>Filled</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>
</div>

<div class="row">
  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShallowShadowElevation}
    max={MaxShallowShadowElevation}
    defaultValue={0}
    oninput={onElevation}
    nullable={false}
    floating={false}
    rounded
    glass
    groupProps={{ style: 'margin-left: 6rem' }}
  />

  <NeoNumberStep
    label="Hover"
    placement="left"
    center
    bind:value={options.hover}
    min={MinShallowShadowElevation - options.elevation}
    max={MaxShallowShadowElevation - options.elevation}
    defaultValue={0}
    nullable={false}
    floating={false}
    rounded
    glass
    groupProps={{ style: 'margin-left: 4rem' }}
  />

  <NeoSelect
    label="Size"
    placeholder="Select size"
    placement="left"
    floating={false}
    size="10"
    bind:value={options.size}
    containerProps={{ style: 'margin-left: 4rem' }}
    options={['large', 'medium', 'small']}
    openOnFocus
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
    size="10"
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
    <span class="label">Pills</span>
    <SphereBackdrop glass={options.glass}>
      <NeoPill {...options}>default</NeoPill>
    </SphereBackdrop>
    <SphereBackdrop glass={options.glass}>
      <NeoPill pressed {...options}>pressed</NeoPill>
    </SphereBackdrop>

    <SphereBackdrop glass={options.glass}>
      <NeoPill {...options}>
        <IconAccount style="margin-inline: -0.1875rem 0.325rem" />
        <span>Icon</span>
      </NeoPill>
    </SphereBackdrop>
  </div>

  <div class="row">
    <span class="label">Badges</span>
    <SphereBackdrop glass={options.glass}>
      <NeoBadge value="1" {...options} glass={true} size={'medium'} elevation="2" tinted>
        <NeoButton glass={options.glass} rounded={options.rounded}>Default</NeoButton>
      </NeoBadge>
    </SphereBackdrop>

    <SphereBackdrop glass={options.glass}>
      <NeoBadge {...options} glass={false} size={'small'} elevation="0" filled offset={{ x: '-4%', y: '-2%' }}>
        <NeoButton glass={options.glass} rounded={options.rounded}>Custom snippet</NeoButton>

        {#snippet value()}
          <IconMail size="1.25rem" />
        {/snippet}
      </NeoBadge>
    </SphereBackdrop>
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

    margin: 4rem 0;
  }

  @media (width < 1200px) {
    .row {
      margin: 2rem 0;
    }
  }
</style>
