<script lang="ts">
  import NeoPill from '~/pill/NeoPill.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <NeoPill elevation={1} rounded>Default</NeoPill>
      <NeoPill elevation={0} rounded>Flat</NeoPill>
      <NeoPill elevation={-1} rounded pressed>Pressed</NeoPill>
      <NeoPill elevation={2} rounded glass>Glass</NeoPill>
      <NeoPill elevation={2} rounded tinted color="var(--neo-color-primary)">Tinted</NeoPill>
      <NeoPill elevation={1} rounded={false}>Sharp</NeoPill>
      <NeoPill elevation={1} rounded text>Text</NeoPill>
      <NeoPill elevation={1} rounded close>Closable</NeoPill>
      <NeoPill elevation={1} rounded disabled>Off</NeoPill>
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
    gap: 1rem;
    place-items: center start;
  }
</style>
