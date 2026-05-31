<script lang="ts">
  import NeoCheckbox from '~/inputs/NeoCheckbox.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <div data-testid="target-idle"><NeoCheckbox elevation={-3} hover={4} rounded label="Idle" /></div>
      <div data-testid="target"><NeoCheckbox elevation={-3} hover={4} rounded label="Hover me" /></div>
      <div data-testid="target-disabled"><NeoCheckbox elevation={-3} hover={4} rounded disabled label="Off" /></div>
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) { height: 100%; margin: 0; padding: 0; }
  .visual-stage { display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100vw; min-height: 100vh; padding: 2rem; }
  .row { display: flex; gap: 2rem; align-items: center; }
</style>
