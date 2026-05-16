<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoSkeletonContainer from '~/skeletons/NeoSkeletonContainer.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  const {
    composite = false,
    loading = true,
    variant = 'text',
    contentText = 'Loaded content goes here',
  }: {
    composite?: boolean;
    loading?: boolean;
    variant?: 'text' | 'media';
    contentText?: string;
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if composite}
      <div class="composite">
        <div class="cell" data-cell="text-loading">
          <NeoSkeletonContainer loading={true} width="14rem" height="6rem">
            {#snippet content()}
              <div class="content">Loaded</div>
            {/snippet}
            <NeoSkeletonText paragraph={2} />
          </NeoSkeletonContainer>
        </div>
        <div class="cell" data-cell="media-loading">
          <NeoSkeletonContainer loading={true} width="14rem" height="6rem">
            {#snippet content()}
              <div class="content">Loaded</div>
            {/snippet}
            <NeoSkeletonMedia />
          </NeoSkeletonContainer>
        </div>
        <div class="cell" data-cell="content-loaded">
          <NeoSkeletonContainer loading={false} width="14rem" height="6rem">
            {#snippet content()}
              <div class="content">Loaded</div>
            {/snippet}
            <NeoSkeletonText paragraph={2} />
          </NeoSkeletonContainer>
        </div>
      </div>
    {:else}
      <div class="frame">
        <NeoSkeletonContainer {loading} width="14rem" height="6rem">
          {#snippet content()}
            <div class="content">{contentText}</div>
          {/snippet}
          {#if variant === 'media'}
            <NeoSkeletonMedia />
          {:else}
            <NeoSkeletonText paragraph={2} />
          {/if}
        </NeoSkeletonContainer>
      </div>
    {/if}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .composite {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }

  .cell,
  .frame {
    width: 14rem;
    height: 6rem;
    padding: 0.5rem;
    border: 1px dashed var(--neo-border-color, color-mix(in srgb, currentcolor 20%, transparent));
    border-radius: 0.5rem;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
    text-align: center;
    background: var(--neo-background-color-secondary, color-mix(in srgb, currentcolor 10%, transparent));
    border-radius: 0.25rem;
  }
</style>
