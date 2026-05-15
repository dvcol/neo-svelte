<script lang="ts">
  import type { NeoTooltipHTMLElement, NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';

  type HarnessProps = Omit<NeoTooltipProps, 'children' | 'tooltip'> & {
    triggerLabel?: string;
    tooltipLabel?: string;
    tooltipSnippet?: boolean;
    onRef?: (ref: NeoTooltipHTMLElement | undefined) => void;
    onTriggerRef?: (ref: NeoTooltipHTMLElement | undefined) => void;
  };

  let {
    ref = $bindable<NeoTooltipHTMLElement | undefined>(undefined),
    triggerRef = $bindable<NeoTooltipHTMLElement | undefined>(undefined),
    open = $bindable(false),
    position = $bindable(),
    triggerLabel = 'trigger',
    tooltipLabel = 'tooltip-content',
    tooltipSnippet = false,
    onRef,
    onTriggerRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
  $effect(() => {
    onTriggerRef?.(triggerRef);
  });
</script>

{#if tooltipSnippet}
  <NeoTooltip bind:ref bind:triggerRef bind:open bind:position {...rest}>
    <span data-testid="trigger-content">{triggerLabel}</span>
    {#snippet tooltip()}
      <span data-testid="tooltip-snippet">{tooltipLabel}</span>
    {/snippet}
  </NeoTooltip>
{:else}
  <NeoTooltip bind:ref bind:triggerRef bind:open bind:position tooltip={tooltipLabel} {...rest}>
    <span data-testid="trigger-content">{triggerLabel}</span>
  </NeoTooltip>
{/if}
