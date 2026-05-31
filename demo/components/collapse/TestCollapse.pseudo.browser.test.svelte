<script lang="ts">
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoCollapse id="i" label="Idle" elevation={-3} hover={4} rounded data-testid="target-idle" unmountOnClose={false}>
        <p>body</p>
      </NeoCollapse>
      <NeoCollapse id="t" label="Hover me" elevation={-3} hover={4} rounded data-testid="target" unmountOnClose={false}>
        <p>body</p>
      </NeoCollapse>
      <NeoCollapse id="d" label="Off" elevation={-3} hover={4} rounded disabled data-testid="target-disabled" unmountOnClose={false}>
        <p>body</p>
      </NeoCollapse>
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

  .row {
    display: grid;
    grid-template-columns: repeat(3, minmax(12rem, 1fr));
    gap: 1.5rem;
  }
</style>
