<script lang="ts">
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoCardProps } from '~/cards/neo-card.model';

  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoSkeletonText from '~/skeleton/NeoSkeletonText.svelte';

  let skeleton = $state(false);
  const options = $state<NeoCardProps>({
    elevation: 2,
    borderless: false,
    hover: 0,
  });

  const onElevation = (value: number) => {
    const halfStep = (value > 0 && [-1, -0.5, 0, 0.5].includes(options.elevation)) || (value < 0 && [-0.5, 0, 0.5, 1].includes(options.elevation));
    options.elevation += halfStep ? Math.sign(value) * 0.5 : value;
  };

  const resetElevation = () => {
    options.elevation = 2;
  };

  const onHoverElevation = (value: number) => {
    options.hover += value;
  };
  const resetHover = () => {
    options.hover = 0;
  };

  const columns: { label: string; props?: NeoCardProps }[] = [{ label: 'Default' }, { label: 'Glass', props: { glass: true } }];
</script>

<div class="row">
  <NeoButtonGroup>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <span class="label">Elevation</span>
  <NeoButtonGroup rounded>
    <NeoButton disabled={options.elevation <= -4} onclick={() => onElevation(-1)}>
      {#snippet icon()}
        <IconMinus />
      {/snippet}
    </NeoButton>
    <NeoButton onclick={resetElevation}>{options.elevation}</NeoButton>
    <NeoButton disabled={options.elevation >= 4} onclick={() => onElevation(1)}>
      {#snippet icon()}
        <IconAdd />
      {/snippet}
    </NeoButton>
  </NeoButtonGroup>

  <span class="label">Hover Elevation</span>
  <NeoButtonGroup rounded>
    <NeoButton disabled={options.hover + options.elevation <= -4} onclick={() => onHoverElevation(-1)}>
      {#snippet icon()}
        <IconMinus />
      {/snippet}
    </NeoButton>
    <NeoButton onclick={resetHover}>{options.hover}</NeoButton>
    <NeoButton disabled={options.hover + options.elevation >= 4} onclick={() => onHoverElevation(1)}>
      {#snippet icon()}
        <IconAdd />
      {/snippet}
    </NeoButton>
  </NeoButtonGroup>
</div>

{#snippet lorem()}
  <div class="column">
    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
    </p>

    <p>
      Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
      consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
      sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
      suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo nascetur
      parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
    </p>
  </div>
{/snippet}

{#snippet group(props: NeoTabsProps = {})}
  <div class="column">
    <NeoCard style="min-width: 48.625rem; min-height: 30.875rem;" {...options} {...props}>
      <NeoSkeletonText loading={skeleton} paragraphs="2">
        {@render lorem()}
      </NeoSkeletonText>
    </NeoCard>
  </div>
{/snippet}

<div class="row">
  {#each columns as { label, props }}
    <div class="column">
      <span class="label">{label}</span>

      {#if props?.glass}
        <SphereBackdrop>{@render group(props)}</SphereBackdrop>
      {:else}
        {@render group(props)}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
</style>
