<script lang="ts">
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { colorOptions } from '../utils/color.utils';

  import type { NeoCardContext, NeoCardProps } from '~/cards/neo-card.model.js';

  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { DefaultShadowElevation, getDefaultElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  let skeleton = $state(false);
  const options = $state<NeoCardProps>({
    elevation: DefaultShadowElevation,
    borderless: false,
    rounded: true,
    glass: false,
    tinted: false,
    color: '',
    hover: 0,
    pressed: false,
    convex: false,
    close: false,
    horizontal: false,
    onClose: (e: MouseEvent) => {
      console.info('onClose', e);
    },
  });

  const onPressed = () => {
    options.elevation = getDefaultElevation(options.pressed);
  };

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
    <NeoButton toggle bind:checked={options.convex}>Convex</NeoButton>
    <NeoButton toggle bind:checked={options.pressed} onclick={onPressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
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
    groupProps={{ style: 'margin-left: 4rem' }}
  />
  <NeoNumberStep
    label="Hover"
    placement="left"
    center
    bind:value={options.hover}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    defaultValue={0}
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

{#snippet lorem({ horizontal }: NeoCardProps)}
  <NeoSkeletonText
    loading={skeleton}
    paragraphs="2"
    lines={[6, 7]}
    transitionProps={{ style: horizontal ? 'min-height: 21.5rem; max-width: 50dvw' : 'min-height: 21.5rem' }}
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
  <NeoSkeletonMedia loading={skeleton} type="image" ratio="1.5" transitionProps={{ style: horizontal ? 'max-width: 30dvw' : undefined }}>
    <img
      height="100%"
      width="100%"
      src="https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt="Placeholder"
    />
  </NeoSkeletonMedia>
{/snippet}

{#snippet header()}
  <NeoSkeletonText loading={skeleton} title paragraphs="0">
    <h3 style="margin: 0">NeoCard Header</h3>
  </NeoSkeletonText>
{/snippet}

{#snippet footer()}
  <NeoSkeletonText loading={skeleton} title paragraphs="0">
    <div>This is the footer</div>
  </NeoSkeletonText>
{/snippet}

{#snippet action({ rounded, elevation, horizontal })}
  <NeoButtonGroup
    pressed
    {skeleton}
    {rounded}
    elevation={elevation > 3 ? 3 : Math.abs(elevation)}
    vertical={horizontal}
    glass={options.glass}
    borderless={options.borderless}
  >
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
        <SphereBackdrop glass={props?.glass || options.glass}>
          {@render card(props, hideContent)}
        </SphereBackdrop>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .content {
    overflow: unset;
  }

  .column-item {
    max-width: 100dvw;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    align-self: flex-start;
    text-wrap: balance;
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
