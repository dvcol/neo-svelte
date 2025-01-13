<svelte:options customElement="neo-theme-selector" />

<script lang="ts">
  import NeoThemeSelector from './NeoThemeSelector.svelte';

  import type { NeoThemeSelectorProps } from '~/providers/neo-theme-selector.model.js';

  const _props: NeoThemeSelectorProps = $props();
</script>

<NeoThemeSelector {..._props}>
  <slot />
</NeoThemeSelector>
