<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoSkeletonMedia from '~/skeletons/NeoSkeletonMedia.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <span class="label">text — 1 line</span>
      <NeoSkeletonText loading lines={1} width="100%" />
    </div>
    <div class="cell">
      <span class="label">text — 3 lines</span>
      <NeoSkeletonText loading lines={3} width="100%" />
    </div>
    <div class="cell">
      <span class="label">text — title + 5 lines</span>
      <NeoSkeletonText loading lines={5} title width="100%" />
    </div>
    <div class="cell">
      <span class="label">text — alt format</span>
      <NeoSkeletonText loading alt lines={3} width="100%" />
    </div>
    <div class="cell">
      <span class="label">media — image (4:3)</span>
      <NeoSkeletonMedia loading type="image" width="14rem" />
    </div>
    <div class="cell">
      <span class="label">media — video (16:9)</span>
      <NeoSkeletonMedia loading type="video" width="14rem" />
    </div>
    <div class="cell">
      <span class="label">media — avatar (rounded)</span>
      <NeoSkeletonMedia loading type="avatar" circle width="6rem" height="6rem" />
    </div>
    <div class="cell">
      <span class="label">media — audio</span>
      <NeoSkeletonMedia loading type="audio" width="14rem" />
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :global(.neo-skeleton), :global(.neo-skeleton *) {
    animation-play-state: paused !important;
  }

  .visual-stage {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .label {
    color: var(--neo-text-color-secondary);
    font-size: 0.75rem;
  }
</style>
