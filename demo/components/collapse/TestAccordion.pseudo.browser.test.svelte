<script lang="ts">
  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoAccordion elevation={-3} hover={4} rounded data-testid="target-idle">
        <NeoCollapse id="i1" label="One" />
        <NeoCollapse id="i2" label="Two" />
      </NeoAccordion>
      <NeoAccordion elevation={-3} hover={4} rounded data-testid="target">
        <NeoCollapse id="t1" label="Hover me" />
        <NeoCollapse id="t2" label="Two" />
      </NeoAccordion>
      <NeoAccordion elevation={-3} hover={4} rounded disabled data-testid="target-disabled">
        <NeoCollapse id="d1" label="Off" />
        <NeoCollapse id="d2" label="Two" />
      </NeoAccordion>
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

  .row {
    display: grid;
    grid-template-columns: repeat(3, minmax(14rem, 1fr));
    gap: 1.5rem;
  }
</style>
