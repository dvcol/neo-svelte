<script lang="ts">
  /*
    State-isolated grid: one NeoButton per visual state. Forces each pseudo
    via bindable (hovered/focused), boolean prop (pressed/loading/disabled),
    or its absence (idle).
  */
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="idle"><NeoButton elevation={2} rounded>Idle</NeoButton></div>
      <div data-cell="hovered"><NeoButton elevation={2} rounded hovered>Hovered</NeoButton></div>
      <div data-cell="focused"><NeoButton elevation={2} rounded focused>Focused</NeoButton></div>
      <div data-cell="pressed"><NeoButton elevation={2} rounded pressed>Pressed</NeoButton></div>
      <div data-cell="loading"><NeoButton elevation={2} rounded loading>Loading</NeoButton></div>
      <div data-cell="disabled"><NeoButton elevation={2} rounded disabled>Disabled</NeoButton></div>
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
</style>
