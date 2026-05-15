<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoPillProps } from '~/pill/neo-pill.model.js';

  import NeoPill from '~/pill/NeoPill.svelte';

  interface HarnessProps extends Omit<NeoPillProps, 'children' | 'icon' | 'label'> {
    childrenText?: string;
    iconText?: string;
    iconString?: string;
    label?: string;
  }

  const {
    childrenText,
    iconText,
    iconString,
    label,
    ...rest
  }: HarnessProps = $props();
</script>

{#snippet childrenSnip()}
  <span data-testid="pill-children">{childrenText}</span>
{/snippet}
{#snippet iconSnip()}
  <span data-testid="pill-icon">{iconText}</span>
{/snippet}

{#if childrenText !== undefined}
  <NeoPill
    {...rest}
    {label}
    icon={iconString ?? (iconText !== undefined ? (iconSnip as Snippet) : undefined)}
  >
    {@render childrenSnip()}
  </NeoPill>
{:else}
  <NeoPill
    {...rest}
    {label}
    icon={iconString ?? (iconText !== undefined ? (iconSnip as Snippet) : undefined)}
  />
{/if}
