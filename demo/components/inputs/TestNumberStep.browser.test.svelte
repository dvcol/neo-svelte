<script lang="ts">
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">zero</span>
      <NeoNumberStep label="Zero" value={0} min={0} max={10} />

      <span class="cell-label">mid</span>
      <NeoNumberStep label="Mid" value={5} min={0} max={10} />

      <span class="cell-label">at-min</span>
      <NeoNumberStep label="Min" value={0} min={0} max={10} />
    </section>

    <section class="row">
      <span class="cell-label">at-max</span>
      <NeoNumberStep label="Max" value={10} min={0} max={10} />

      <span class="cell-label">disabled</span>
      <NeoNumberStep label="Disabled" value={3} min={0} max={10} disabled />

      <span class="cell-label">readonly</span>
      <NeoNumberStep label="Readonly" value={3} min={0} max={10} readonly />
    </section>

    <section class="row">
      <span class="cell-label">glass</span>
      <NeoNumberStep label="Glass" value={4} glass />

      <span class="cell-label">tinted</span>
      <NeoNumberStep label="Tinted" value={4} tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoNumberStep label="Rounded" value={4} rounded />
    </section>
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
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: 5rem 16rem 5rem 16rem 5rem 16rem;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
