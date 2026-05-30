<script lang="ts">
  import type { NeoThemes } from '~/providers/neo-theme-provider.model.js';

  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoTheme } from '~/providers/neo-theme-provider.model.js';
  import NeoThemePicker from '~/providers/NeoThemePicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  interface Props {
    theme?: NeoThemes;
    labelBackground?: string;
    labelText?: string;
    rounded?: boolean;
  }

  const {
    theme,
    labelBackground,
    labelText,
    rounded,
  }: Props = $props();
</script>

{#snippet inner()}
  {@const context = useNeoThemeContext()}
  <button
    data-testid="toggle-theme"
    onclick={() => context.update({ theme: context.theme === NeoTheme.Light ? NeoTheme.Dark : NeoTheme.Light })}
    type="button"
  >toggle</button>
  <NeoThemePicker {labelBackground} {labelText} {rounded} />
{/snippet}

<NeoThemeProvider
  target="self"
  {theme}
  data-testid="theme-picker-host"
>
  {@render inner()}
</NeoThemeProvider>
