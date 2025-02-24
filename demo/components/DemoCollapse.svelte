<script lang="ts">
  import NeoNumberStep from '../../src/lib/inputs/NeoNumberStep.svelte';

  import type { NeoCollapseGroupProps } from '~/collapse/neo-collapse-group.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoCollapseGroup from '~/collapse/NeoCollapseGroup.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';

  const options = $state<NeoCollapseGroupProps>({
    disabled: false,
    min: 0,
    max: 3,
  });

  let controlled = $state(false);
</script>

<div class="row">
  <NeoButton rounded toggle bind:checked={options.disabled}>Disabled</NeoButton>

  <NeoNumberStep
    label="Minimum"
    placement="left"
    center
    bind:value={options.min}
    min={0}
    max={3}
    defaultValue={0}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />

  <NeoNumberStep
    label="Maximum"
    placement="left"
    center
    bind:value={options.max}
    min={0}
    max={3}
    defaultValue={3}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
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
    <NeoCollapseGroup {...options}>
      <NeoCollapse label="Section 1" children={content} />
      <NeoCollapse label="Section 2" children={content} />
      <NeoCollapse label="Section 3" children={content} />
    </NeoCollapseGroup>
  </div>
</div>

<div class="row">
  <div class="column content">
    <span class="label">Description</span>
    <NeoCollapseGroup {...options}>
      <NeoCollapse id="section 1" label="Section 1" description="This is a description" children={content} />
      <NeoCollapse id="section 2" label="Section 2" description="This is a description" children={content} />
      <NeoCollapse id="section 3" label="Section 3" description="This is a description" children={content} />
    </NeoCollapseGroup>
  </div>
</div>

<div class="row">
  <div class="column">
    <span class="label">Controlled</span>
    <NeoButton text toggle hover="-1" active="-2" bind:checked={controlled}>Toggle</NeoButton>
    <NeoCollapseGroup {...options}>
      <NeoCollapse children={content} open={controlled} />
    </NeoCollapseGroup>
  </div>
</div>

{#snippet horizontalContent()}
  <NeoSkeletonMedia width="20rem" />
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Horizontal</span>
    <div class="row content">
      <NeoCollapseGroup {...options}>
        <NeoCollapse horizontal label="Click Me" description="Section 1" children={horizontalContent} />
        <NeoCollapse horizontal label="Click Me" description="Section 2" children={horizontalContent} />
        <NeoCollapse horizontal label="Click Me" description="Section 3" children={horizontalContent} />
      </NeoCollapseGroup>
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
