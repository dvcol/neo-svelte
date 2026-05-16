<script lang="ts">
  import NeoLoadingMatrix from '~/loading/NeoLoadingMatrix.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <NeoLoadingMatrix width="2rem" height="2rem" />
    </div>
    <div class="cell">
      <NeoLoadingMatrix width="3rem" height="3rem" />
    </div>
    <div class="cell">
      <NeoLoadingMatrix width="5rem" height="5rem" />
    </div>
    <div class="cell colored">
      <NeoLoadingMatrix width="3rem" height="3rem" />
    </div>
    <div class="cell accent">
      <NeoLoadingMatrix width="3rem" height="3rem" />
    </div>
    <div class="cell" style:flex-direction="column">
      <NeoLoadingMatrix width="4rem" height="4rem" />
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :global(.neo-loading-matrix), :global(.neo-loading-matrix *) {
    animation-play-state: paused !important;
  }

  .visual-stage {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 8rem;
    padding: 1rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .colored {
    color: var(--neo-color-primary);
  }

  .accent {
    color: var(--neo-color-success);
  }
</style>
