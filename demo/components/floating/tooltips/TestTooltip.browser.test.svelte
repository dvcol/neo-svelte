<script lang="ts">
  import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = Omit<NeoTooltipProps, 'children' | 'tooltip'> & {
    triggerLabel?: string;
    tooltipLabel?: string;
    /**
     * Wrap the trigger label in a themed `NeoButton`. Default `false` so behavior
     * tests get a plain span (avoids nested-focusable interference when they
     * drive the wrapper directly via `triggerProps`). The visual contract opts
     * in (`triggerAsButton: true`) to exercise the themed surface.
     */
    triggerAsButton?: boolean;
  };

  let {
    open = $bindable(false),
    placement = 'bottom',
    triggerLabel = 'Trigger',
    tooltipLabel = 'Tooltip content',
    triggerAsButton = false,
    ...rest
  }: Props = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoTooltip
      bind:open
      tooltip={tooltipLabel}
      {placement}
      {...rest}
    >
      {#if triggerAsButton}
        <NeoButton class="trigger" rounded>{triggerLabel}</NeoButton>
      {:else}
        <span data-testid="trigger-content">{triggerLabel}</span>
      {/if}
    </NeoTooltip>
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
    height: 100vh;
    padding: 4rem;
  }
</style>
