<script lang="ts">
  import NeoNumberStep from '../../src/lib/inputs/NeoNumberStep.svelte';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoAccordionProps } from '~/collapse/neo-accordion.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoCollapseGroup from '~/collapse/NeoCollapseGroup.svelte';
  import { defaultCollapseGroupStrategy } from '~/collapse/neo-collapse-context.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import {
    DefaultShadowElevation,
    DefaultShadowHoverElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    MaxShadowElevation,
    MinShadowElevation,
  } from '~/utils/shadow.utils';

  const options = $state<NeoAccordionProps>({
    disabled: false,
    readonly: false,
    segmented: true,

    borderless: false,
    rounded: false,
    pressed: false,
    glass: false,
    tinted: false,

    elevation: 0,
    hover: 0,

    group: {
      min: 0,
      max: 3,
      strategy: defaultCollapseGroupStrategy,
    },
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
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton toggle bind:checked={options.segmented}>Segmented</NeoButton>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.pressed} onclick={onPressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShadowElevation}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowElevation}
    oninput={onElevation}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />
  <NeoNumberStep
    label="Hover"
    placement="left"
    center
    bind:value={options.hover}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    defaultValue={DefaultShadowHoverElevation}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 4rem' }}
    rounded
    glass
  />

  <NeoNumberStep
    label="Minimum"
    placement="left"
    center
    bind:value={options.group.min}
    min={0}
    max={3}
    defaultValue={0}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />

  <NeoNumberStep
    label="Maximum"
    placement="left"
    center
    bind:value={options.group.max}
    min={0}
    max={3}
    defaultValue={3}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
    rounded
    glass
  />
</div>

{#snippet content()}
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
{/snippet}

<section>
  <div class="row">
    <div class="column content">
      <span class="label">Default</span>

      <SphereBackdrop glass={options.glass} style="width: 100%">
        <NeoAccordion {...options}>
          <NeoCollapse label="Section 1" children={content} />
          <NeoCollapse label="Section 2" children={content} />
          <NeoCollapse label="Section 3" children={content} />
        </NeoAccordion>
      </SphereBackdrop>
    </div>
  </div>

  <div class="row">
    <div class="column content">
      <span class="label">Description</span>
      <SphereBackdrop glass={options.glass} style="width: 100%">
        <NeoAccordion {...options}>
          <NeoCollapse id="section 1" label="Section 1" description="This is a description" children={content} />
          <NeoCollapse id="section 2" label="Section 2" description="This is a description" children={content} />
          <NeoCollapse id="section 3" label="Section 3" description="This is a description" children={content} />
        </NeoAccordion>
      </SphereBackdrop>
    </div>
  </div>

  <div class="row">
    <div class="column content">
      <span class="label">Separated</span>

      <SphereBackdrop glass={options.glass} style="width: 100%">
        <NeoCollapseGroup {...options.group}>
          <NeoAccordion {...options} group={undefined}>
            <NeoCollapse label="Section 1" children={content} />
          </NeoAccordion>
          <NeoAccordion {...options} group={undefined}>
            <NeoCollapse label="Section 2" children={content} />
          </NeoAccordion>
          <NeoAccordion {...options} group={undefined}>
            <NeoCollapse label="Section 3" children={content} />
          </NeoAccordion>
        </NeoCollapseGroup>
      </SphereBackdrop>
    </div>
  </div>

  <div class="row">
    <div class="column content">
      <span class="label">External trigger</span>
      <NeoButton text toggle hover="-1" active="-2" bind:checked={controlled}>Toggle</NeoButton>
      <SphereBackdrop glass={options.glass} style="width: 100%">
        <NeoAccordion {...options}>
          <NeoCollapse children={content} open={controlled} />
        </NeoAccordion>
      </SphereBackdrop>
    </div>
  </div>

  {#snippet horizontalContent()}
    <NeoSkeletonMedia width="20rem" />
  {/snippet}

  <div class="row">
    <div class="column horizontal">
      <span class="label">Horizontal</span>
      <SphereBackdrop glass={options.glass}>
        <NeoAccordion horizontal {...options}>
          <NeoCollapse horizontal label="Click Me" description="Section 1" children={horizontalContent} />
          <NeoCollapse horizontal label="Click Me" description="Section 2" children={horizontalContent} />
          <NeoCollapse horizontal label="Click Me" description="Section 3" children={horizontalContent} />
        </NeoAccordion>
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
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.content {
      width: min(80vw, 80ch);
    }

    &.horizontal {
      :global(.neo-accordion .neo-collapse-trigger) {
        min-height: 15rem;
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
