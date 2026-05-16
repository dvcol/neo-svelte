<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoScrollShadow from '~/text/NeoScrollShadow.svelte';

  type Variant = 'top' | 'middle' | 'bottom';

  const { variant = 'middle' }: { variant?: Variant } = $props();

  const lines = Array.from({ length: 30 }, (_, i) => `Line ${i + 1} — quick brown fox`);

  let ref = $state<HTMLElement | undefined>();

  $effect(() => {
    if (!ref) return;
    if (variant === 'top') ref.scrollTop = 0;
    else if (variant === 'bottom') ref.scrollTop = ref.scrollHeight;
    else ref.scrollTop = ref.scrollHeight / 2;
  });
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <NeoScrollShadow bind:ref width="20rem" height="14rem" shadow scrollbar>
        {#each lines as line (line)}
          <div class="line">{line}</div>
        {/each}
      </NeoScrollShadow>
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
    font-family: sans-serif;
  }

  .cell {
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .line {
    padding: 0.25rem 0.75rem;
  }
</style>
