<script lang="ts">
  /*
    Pseudo-state grid harness for NeoInput. NeoInput has :hover/:focus-within
    box-shadow rules at NeoInput.svelte:912/923+. Wide elevation/hover gap
    makes the cascade outcome visible.
  */
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoInput elevation={-3} hover={4} rounded label="Idle" data-testid="target-idle" />
      <NeoInput elevation={-3} hover={4} rounded label="Hover me" data-testid="target" />
      <NeoInput elevation={-3} hover={4} rounded disabled label="Off" value="disabled" data-testid="target-disabled" />
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

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }
</style>
