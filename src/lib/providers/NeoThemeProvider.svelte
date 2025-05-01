<script lang="ts">
  import type { NeoThemeProviderProps } from '~/providers/neo-theme-provider.model.js';

  import { setNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';

  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    reset,
    theme,
    source,
    remember,
    target,

    // Other props
    ...rest
  }: NeoThemeProviderProps = $props();

  const context = setNeoThemeContext({ reset, theme, source, remember, root: target === 'self' ? ref : target });
  $effect.pre(() => {
    context.update({ reset, theme, source, remember, root: target === 'self' ? ref : target });
    return () => context.destroy();
  });
</script>

{#if target === 'self'}
  <svelte:element class:neo-theme-provider={true} this={tag} bind:this={ref} {...rest}>
    {#if context.ready}
      {@render children?.(context.state)}
    {/if}
  </svelte:element>
{:else if context.ready}
  {@render children?.(context.state)}
{/if}

<style lang="scss">
  .neo-theme-provider {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }
</style>
