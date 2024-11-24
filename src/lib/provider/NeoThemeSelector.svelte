<script lang="ts">
  import type { NeoThemeSelectorProps } from '~/provider/neo-theme-selector.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconMoon from '~/icons/IconMoon.svelte';
  import IconSave from '~/icons/IconSave.svelte';
  import IconSaveOff from '~/icons/IconSaveOff.svelte';
  import IconSun from '~/icons/IconSun.svelte';
  import IconSunrise from '~/icons/IconSunrise.svelte';
  import { useNeoThemeContext } from '~/provider/neo-theme-provider-context.svelte.js';
  import { NeoSource, NeoTheme } from '~/provider/neo-theme-provider.model.js';

  const { children, ...rest }: NeoThemeSelectorProps = $props();

  const context = useNeoThemeContext();

  let dark = $state(context.theme === NeoTheme.Dark);
  const theme = $derived(dark ? NeoTheme.Dark : NeoTheme.Light);

  let source = $state(context.source);
  let remember = $state(context.remember);

  const sources = Object.values(NeoSource);
  const sourceMap = { ...sources };
  const sourceIndexMap = Object.fromEntries(Object.entries(sourceMap).map(([k, v]) => [v, Number(k)]));

  let angle = $state(sourceIndexMap[context.source] * 90);
  const onCycleSource = () => {
    source = sourceMap[(sourceIndexMap[source] + 1) % sources.length];
    angle += 90;
  };

  $effect(() => context.update({ theme, source, remember }));
</script>

<NeoButtonGroup {...rest}>
  <NeoButton aria-label="Cycle light source origin" title="Cycle light source origin" checked onclick={onCycleSource}>
    {#snippet icon()}
      <span class="source-icon" style:--neo-source-rotate={`${angle}deg`}>
        <IconSunrise />
      </span>
    {/snippet}
    <span>Source</span>
  </NeoButton>
  <NeoButton aria-label={`Toggle ${dark ? 'light' : 'dark'} theme`} title={`Toggle ${dark ? 'light' : 'dark'} theme`} toggle bind:checked={dark}>
    {#snippet icon()}
      {#if dark}
        <IconMoon />
      {:else}
        <IconSun />
      {/if}
    {/snippet}
    <span>Theme</span>
  </NeoButton>

  <NeoButton aria-label="Remember theme settings" title="Remember theme settings" toggle bind:checked={remember}>
    {#snippet icon()}
      {#if remember}
        <IconSave />
      {:else}
        <IconSaveOff />
      {/if}
    {/snippet}
  </NeoButton>
  {@render children?.(context.state)}
</NeoButtonGroup>

<style lang="scss">
  .source-icon {
    overflow: hidden;
    border-radius: var(--neo-border-radius-lg);
    rotate: var(--neo-source-rotate, 0);
    transition: rotate 0.5s ease;

    :global(svg) {
      width: 1.25rem;
      height: 1.25rem;
      translate: -30% -30%;
    }
  }
</style>
