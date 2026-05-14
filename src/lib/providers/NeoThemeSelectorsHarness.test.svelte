<script lang="ts">
  import type { NeoThemeSelectorsProps } from '~/providers/neo-theme-selectors.model.js';

  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoThemeSelectors from '~/providers/NeoThemeSelectors.svelte';

  const { ...rest }: NeoThemeSelectorsProps = $props();
</script>

<NeoThemeProvider target="self" data-testid="composite-host">
  <NeoThemeSelectors {...rest} />
</NeoThemeProvider>
