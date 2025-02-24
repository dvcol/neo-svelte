<script lang="ts">
  import { colorOptions } from '../utils/color.utils';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import {
    DefaultShadowElevation,
    DefaultShadowHoverElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    MaxShadowElevation,
    MinShadowElevation,
  } from '~/utils/shadow.utils';

  const options = $state({
    borderless: false,
    rounded: false,
    pressed: false,
    glass: false,
    tinted: false,
    disabled: false,
    skeleton: false,

    elevation: 0,
    hover: 0,
  });

  const onPressed = () => {
    options.elevation = getDefaultElevation(options.pressed);
    options.hover = getDefaultHoverElevation(options.pressed);
  };

  const onElevation = () => {
    if (options.elevation + options.hover < MinShadowElevation) options.hover += 1;
    if (options.elevation + options.hover > MaxShadowElevation) options.hover -= 1;
  };

  let controlled = $state(false);
</script>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.pressed} onclick={onPressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShadowElevation}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowElevation}
    rounded={options.rounded}
    oninput={onElevation}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />
  <NeoNumberStep
    label="Hover"
    placement="left"
    center
    bind:value={options.hover}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    defaultValue={DefaultShadowHoverElevation}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 4rem' }}
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
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
    openOnFocus
  />
</div>

{#snippet content()}
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Default</span>
    <NeoCollapse label="Click Me" children={content} {...options}></NeoCollapse>
    <NeoCollapse label="Click Me" children={content} {...options}></NeoCollapse>
    <NeoCollapse label="Click Me" children={content} {...options}></NeoCollapse>
  </div>
</div>

<div class="row">
  <div class="column content">
    <span class="label">Description</span>
    <NeoCollapse label="Click Me" description="This is a description" children={content} {...options}></NeoCollapse>
    <NeoCollapse label="Click Me" description="This is a description" children={content} {...options}></NeoCollapse>
    <NeoCollapse label="Click Me" description="This is a description" children={content} {...options}></NeoCollapse>
  </div>
</div>

<div class="row">
  <div class="column">
    <span class="label">Controlled</span>
    <NeoButton text toggle hover="-1" active="-2" bind:checked={controlled}>Toggle</NeoButton>
    <NeoCollapse children={content} {...options} open={controlled}></NeoCollapse>
  </div>
</div>

{#snippet horizontalContent()}
  <NeoSkeletonMedia width="20rem" />
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Horizontal</span>
    <div class="row content">
      <NeoCollapse horizontal label="Click Me" description="Section 1" children={horizontalContent} {...options}></NeoCollapse>
      <NeoCollapse horizontal label="Click Me" description="Section 2" children={horizontalContent} {...options}></NeoCollapse>
      <NeoCollapse horizontal label="Click Me" description="Section 3" children={horizontalContent} {...options}></NeoCollapse>
    </div>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.content {
      width: min(80vw, 80ch);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;

    &.content {
      flex-wrap: nowrap;
      height: 20rem;
    }
  }
</style>
