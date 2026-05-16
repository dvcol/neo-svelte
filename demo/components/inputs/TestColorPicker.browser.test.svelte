<script lang="ts">
  import NeoColorPicker from '~/inputs/NeoColorPicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">empty</span>
      <NeoColorPicker label="Empty" />

      <span class="cell-label">red</span>
      <NeoColorPicker label="Red" value="#ff3344" />

      <span class="cell-label">blue</span>
      <NeoColorPicker label="Blue" value="#3366ff" />
    </section>

    <section class="row">
      <span class="cell-label">disabled</span>
      <NeoColorPicker label="Disabled" value="#888888" disabled />

      <span class="cell-label">readonly</span>
      <NeoColorPicker label="Readonly" value="#22aa55" readonly />

      <span class="cell-label">glass</span>
      <NeoColorPicker label="Glass" value="#aa66cc" glass />
    </section>

    <section class="row">
      <span class="cell-label">tinted</span>
      <NeoColorPicker label="Tinted" value="#ffcc44" tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoColorPicker label="Rounded" value="#44ccaa" rounded />

      <span class="cell-label">invalid</span>
      <NeoColorPicker label="Invalid" value="bad" valid={false} validation />
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
