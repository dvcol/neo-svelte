<script lang="ts">
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Cell = {
    label: string;
    value?: number;
    indeterminate?: boolean;
    rounded?: boolean;
    glass?: boolean;
    pressed?: boolean;
    tinted?: boolean;
    track?: boolean;
    borderless?: boolean;
    buffer?: number;
    marks?: number[];
    status?:
      | 'indeterminate'
      | 'active'
      | 'idle'
      | 'paused'
      | 'cancelled'
      | 'timeout'
      | 'completed'
      | 'error'
      | 'success'
      | 'warning';
    color?: string;
    before?: string;
    after?: string;
  };

  const cells: Cell[] = [
    { label: '0%', value: 0 },
    { label: '25%', value: 25 },
    { label: '50%', value: 50 },
    { label: '75%', value: 75 },
    { label: '100%', value: 100 },
    { label: 'rounded', value: 60, rounded: true },
    { label: 'glass', value: 40, glass: true },
    { label: 'pressed', value: 50, pressed: true },
    { label: 'indeterminate', indeterminate: true },
    { label: 'buffer', value: 35, buffer: 65 },
    { label: 'marks', value: 50, marks: [25, 50, 75] },
    { label: 'before label', value: 60, before: 'Loading' },
    { label: 'after label', value: 60, after: '60%' },
    { label: 'track', value: 45, track: true },
    { label: 'borderless', value: 70, borderless: true },
    { label: 'status: active', value: 60, status: 'active' },
    { label: 'status: paused', value: 60, status: 'paused' },
    { label: 'status: completed', value: 100, status: 'completed' },
    { label: 'status: cancelled', value: 60, status: 'cancelled' },
    { label: 'status: error', value: 60, status: 'error' },
    { label: 'status: warning', value: 60, status: 'warning' },
    { label: 'status: success', value: 60, status: 'success' },
    { label: 'thresholds (low/high)', value: 30, color: ['var(--neo-color-error)', 'var(--neo-color-warning)', 'var(--neo-color-success)'] as never },
    { label: 'tinted color', value: 60, color: 'var(--neo-color-primary)' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#each cells as cell, i (i)}
      <div class="cell">
        <span class="label">{cell.label}</span>
        <NeoProgressBar
          value={cell.value}
          indeterminate={cell.indeterminate}
          rounded={cell.rounded}
          glass={cell.glass}
          pressed={cell.pressed}
          track={cell.track}
          borderless={cell.borderless}
          buffer={cell.buffer}
          marks={cell.marks}
          status={cell.status}
          color={cell.color}
          before={cell.before}
          after={cell.after}
          width="100%"
          height="0.75rem"
        />
      </div>
    {/each}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :global(.neo-progress), :global(.neo-progress *) {
    animation-play-state: paused !important;
  }

  .visual-stage {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .label {
    color: var(--neo-text-color-secondary);
    font-size: 0.75rem;
  }
</style>
