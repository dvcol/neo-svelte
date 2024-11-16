<script lang="ts">
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model';

  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoSkeletonMedia from '~/skeleton/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeleton/NeoSkeletonText.svelte';

  let skeleton = $state(false);
  const options = $state<NeoCardProps>({
    elevation: 2,
    borderless: false,
    rounded: true,
    glass: false,
    hover: 0,
    close: false,
    horizontal: false,
    onClose: (e: MouseEvent) => {
      console.info('onClose', e);
    },
  });

  const onElevation = (value: number) => {
    const halfStep = (value > 0 && [-1, -0.5, 0, 0.5].includes(options.elevation)) || (value < 0 && [-0.5, 0, 0.5, 1].includes(options.elevation));
    options.elevation += halfStep ? Math.sign(value) * 0.5 : value;
    if (options.elevation + options.hover < -4) options.hover += 1;
    if (options.elevation + options.hover > 4) options.hover -= 1;
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

  const columns: { label: string; props?: NeoCardProps; hideContent?: boolean }[] = [
    { label: 'Default' },
    {
      label: 'Header',
      props: { header },
    },
    {
      label: 'Footer',
      props: { header, footer },
    },
    {
      label: 'Action',
      props: { header, footer, action },
    },
    { label: 'Only Image', props: { media }, hideContent: true },
    { label: 'Only Cover', props: { media, cover: true }, hideContent: true },
    { label: 'Image', props: { header, footer, action, media } },
    { label: 'Cover', props: { header, footer, action, media, cover: true } },
    { label: 'Segmented', props: { header, media, cover: true, footer, action, segmented: true } },
    { label: 'Segmented inset', props: { header, media, cover: true, footer, action, segmented: -1 } },
    { label: 'Segmented raised', props: { header, media, cover: true, footer, action, segmented: 1 } },
    { label: 'Horizontal', props: { media, cover: true, horizontal: true } },
    { label: 'Horizontal inset', props: { media, horizontal: true, segmented: -1 } },
    { label: 'Horizontal raised', props: { header, action, horizontal: true, segmented: 1 } },
  ];
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
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

{#snippet lorem({ horizontal }: NeoCardProps)}
  <NeoSkeletonText
    loading={skeleton}
    paragraphs="2"
    width="80ch"
    containerProps={{ style: horizontal ? 'min-height: 21.5rem; max-width: 50dvw' : 'min-height: 21.5rem' }}
  >
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
        suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo
        nascetur parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
      </p>
    </div>
  </NeoSkeletonText>
{/snippet}

{#snippet media({ horizontal }: NeoCardContext)}
  <NeoSkeletonMedia
    loading={skeleton}
    type="image"
    ratio="1.5"
    width="calc(80ch + 3rem)"
    containerProps={{ style: horizontal ? 'max-width: 30dvw' : undefined }}
  >
    <img
      height="100%"
      width="100%"
      src="https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt="Placeholder"
    />
  </NeoSkeletonMedia>
{/snippet}

{#snippet header()}
  <NeoSkeletonText loading={skeleton} title paragraphs="0" width="8.125rem">
    <h2 style="margin: 0 0.25rem">NeoCard Header</h2>
  </NeoSkeletonText>
{/snippet}

{#snippet footer()}
  <NeoSkeletonText loading={skeleton} title paragraphs="0" width="8.125rem">
    <div>This is the footer</div>
  </NeoSkeletonText>
{/snippet}

{#snippet action({ rounded, elevation, horizontal })}
  <NeoButtonGroup {skeleton} {rounded} shallow={Math.abs(elevation) < 2} vertical={horizontal}>
    <NeoButton>Left</NeoButton>
    <NeoButton>Middle</NeoButton>
    <NeoButton>Right</NeoButton>
  </NeoButtonGroup>
{/snippet}

{#snippet group(props: NeoTabsProps = {}, hideContent = false)}
  {#if hideContent}
    <NeoCard {...options} {...props} />
  {:else}
    <NeoCard {...options} {...props}>
      {@render lorem(props)}
    </NeoCard>
  {/if}
{/snippet}

<div class="row">
  {#each columns as { label, props, hideContent }}
    <div class="column content">
      <span class="label">{label}</span>

      <div class="column-item">
        {#if props?.glass || options.glass}
          <SphereBackdrop>{@render group(props, hideContent)}</SphereBackdrop>
        {:else}
          {@render group(props, hideContent)}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .content {
    overflow: auto;
  }

  .column-item {
    max-width: 100dvw;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    align-self: flex-start;
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
</style>
