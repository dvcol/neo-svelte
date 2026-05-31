<script lang="ts">
  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoRadioButton elevation={-3} hover={4} rounded data-testid="target-idle" />
      <NeoRadioButton elevation={-3} hover={4} rounded data-testid="target" />
      <NeoRadioButton elevation={-3} hover={4} rounded disabled data-testid="target-disabled" />
    </div>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) { height: 100%; margin: 0; padding: 0; }
  .visual-stage { display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100vw; min-height: 100vh; padding: 2rem; }
  .row { display: flex; gap: 2rem; align-items: center; }
</style>
