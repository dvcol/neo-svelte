<script lang="ts">
  import DemoElevationPicker from '../utils/DemoElevationPicker.svelte';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model';

  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoSkeletonMedia from '~/skeleton/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeleton/NeoSkeletonText.svelte';
  import { DefaultShadowElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  let skeleton = $state(false);
  const options = $state<NeoCardProps>({
    elevation: DefaultShadowElevation,
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

  const onElevation = () => {
    if (options.elevation + options.hover < MinShadowElevation) options.hover += 1;
    if (options.elevation + options.hover > MaxShadowElevation) options.hover -= 1;
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

  <DemoElevationPicker bind:elevation={options.elevation} {onElevation} />
  <DemoElevationPicker
    label="Hover"
    reset={0}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    bind:elevation={options.hover}
  />
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

{#snippet card(props: NeoTabsProps = {}, hideContent = false)}
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
          <SphereBackdrop>{@render card(props, hideContent)}</SphereBackdrop>
        {:else}
          {@render card(props, hideContent)}
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
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
