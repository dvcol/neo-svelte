<script lang="ts">
  import NeoBadge from '~/badge/NeoBadge.svelte';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <NeoBadge value="3" placement="top-right">
        <NeoButton elevation={2} rounded>top-right</NeoButton>
      </NeoBadge>
      <NeoBadge value="9" placement="top-left">
        <NeoButton elevation={2} rounded>top-left</NeoButton>
      </NeoBadge>
      <NeoBadge value="!" placement="bottom-right">
        <NeoButton elevation={2} rounded>bottom-right</NeoButton>
      </NeoBadge>
      <NeoBadge value="?" placement="bottom-left">
        <NeoButton elevation={2} rounded>bottom-left</NeoButton>
      </NeoBadge>
      <NeoBadge value="" placement="top-right">
        <NeoButton elevation={2} rounded>dot</NeoButton>
      </NeoBadge>
      <NeoBadge value="42" placement="top" offset="8px">
        <NeoButton elevation={2} rounded>offset</NeoButton>
      </NeoBadge>
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
    gap: 2rem;
    place-items: center;
  }
</style>
