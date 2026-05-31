<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in
    NeoCollapse.svelte were guarding:

    1. readonly closed — :175 chain (`&:not(.neo-readonly)` — most rules apply
       only when not readonly).
    2. horizontal open — :212/:259/:263 chains. Horizontal layout swaps the
       open transition axis.
    3. disabled — :180 chain (`[disabled]:not([disabled='false'])`).
  */
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="readonly">
        <span class="cell-label">readonly closed</span>
        <NeoCollapse id="rd1" label="Readonly" readonly rounded elevation={1} unmountOnClose={false}>
          <p>Hidden content</p>
        </NeoCollapse>
      </div>
      <div data-cell="horizontal">
        <span class="cell-label">horizontal open</span>
        <NeoCollapse id="hz1" label="Horizontal" open horizontal rounded elevation={1} unmountOnClose={false}>
          <p>Side body</p>
        </NeoCollapse>
      </div>
      <div data-cell="disabled">
        <span class="cell-label">disabled</span>
        <NeoCollapse id="ds1" label="Disabled" disabled rounded elevation={1} unmountOnClose={false}>
          <p>Body</p>
        </NeoCollapse>
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
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(16rem, 1fr));
    gap: 1.5rem;
  }

  .cell-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
