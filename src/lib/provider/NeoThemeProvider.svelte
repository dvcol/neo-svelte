<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import { onDestroy } from 'svelte';

  import { setNeoThemeContext } from '~/provider/neo-theme-provider-context.svelte.js';
  import { type NeoThemeProviderProps } from '~/provider/neo-theme-provider.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    theme = $bindable(),
    source = $bindable(),
    remember = $bindable(),
    target,
  }: NeoThemeProviderProps = $props();
  /* eslint-enable prefer-const */

  const context = setNeoThemeContext({ theme, source, remember, root: target });
  $effect(() => context.update({ theme, source, remember, root: target }));
  onDestroy(() => context.destroy());
</script>

{@render children?.(context.state)}
