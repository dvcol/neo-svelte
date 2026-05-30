<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Mode = 'unlayered' | 'layered' | 'no-provider';
  const { mode = 'unlayered' }: { mode?: Mode } = $props();
</script>

{#if mode === 'no-provider'}
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <NeoButton class="hostile-target">plain</NeoButton>
    </div>
  </div>
{:else}
  <NeoThemeProvider>
    <div class="visual-stage" data-testid="visual-stage" class:layered={mode === 'layered'} class:unlayered={mode === 'unlayered'}>
      <div class="cell">
        <NeoButton class="hostile-target">plain</NeoButton>
      </div>
    </div>
  </NeoThemeProvider>
{/if}

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
    font-family: sans-serif;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 8rem;
    min-height: 4rem;
  }

  /*
    Hostile consumer rule (unlayered): per the cascade-layers contract this
    MUST win over the library's `@layer neo-components` rule for `.neo-button`,
    regardless of specificity, because unlayered rules beat all layered ones.
  */
  .visual-stage.unlayered :global(.hostile-target) {
    background-color: rgb(255 0 255);
  }

  /*
    Layered consumer interleaves between neo-components and neo-variants:
    @layer neo-reset, neo-theme, neo-components, app-overrides, neo-variants, neo-states;
    The override targets `.neo-button` and should win over the library's
    neo-components layer but lose to anything in neo-variants and above.
  */
  @layer neo-reset, neo-theme, neo-components, app-overrides, neo-variants, neo-states;

  @layer app-overrides {
    .visual-stage.layered :global(.hostile-target) {
      background-color: rgb(0 200 0);
    }
  }
</style>
