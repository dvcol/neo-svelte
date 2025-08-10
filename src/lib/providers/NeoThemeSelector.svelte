<script lang="ts">
  import type { NeoThemeSelectorProps } from '~/providers/neo-theme-selector.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconSunMoon from '~/icons/NeoIconSunMoon.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoTheme } from '~/providers/neo-theme-provider.model.js';

  let {
    // state
    label = 'Theme',

    // Button props
    ref = $bindable(),
    hovered = $bindable(false),
    focused = $bindable(false),

    // Other props
    ...rest
  }: NeoThemeSelectorProps = $props();

  const context = useNeoThemeContext();

  const dark = $derived(context.theme === NeoTheme.Dark);

  const onTheme = () => context.update({ theme: dark ? NeoTheme.Light : NeoTheme.Dark }, ref);
</script>

<NeoButton
  bind:ref
  bind:hovered
  bind:focused
  aria-label="Toggle {dark ? 'light' : 'dark'} theme"
  title="Toggle {dark ? 'light' : 'dark'} theme"
  toggle
  checked={dark}
  onclick={onTheme}
  {label}
  {...rest}
>
  {#snippet icon()}
    <NeoIconSunMoon state={dark ? 'moon' : 'sun'} />
  {/snippet}
</NeoButton>
