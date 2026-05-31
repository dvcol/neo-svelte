<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in
    NeoTextarea.svelte were guarding:

    1. flat + borderless — :715/:945 chains. Borderless must win over flat.
    2. hover-flat + hovered — :934/:945 chains. The hover-flat variant must
       render correctly while hovered.
    3. floating label, empty — :785/:853/:873 chains. Floating-label position
       cascade applies when the textarea is empty.
  */
  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">flat + borderless</span>
      <div><NeoTextarea label="Flat borderless" value="text" elevation={0} borderless /></div>

      <span class="cell-label">hover-flat + hovered</span>
      <div><NeoTextarea label="Hover flat" value="text" elevation={2} hover={0} hovered /></div>

      <span class="cell-label">floating empty</span>
      <div><NeoTextarea label="Floating" floating /></div>
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
    align-items: start;
  }

  .cell-label {
    padding-top: 0.5rem;
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
