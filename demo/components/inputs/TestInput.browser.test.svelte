<script lang="ts">
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">idle</span>
      <NeoInput label="Idle" />

      <span class="cell-label">filled</span>
      <NeoInput label="Filled" value="hello" />

      <span class="cell-label">disabled</span>
      <NeoInput label="Disabled" value="locked" disabled />
    </section>

    <section class="row">
      <span class="cell-label">readonly</span>
      <NeoInput label="Readonly" value="readonly" readonly />

      <span class="cell-label">invalid</span>
      <NeoInput label="Invalid" value="bad" valid={false} validation />

      <span class="cell-label">valid</span>
      <NeoInput label="Valid" value="ok" valid validation />
    </section>

    <section class="row">
      <span class="cell-label">prefix</span>
      <NeoInput label="Prefix" value="user">
        {#snippet before()}
          <span class="prefix">@</span>
        {/snippet}
      </NeoInput>

      <span class="cell-label">suffix</span>
      <NeoInput label="Suffix" value="amount">
        {#snippet after()}
          <span class="suffix">€</span>
        {/snippet}
      </NeoInput>

      <span class="cell-label">clearable</span>
      <NeoInput label="Clearable" value="text" clearable />
    </section>

    <section class="row">
      <span class="cell-label">glass</span>
      <NeoInput label="Glass" value="glass" glass />

      <span class="cell-label">tinted</span>
      <NeoInput label="Tinted" value="tinted" tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoInput label="Rounded" value="rounded" rounded />
    </section>

    <section class="row">
      <span class="cell-label">pressed</span>
      <NeoInput label="Pressed" value="pressed" pressed />

      <span class="cell-label">borderless</span>
      <NeoInput label="Borderless" value="bare" borderless />

      <span class="cell-label">message</span>
      <NeoInput label="Message" value="m">
        {#snippet message()}
          <span>helper</span>
        {/snippet}
      </NeoInput>
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
    grid-template-columns: 5rem minmax(10rem, 1fr) 5rem minmax(10rem, 1fr) 5rem minmax(10rem, 1fr);
    gap: 0.75rem 1rem;
    align-items: center;
  }

  /* Mobile (390px): one input per row. */
  @media (width <= 480px) {
    .row {
      grid-template-columns: minmax(0, 1fr);
    }

    .cell-label {
      text-align: left;
    }
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }

  .prefix,
  .suffix {
    font-size: 0.875rem;
    opacity: 0.7;
  }
</style>
