<script lang="ts">
  import type { NeoThemePickerProps } from '~/providers/neo-theme-picker.model.js';
  import type { NeoThemes } from '~/providers/neo-theme-provider.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoColorPickerSelector from '~/inputs/NeoColorPickerSelector.svelte';
  import { useNeoThemeContext } from '~/providers/neo-theme-provider-context.svelte.js';
  import { NeoTheme } from '~/providers/neo-theme-provider.model.js';

  const {
    // Snippet
    children,

    // State
    labelBackground = 'Background',
    labelText = 'Text',

    // Styles
    rounded,

    ...rest
  }: NeoThemePickerProps = $props();

  const context = useNeoThemeContext();

  const theme = $derived(context.theme);
  const target = $derived(context.host);

  const backgrounds = $state<Record<NeoThemes, string>>({ [NeoTheme.Light]: '', [NeoTheme.Dark]: '' });
  const texts = $state<Record<NeoThemes, string>>({ [NeoTheme.Light]: '', [NeoTheme.Dark]: '' });

  const clearBackground = () => {
    backgrounds[theme] = '';
  };

  const clearText = () => {
    texts[theme] = '';
  };

  $effect(() => {
    if (!target) return;

    const isLight = theme === NeoTheme.Light;
    const bgVar = isLight ? '--neo-background-color' : '--neo-dark-background-color';
    const bgOther = isLight ? '--neo-dark-background-color' : '--neo-background-color';
    const txtVar = isLight ? '--neo-text-color' : '--neo-dark-text-color';
    const txtOther = isLight ? '--neo-dark-text-color' : '--neo-text-color';

    const bg = backgrounds[theme];
    const txt = texts[theme];

    if (bg) target.style.setProperty(bgVar, bg);
    else target.style.removeProperty(bgVar);

    if (txt) target.style.setProperty(txtVar, txt);
    else target.style.removeProperty(txtVar);

    target.style.removeProperty(bgOther);
    target.style.removeProperty(txtOther);
  });
</script>

<NeoButtonGroup elevation="2" {rounded} {...rest}>
  <NeoButton
    aria-label="Reset theme background color to default"
    title="Reset theme background color to default"
    label={labelBackground}
    onclick={clearBackground}
  />
  <span class="neo-theme-picker">
    <NeoColorPickerSelector
      aria-label="Select theme background color"
      title="Select theme background color"
      bind:value={() => backgrounds[theme], v => (backgrounds[theme] = v ?? '')}
      {rounded}
    />
  </span>
  <NeoButton aria-label="Reset theme text color to default" title="Reset theme text color to default" label={labelText} onclick={clearText} />
  <span class="neo-theme-picker">
    <NeoColorPickerSelector
      aria-label="Select theme text color"
      title="Select theme text color"
      bind:value={() => texts[theme], v => (texts[theme] = v ?? '')}
      {rounded}
    />
  </span>
  {@render children?.(context.state)}
</NeoButtonGroup>

<style lang="scss">
  .neo-theme-picker {
    --neo-color-picker-border-width: var(--neo-border-width-md);
    --neo-color-picker-border-color: var(--neo-border-color);

    display: inline-flex;
    align-items: center;

    &:last-child {
      margin-right: 0.5rem;
    }
  }
</style>
