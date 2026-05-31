<script lang="ts">
  /*
    State-isolated grid: one NeoCard per visual state we care about. Each cell
    forces the state via a bindable (hovered/focused), a static prop
    (disabled/skeleton), or its absence (idle). Pins that the cascade renders
    each state correctly *in isolation*, separate from the variant matrix.
  */
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="idle">
        <NeoCard elevation={2} rounded width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
          <span class="card-text">idle</span>
        </NeoCard>
      </div>
      <div data-cell="hovered">
        <NeoCard elevation={2} rounded hovered width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
          <span class="card-text">hovered</span>
        </NeoCard>
      </div>
      <div data-cell="focused">
        <NeoCard elevation={2} rounded focused width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
          <span class="card-text">focused</span>
        </NeoCard>
      </div>
      <div data-cell="disabled">
        <NeoCard elevation={2} rounded disabled width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
          <span class="card-text">disabled</span>
        </NeoCard>
      </div>
      <div data-cell="skeleton">
        <NeoCard elevation={2} rounded skeleton width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
          <span class="card-text">skeleton</span>
        </NeoCard>
      </div>
    </div>
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

  .grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 1.5rem;
  }

  .card-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
