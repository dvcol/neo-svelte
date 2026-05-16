<script lang="ts">
  import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';

  type TooltipInstance = ReturnType<typeof NeoTooltip>;

  type HarnessProps = Omit<NeoTooltipProps, 'children' | 'tooltip'> & {
    triggerLabel?: string;
    tooltipLabel?: string;
    tooltipSnippet?: boolean;
    onRef?: (ref: HTMLElement | undefined) => void;
    onTriggerRef?: (ref: HTMLElement | undefined) => void;
    onInstance?: (instance: TooltipInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLElement | undefined>(undefined),
    triggerRef = $bindable<HTMLElement | undefined>(undefined),
    open = $bindable(false),
    position = $bindable(),
    triggerLabel = 'trigger',
    tooltipLabel = 'tooltip-content',
    tooltipSnippet = false,
    onRef,
    onTriggerRef,
    onInstance,
    ...rest
  }: HarnessProps = $props();

  let instance = $state<TooltipInstance>();

  $effect(() => {
    onRef?.(ref);
  });
  $effect(() => {
    onTriggerRef?.(triggerRef);
  });
  $effect(() => {
    onInstance?.(instance);
  });
</script>

{#if tooltipSnippet}
  <NeoTooltip bind:this={instance} bind:ref bind:triggerRef bind:open bind:position {...rest}>
    <span data-testid="trigger-content">{triggerLabel}</span>
    {#snippet tooltip()}
      <span data-testid="tooltip-snippet">{tooltipLabel}</span>
    {/snippet}
  </NeoTooltip>
{:else}
  <NeoTooltip bind:this={instance} bind:ref bind:triggerRef bind:open bind:position tooltip={tooltipLabel} {...rest}>
    <span data-testid="trigger-content">{triggerLabel}</span>
  </NeoTooltip>
{/if}
