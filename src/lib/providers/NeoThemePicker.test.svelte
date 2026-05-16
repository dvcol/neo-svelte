<script lang="ts">
  import type { NeoThemes } from '~/providers/neo-theme-provider.model.js';

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

<NeoThemeProvider
  target="self"
  {theme}
  data-testid="theme-picker-host"
>
  <NeoThemePicker {labelBackground} {labelText} {rounded} />
</NeoThemeProvider>
