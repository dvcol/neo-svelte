<script lang="ts">
  import type { NeoIconThemeProps } from '~/icons/icon.model.js';

  import IconSunMoon from '~/icons/IconSunMoon.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoTheme } from '~/providers/neo-theme-provider.model.js';

  const { ...rest }: NeoIconThemeProps = $props();

  const context = useNeoThemeContext();
  const dark = $derived(context.theme === NeoTheme.Dark);
</script>

<IconSunMoon state={dark ? 'moon' : 'sun'} {...rest} />
