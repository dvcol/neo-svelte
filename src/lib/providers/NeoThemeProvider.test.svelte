<script lang="ts">
  import type {
    NeoThemeProviderProps,
    NeoTransitions,
  } from '~/providers/neo-theme-provider.model.js';

  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = NeoThemeProviderProps & {
    childrenLabel?: string;
  };

  let { childrenLabel, ref = $bindable(), target = 'self', ...rest }: Props = $props();
</script>

<NeoThemeProvider
  bind:ref
  {target}
  data-testid="theme-provider-host"
  {...rest}
>
  {#snippet children(state)}
    <span data-testid="provider-children">
      {childrenLabel ?? 'children'}-{state.theme}-{state.source}-{state.reset}-{state.remember}-{state.transition as NeoTransitions}
    </span>
  {/snippet}
</NeoThemeProvider>
