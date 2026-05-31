<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in NeoCard.svelte
    were guarding. If a future cascade-layers refactor moves rules across
    layers these snapshots flip the moment the guard breaks.

    1. flat + borderless — NeoCard.svelte:354 chain. Borderless must win over
       flat's `border-color` rule.
    2. glass + inset — NeoCard.svelte:477 (the 7-arg guard). Glass-variant
       border rule must be skipped when also inset.
    3. segmented + media-cover — NeoCard.svelte:444/449/458 chains. Segmented
       padding must apply correctly when a `.neo-card-media` segment is
       present alongside content segments.
  */
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="flat-borderless">
        <NeoCard elevation={0} rounded borderless width={{ absolute: '14rem' }} height={{ absolute: '8rem' }}>
          <span class="card-text">flat + borderless</span>
        </NeoCard>
      </div>
      <div data-cell="glass-inset">
        <NeoCard elevation={-2} rounded glass width={{ absolute: '14rem' }} height={{ absolute: '8rem' }}>
          <span class="card-text">glass + inset</span>
        </NeoCard>
      </div>
      <div data-cell="segmented-cover">
        <NeoCard elevation={2} rounded segmented width={{ absolute: '14rem' }} height={{ absolute: '12rem' }}>
          {#snippet media()}
            <div class="media-stub">media</div>
          {/snippet}
          <span class="card-text">segmented + cover</span>
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

  .media-stub {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4rem;
    color: var(--neo-text-color-inverse, #fff);
    font-size: 0.75rem;
    background: var(--neo-color-primary, #4a6cf7);
  }
</style>
