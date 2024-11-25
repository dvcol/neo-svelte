<script lang="ts">
  import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  const options = $state<NeoSkeletonTextProps>({
    loading: true,
  });

  const titleProps = { style: 'align-self: center; width: 12rem', class: 'test' };

  type ContentProps = { height?: string; width?: string };
  type Column = { type: 'text' | 'media'; label: string; props?: NeoSkeletonTextProps; content?: ContentProps };
  const columns: Column[] = [
    { type: 'text', label: 'Default' },
    { type: 'text', label: 'Title', props: { title: true, titleProps }, content: { height: '15rem' } },
    { type: 'text', label: 'Paragraphs', props: { titleProps, paragraphs: 2 }, content: { height: '25rem' } },
    { type: 'text', label: 'Alt', props: { titleProps, alt: true }, content: { height: '14rem' } },
    { type: 'text', label: 'Alt Justify', props: { titleProps, alt: true, justify: true }, content: { height: '14rem' } },
    { type: 'media', label: 'Video', props: { type: 'video' }, content: { width: '40rem' } },
    { type: 'media', label: 'Image', props: { type: 'image' }, content: { width: '30rem' } },
    { type: 'media', label: 'Empty', content: { width: '30rem' } },
    { type: 'media', label: 'Rounded', props: { rounded: true }, content: { width: '30rem' } },
    { type: 'media', label: 'Avatar', props: { type: 'avatar', circle: true }, content: { height: '9rem', width: '9rem' } },
  ];
</script>

<div class="row">
  <NeoButtonGroup>
    <NeoButton toggle bind:checked={options.loading}>Skeleton</NeoButton>
  </NeoButtonGroup>
</div>

{#snippet lorem(props: NeoSkeletonTextProps)}
  <div class="column">
    {#if props?.title}
      <h3>Lorem ipsum odor amet</h3>
    {/if}

    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
    </p>

    {#if props?.paragraphs > 1}
      <p>
        Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
        consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
        sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
        suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo
        nascetur parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
      </p>
    {/if}
  </div>
{/snippet}

{#snippet skeleton({ type, props, content }: Column)}
  <div class="column" class:content={type === 'text'} style:height={content?.height} style:width={content?.width}>
    {#if type === 'text'}
      <NeoSkeletonText {...props} {...options}>
        {@render lorem(props)}
      </NeoSkeletonText>
    {:else}
      <NeoSkeletonMedia {...props} {...options} />
    {/if}
  </div>
{/snippet}

<div class="row">
  <div class="column">
    <span class="label">No content</span>
    <div class="content">
      <NeoSkeletonText {...options} />
    </div>
  </div>
  {#each columns as col}
    <div class="column">
      <span class="label">{col.label}</span>
      {@render skeleton(col)}
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .content {
    min-width: 48.625rem;
    min-height: 10rem;
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
