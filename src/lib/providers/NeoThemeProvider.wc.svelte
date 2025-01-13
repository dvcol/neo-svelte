<svelte:options customElement="neo-theme-provider" />

<script lang="ts">
  import NeoThemeProvider from './NeoThemeProvider.svelte';

  import type { HTMLRefProps } from '~/utils/html-element.utils.js';

  import { type NeoThemeProviderProps } from '~/providers/neo-theme-provider.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let { ref = $bindable(), ...rest }: NeoThemeProviderProps & HTMLRefProps = $props();
  /* eslint-enable prefer-const */
</script>

<NeoThemeProvider target={ref} {...rest}>
  <div bind:this={ref} class="neo-theme-provider">
    <slot />
  </div>
</NeoThemeProvider>

<style lang="scss">
  .neo-theme-provider {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
</style>
