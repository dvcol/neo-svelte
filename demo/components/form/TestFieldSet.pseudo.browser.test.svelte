<script lang="ts">
  import NeoFieldSet from '~/form/NeoFieldSet.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoFieldSet legend="Idle" data-testid="target-idle">
        <input type="text" placeholder="..." />
      </NeoFieldSet>
      <NeoFieldSet legend="Hover me" data-testid="target">
        <input type="text" placeholder="..." />
      </NeoFieldSet>
      <NeoFieldSet legend="Off" disabled data-testid="target-disabled">
        <input type="text" placeholder="..." disabled />
      </NeoFieldSet>
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
    gap: 1.5rem;
    align-items: stretch;
  }
</style>
