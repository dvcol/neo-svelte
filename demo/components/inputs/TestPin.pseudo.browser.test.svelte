<script lang="ts">
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <div data-testid="target-idle"><NeoPin count={3} elevation={-3} hover={4} rounded type="text" /></div>
      <div data-testid="target"><NeoPin count={3} elevation={-3} hover={4} rounded type="text" /></div>
      <div data-testid="target-disabled"><NeoPin count={3} elevation={-3} hover={4} rounded type="text" disabled /></div>
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) { height: 100%; margin: 0; padding: 0; }
  .visual-stage { display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100vw; min-height: 100vh; padding: 2rem; }
  .row { display: flex; gap: 2rem; align-items: center; }
</style>
