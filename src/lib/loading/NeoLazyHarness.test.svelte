<script lang="ts">
  import type { Component } from 'svelte';

  import NeoLazy from '~/loading/NeoLazy.svelte';

  type Props = {
    component: Promise<{ default: Component<any, any, any> }>;
    delay?: number;
    componentProps?: Record<string, any>;
    childrenText?: string;
  };

  const { component, delay, componentProps, childrenText }: Props = $props();
</script>

<NeoLazy {component} {delay} props={componentProps}>
  {#if childrenText !== undefined}
    <span data-testid="lazy-children">{childrenText}</span>
  {/if}
</NeoLazy>
