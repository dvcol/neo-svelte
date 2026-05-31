<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in NeoButton.svelte
    were guarding. If a future cascade-layers refactor moves rules across
    layers these snapshots flip the moment the guard breaks.

    1. flat + pressed — NeoButton.svelte:451 / :514 chains. Pressed visual on
       flat (elevation 0) must reproduce the pressed inset shadow even when
       the base elevation is 0.
    2. glass + disabled — NeoButton.svelte:467/491 chains. Disabled visual
       must apply correctly on the glass variant (different border + opacity
       cascade).
    3. loading + pressed — NeoButton.svelte:391/418/432/481 chains.
       `:active:not(.neo-loading, ...)` guards specifically these stack — the
       active state must defer to loading.
  */
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="flat-pressed"><NeoButton elevation={0} rounded pressed>flat + pressed</NeoButton></div>
      <div data-cell="glass-disabled"><NeoButton elevation={2} rounded glass disabled>glass + disabled</NeoButton></div>
      <div data-cell="loading-pressed"><NeoButton elevation={2} rounded loading pressed>loading + pressed</NeoButton></div>
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
