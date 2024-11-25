<script lang="ts">
  import type { NeoThemeSelectorProps } from '~/providers/neo-theme-selector.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconImage from '~/icons/IconImage.svelte';
  import IconMoon from '~/icons/IconMoon.svelte';
  import IconSave from '~/icons/IconSave.svelte';
  import IconSaveOff from '~/icons/IconSaveOff.svelte';
  import IconSun from '~/icons/IconSun.svelte';
  import IconSunrise from '~/icons/IconSunrise.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoSource, NeoTheme } from '~/providers/neo-theme-provider.model.js';

  const {
    // Snippet
    children,

    // state
    remember: showRemember,
    source: showSource = true,
    theme: showTheme = true,
    reset: showReset,

    // Other props
    rememberProps,
    sourceProps,
    themeProps,
    resetProps,
    ...rest
  }: NeoThemeSelectorProps = $props();

  const context = useNeoThemeContext();

  const reset = $derived(context.reset);
  const dark = $derived(context.theme === NeoTheme.Dark);
  const source = $derived(context.source);
  const remember = $derived(context.remember);

  const sources = Object.values(NeoSource);
  const sourceMap = { ...sources };
  const sourceIndexMap = Object.fromEntries(Object.entries(sourceMap).map(([k, v]) => [v, Number(k)]));

  let angle = $state(sourceIndexMap[context.source] * 90);
  const onCycleSource = () => {
    angle += 90;
    context.update({ source: sourceMap[(sourceIndexMap[source] + 1) % sources.length] });
  };

  const onTheme = () => context.update({ theme: dark ? NeoTheme.Light : NeoTheme.Dark });
  const onReset = () => context.update({ reset: !reset });
  const onRemember = () => context.update({ remember: !remember });
</script>

<NeoButtonGroup {...rest}>
  {#if showSource}
    <NeoButton aria-label="Cycle light source origin" title="Cycle light source origin" checked onclick={onCycleSource} {...sourceProps}>
      {#snippet icon()}
        <span class="source-icon" style:--neo-source-rotate={`${angle}deg`}>
          <IconSunrise />
        </span>
      {/snippet}
      <span>Source</span>
    </NeoButton>
  {/if}
  {#if showTheme}
    <NeoButton
      aria-label={`Toggle ${dark ? 'light' : 'dark'} theme`}
      title={`Toggle ${dark ? 'light' : 'dark'} theme`}
      toggle
      checked={dark}
      onclick={onTheme}
      {...themeProps}
    >
      {#snippet icon()}
        {#if dark}
          <IconMoon />
        {:else}
          <IconSun />
        {/if}
      {/snippet}
      <span>Theme</span>
    </NeoButton>
  {/if}
  {#if showReset}
    <NeoButton
      aria-label={`Toggle ${reset ? 'off' : 'on'} style reset`}
      title={`Toggle ${reset ? 'off' : 'on'} style reset`}
      toggle
      checked={reset}
      onclick={onReset}
      {...resetProps}
    >
      {#snippet icon()}
        <IconImage />
      {/snippet}
    </NeoButton>
  {/if}
  {#if showRemember}
    <NeoButton aria-label="Remember theme settings" title="Remember theme settings" toggle checked={remember} onclick={onRemember} {...rememberProps}>
      {#snippet icon()}
        {#if remember}
          <IconSave />
        {:else}
          <IconSaveOff />
        {/if}
      {/snippet}
    </NeoButton>
  {/if}
  {@render children?.(context.state)}
</NeoButtonGroup>

<style lang="scss">
  .source-icon {
    overflow: hidden;
    border-radius: var(--neo-theme-selector-border-radius, var(--neo-border-radius-lg));
    rotate: var(--neo-source-rotate, 0);
    transition: rotate 0.5s ease;

    :global(svg) {
      width: 1.25rem;
      height: 1.25rem;
      translate: -30% -30%;
    }
  }
</style>
