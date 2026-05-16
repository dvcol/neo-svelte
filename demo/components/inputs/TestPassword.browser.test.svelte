<script lang="ts">
  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">empty</span>
      <NeoPassword label="Empty" />

      <span class="cell-label">filled</span>
      <NeoPassword label="Filled" value="hunter2" />

      <span class="cell-label">disabled</span>
      <NeoPassword label="Disabled" value="hunter2" disabled />
    </section>

    <section class="row">
      <span class="cell-label">readonly</span>
      <NeoPassword label="Readonly" value="hunter2" readonly />

      <span class="cell-label">glass</span>
      <NeoPassword label="Glass" value="hunter2" glass />

      <span class="cell-label">tinted</span>
      <NeoPassword label="Tinted" value="hunter2" tinted color="var(--neo-color-primary)" />
    </section>

    <section class="row">
      <span class="cell-label">rounded</span>
      <NeoPassword label="Rounded" value="hunter2" rounded />

      <span class="cell-label">invalid</span>
      <NeoPassword label="Invalid" value="bad" valid={false} validation />

      <span class="cell-label">valid</span>
      <NeoPassword label="Valid" value="ok" valid validation />
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
    grid-template-columns: 5rem 14rem 5rem 14rem 5rem 14rem;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
