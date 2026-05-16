<script lang="ts">
  import NeoDateTime from '~/inputs/NeoDateTime.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">date</span>
      <NeoDateTime label="Date" type="date" value="2026-05-17" />

      <span class="cell-label">time</span>
      <NeoDateTime label="Time" type="time" value="14:30" />

      <span class="cell-label">date-time</span>
      <NeoDateTime label="Date-time" type="datetime-local" value="2026-05-17T14:30" />
    </section>

    <section class="row">
      <span class="cell-label">empty</span>
      <NeoDateTime label="Empty date" type="date" />

      <span class="cell-label">disabled</span>
      <NeoDateTime label="Disabled" type="date" value="2026-05-17" disabled />

      <span class="cell-label">readonly</span>
      <NeoDateTime label="Readonly" type="date" value="2026-05-17" readonly />
    </section>

    <section class="row">
      <span class="cell-label">glass</span>
      <NeoDateTime label="Glass" type="date" value="2026-05-17" glass />

      <span class="cell-label">tinted</span>
      <NeoDateTime label="Tinted" type="date" value="2026-05-17" tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoDateTime label="Rounded" type="date" value="2026-05-17" rounded />
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
