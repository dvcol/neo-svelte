<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoButtonGroup elevation={-3} hover={4} rounded data-testid="target-idle">
        <NeoButton>One</NeoButton>
        <NeoButton>Two</NeoButton>
      </NeoButtonGroup>
      <NeoButtonGroup elevation={-3} hover={4} rounded data-testid="target">
        <NeoButton>One</NeoButton>
        <NeoButton>Two</NeoButton>
      </NeoButtonGroup>
      <NeoButtonGroup elevation={-3} hover={4} rounded data-testid="target-disabled">
        <NeoButton disabled>One</NeoButton>
        <NeoButton disabled>Two</NeoButton>
      </NeoButtonGroup>
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
    gap: 2rem;
    align-items: center;
  }
</style>
