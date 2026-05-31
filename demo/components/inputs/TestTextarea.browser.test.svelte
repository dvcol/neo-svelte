<script lang="ts">
  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const long = 'The quick brown fox jumps over the lazy dog.\nMultiple lines lock the autosize chrome.';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">idle</span>
      <NeoTextarea label="Idle" />

      <span class="cell-label">filled</span>
      <NeoTextarea label="Filled" value={long} />

      <span class="cell-label">disabled</span>
      <NeoTextarea label="Disabled" value={long} disabled />
    </section>

    <section class="row">
      <span class="cell-label">readonly</span>
      <NeoTextarea label="Readonly" value={long} readonly />

      <span class="cell-label">invalid</span>
      <NeoTextarea label="Invalid" value="bad" valid={false} validation />

      <span class="cell-label">valid</span>
      <NeoTextarea label="Valid" value="ok" valid validation />
    </section>

    <section class="row">
      <span class="cell-label">glass</span>
      <NeoTextarea label="Glass" value={long} glass />

      <span class="cell-label">tinted</span>
      <NeoTextarea label="Tinted" value={long} tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoTextarea label="Rounded" value={long} rounded />
    </section>

    <section class="row">
      <span class="cell-label">pressed</span>
      <NeoTextarea label="Pressed" value={long} pressed />

      <span class="cell-label">borderless</span>
      <NeoTextarea label="Borderless" value={long} borderless />

      <span class="cell-label">clearable</span>
      <NeoTextarea label="Clearable" value="text" clearable />
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
    grid-template-columns: 5rem minmax(10rem, 1fr) 5rem minmax(10rem, 1fr) 5rem minmax(10rem, 1fr);
    gap: 0.75rem 1rem;
    align-items: start;
  }

  @media (width <= 480px) {
    .row {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .cell-label {
    padding-top: 0.5rem;
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
