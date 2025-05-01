<script lang="ts">
  import type { NeoThemeSelectorsProps } from '~/providers/neo-theme-selectors.model.js';

  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import NeoRememberSelector from '~/providers/NeoRememberSelector.svelte';
  import NeoResetSelector from '~/providers/NeoResetSelector.svelte';
  import NeoSourceSelector from '~/providers/NeoSourceSelector.svelte';
  import NeoThemeSelector from '~/providers/NeoThemeSelector.svelte';

  const {
    // Snippet
    children,

    // state
    sourceLabel,
    source: showSource,
    themeLabel,
    theme: showTheme = true,
    resetLabel,
    reset: showReset,
    rememberLabel,
    remember: showRemember,

    // Other props
    rememberProps,
    sourceProps,
    themeProps,
    resetProps,
    ...rest
  }: NeoThemeSelectorsProps = $props();

  const context = useNeoThemeContext();
</script>

<NeoButtonGroup elevation="2" {...rest}>
  {#if showSource}
    <NeoSourceSelector label={sourceLabel} {...sourceProps} />
  {/if}
  {#if showTheme}
    <NeoThemeSelector label={themeLabel} {...themeProps} />
  {/if}
  {#if showReset}
    <NeoResetSelector label={resetLabel} {...resetProps} />
  {/if}
  {#if showRemember}
    <NeoRememberSelector label={rememberLabel} {...rememberProps} />
  {/if}
  {@render children?.(context.state)}
</NeoButtonGroup>
