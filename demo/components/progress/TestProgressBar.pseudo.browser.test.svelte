<script lang="ts">
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <div data-testid="target-idle"><NeoProgressBar elevation={-3} hover={4} rounded value={50} /></div>
      <div data-testid="target"><NeoProgressBar elevation={-3} hover={4} rounded value={50} /></div>
      <div data-testid="target-disabled"><NeoProgressBar elevation={-3} hover={4} rounded value={50} disabled /></div>
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) { height: 100%; margin: 0; padding: 0; }
  .visual-stage { display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100vw; min-height: 100vh; padding: 2rem; }
  .row { display: grid; grid-template-columns: repeat(3, minmax(10rem, 1fr)); gap: 1.5rem; }
</style>
