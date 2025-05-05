<script lang="ts">
  import type { NeoIconThemeProps } from '~/icons/neo-icon.model.js';

  import NeoIconSunMoon from '~/icons/NeoIconSunMoon.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoTheme } from '~/providers/neo-theme-provider.model.js';

  const { ...rest }: NeoIconThemeProps = $props();

  const context = useNeoThemeContext();
  const dark = $derived(context.theme === NeoTheme.Dark);
</script>

<NeoIconSunMoon state={dark ? 'moon' : 'sun'} {...rest} />
