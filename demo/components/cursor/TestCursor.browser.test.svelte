<script lang="ts">
  import NeoCursorPointer from '~/cursor/NeoCursorPointer.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="legend">
      <span class="legend-label" style:left="180px">default</span>
      <span class="legend-label" style:left="380px">snapping</span>
      <span class="legend-label" style:left="580px">text</span>
      <span class="legend-label" style:left="780px">touching</span>
    </div>
  </div>

  <NeoCursorPointer
    show
    cursor="auto"
    position={{ x: 200, y: 320 }}
  />
  <NeoCursorPointer
    show
    cursor="snap"
    position={{ x: 400, y: 320, width: 80, height: 32, radius: '6px' }}
    snapping
  />
  <NeoCursorPointer
    show
    cursor="text"
    position={{ x: 600, y: 320 }}
  />
  <NeoCursorPointer
    show
    cursor="auto"
    pointer="mouse"
    touching
    contact={{
      size: { width: 1, height: 1 },
      tilt: { x: 0, y: 0 },
      twist: 0,
      angle: { azimuth: 0, altitude: Math.PI / 2 },
      pressure: { point: 0.5, tangential: 0 },
    }}
    position={{ x: 800, y: 320 }}
    pressure
  />
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .legend {
    position: relative;
    height: 24rem;
  }

  .legend-label {
    position: absolute;
    top: 240px;
    font-size: 0.75rem;
    text-align: center;
    transform: translateX(-50%);
    opacity: 0.7;
  }
</style>
