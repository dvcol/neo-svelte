<script lang="ts">
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

/*
    Snapshots three combinations the existing `:not()` chains in NeoInput.svelte
    were guarding. If a future cascade-layers refactor moves rules across layers
    these snapshots flip the moment the guard breaks.

    1. flat + borderless — NeoInput.svelte:627 chain. Borderless must win over
       flat's `border-color` rule.
    2. hover-flat + hovered — NeoInput.svelte:912/923 chains. The hover-flat
       variant cascade has to render correctly while the input is in its
       hovered state.
    3. floating label, empty, no autofill — NeoInput.svelte:726/811/831/864
       chains. The floating-label position rule has to apply when the input is
       empty (i.e. the label floats up to the border) and no autofill suggestion
       is in place.
  */
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">flat + borderless</span>
      <NeoInput label="Flat borderless" value="text" elevation={0} borderless />

      <span class="cell-label">hover-flat + hovered</span>
      <NeoInput label="Hover flat hovered" value="text" elevation={2} hover={0} hovered />

      <span class="cell-label">floating empty no-autofill</span>
      <NeoInput label="Floating" floating />
    </section>
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
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: 9rem 16rem 9rem 16rem 9rem 16rem;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
