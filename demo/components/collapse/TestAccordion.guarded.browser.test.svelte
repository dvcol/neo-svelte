<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in
    NeoAccordion.svelte were guarding:

    1. flat + borderless — :142/:144/:188 chains. Borderless wins over flat's
       border rule.
    2. segmented (vertical) — :118/:128/:152/:158/:198/:204 chains. Segmented
       layout applies child border guards on `:not(:last-child, :only-child)`.
    3. horizontal segmented — different segmented path on horizontal axis.
  */
  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="flat-borderless">
        <span class="cell-label">flat + borderless</span>
        <NeoAccordion rounded elevation={0} borderless>
          <NeoCollapse id="fb1" label="One" />
          <NeoCollapse id="fb2" label="Two" />
        </NeoAccordion>
      </div>

      <div data-cell="segmented-vertical">
        <span class="cell-label">segmented vertical</span>
        <NeoAccordion rounded elevation={1} segmented>
          <NeoCollapse id="sv1" label="One" />
          <NeoCollapse id="sv2" label="Two" />
          <NeoCollapse id="sv3" label="Three" />
        </NeoAccordion>
      </div>

      <div data-cell="segmented-horizontal">
        <span class="cell-label">segmented horizontal</span>
        <NeoAccordion rounded elevation={1} segmented horizontal>
          <NeoCollapse id="sh1" label="One" />
          <NeoCollapse id="sh2" label="Two" />
          <NeoCollapse id="sh3" label="Three" />
        </NeoAccordion>
      </div>
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
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(16rem, 1fr));
    gap: 1.5rem;
  }

  .cell-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
