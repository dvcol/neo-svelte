<script lang="ts">
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const {
    composite = false,
    elevation = 2,
    rounded = true,
    glass = false,
    tinted = false,
    pressed = false,
    convex = false,
    text = 'Card surface',
  }: {
    composite?: boolean;
    elevation?: number;
    rounded?: boolean;
    glass?: boolean;
    tinted?: boolean;
    pressed?: boolean;
    convex?: boolean;
    text?: string;
  } = $props();

  const variants = [
    { label: 'flat-rounded', props: { elevation: 0, rounded: true } },
    { label: 'raised-2', props: { elevation: 2, rounded: true } },
    { label: 'inset-2', props: { elevation: -2, rounded: true } },
    { label: 'glass-2', props: { elevation: 2, glass: true, rounded: true } },
    { label: 'tinted-2', props: { elevation: 2, tinted: true, rounded: true, color: 'var(--neo-color-primary)' } },
    { label: 'sharp-2', props: { elevation: 2, rounded: false } },
  ] as const;
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if composite}
      <div class="grid">
        {#each variants as v (v.label)}
          <NeoCard {...v.props} width={{ absolute: '12rem' }} height={{ absolute: '6rem' }}>
            <span class="card-text">{v.label}</span>
          </NeoCard>
        {/each}
      </div>
    {:else}
      <NeoCard
        {elevation}
        {rounded}
        {glass}
        {tinted}
        {pressed}
        {convex}
        width={{ absolute: '14rem' }}
        height={{ absolute: '8rem' }}
      >
        <span class="card-text">{text}</span>
      </NeoCard>
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
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 1.5rem;
  }

  .card-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
