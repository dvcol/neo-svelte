<script lang="ts">
  import type {
    NeoSources,
    NeoThemes,
    NeoTransitions,
  } from '~/providers/neo-theme-provider.model.js';

  import NeoRememberSelector from '~/providers/NeoRememberSelector.svelte';
  import NeoResetSelector from '~/providers/NeoResetSelector.svelte';
  import NeoSourceSelector from '~/providers/NeoSourceSelector.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoThemeSelector from '~/providers/NeoThemeSelector.svelte';
  import NeoTransitionSelector from '~/providers/NeoTransitionSelector.svelte';

  interface Props {
    theme?: NeoThemes;
    source?: NeoSources;
    reset?: boolean;
    remember?: boolean;
    transition?: NeoTransitions;
    showTheme?: boolean;
    showSource?: boolean;
    showReset?: boolean;
    showRemember?: boolean;
    showTransition?: boolean;
    themeLabel?: string;
    sourceLabel?: string;
    resetLabel?: string;
    rememberLabel?: string;
    transitionLabel?: string;
  }

  const {
    theme,
    source,
    reset,
    remember,
    showTheme = true,
    showSource = true,
    showReset = true,
    showRemember = true,
    showTransition = true,
    themeLabel,
    sourceLabel,
    resetLabel,
    rememberLabel,
    transitionLabel,
  }: Props = $props();
</script>

<NeoThemeProvider
  target="self"
  {theme}
  {source}
  {reset}
  {remember}
  data-testid="selectors-provider-host"
>
  {#if showTheme}
    <NeoThemeSelector label={themeLabel} />
  {/if}
  {#if showSource}
    <NeoSourceSelector label={sourceLabel} />
  {/if}
  {#if showReset}
    <NeoResetSelector label={resetLabel} />
  {/if}
  {#if showRemember}
    <NeoRememberSelector label={rememberLabel} />
  {/if}
  {#if showTransition}
    <NeoTransitionSelector label={transitionLabel} />
  {/if}
</NeoThemeProvider>
