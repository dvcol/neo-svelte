<script lang="ts">
  import { onDestroy } from 'svelte';

  import { setNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { type NeoThemeProviderProps } from '~/providers/neo-theme-provider.model.js';

  import '~/providers/neo-theme-provider.scss';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    reset,
    theme,
    source,
    remember,
    target,
  }: NeoThemeProviderProps = $props();
  /* eslint-enable prefer-const */

  const context = setNeoThemeContext({ reset, theme, source, remember, root: target });
  $effect(() => context.update({ reset, theme, source, remember, root: target }));
  onDestroy(() => context.destroy());
</script>

{@render children?.(context.state)}
