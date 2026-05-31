<script lang="ts">
  /*
    Variant matrix for NeoButtonGroup. The component has 10 :not() chains
    (the heaviest of any button-family file) covering: convex/inset/flat
    children, vertical orientation, hover-flat handling on focus-visible
    children, and propagation guards via :has().
  */
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const {
    composite = false,
  }: {
    composite?: boolean;
  } = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if composite}
      <section class="block">
        <span class="cell-label">raised</span>
        <NeoButtonGroup rounded elevation={2}>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </section>

      <section class="block">
        <span class="cell-label">flat</span>
        <NeoButtonGroup rounded elevation={0}>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </section>

      <section class="block">
        <span class="cell-label">inset</span>
        <NeoButtonGroup rounded elevation={-2}>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </section>

      <section class="block">
        <span class="cell-label">glass</span>
        <NeoButtonGroup rounded elevation={2} glass>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </section>

      <section class="block">
        <span class="cell-label">vertical</span>
        <NeoButtonGroup rounded elevation={2} vertical>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </section>

      <section class="block">
        <span class="cell-label">disabled</span>
        <NeoButtonGroup rounded elevation={2}>
          <NeoButton disabled>One</NeoButton>
          <NeoButton disabled>Two</NeoButton>
          <NeoButton disabled>Three</NeoButton>
        </NeoButtonGroup>
      </section>
    {:else}
      <NeoButtonGroup rounded elevation={2}>
        <NeoButton>One</NeoButton>
        <NeoButton>Two</NeoButton>
      </NeoButtonGroup>
    {/if}
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

  .block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .cell-label {
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
