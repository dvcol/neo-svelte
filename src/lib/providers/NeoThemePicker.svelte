<script lang="ts">
  import type { NeoThemePickerProps } from '~/providers/neo-theme-picker.model.js';

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
  const target = $derived(context.root);

  let background = $state('');
  let text = $state('');

  const clearBackground = () => {
    background = '';
    if (!target || !('style' in target)) return;
    target.style.removeProperty('--neo-background-color');
    target.style.removeProperty('--neo-dark-background-color');
  };

  const clearText = () => {
    text = '';
    if (!target || !('style' in target)) return;
    target.style.removeProperty('--neo-text-color');
    target.style.removeProperty('--neo-dark-text-color');
  };

  $effect(() => {
    if (!background) clearBackground();
    if (!text) clearText();

    if (!target || !('style' in target)) return;

    if (theme === NeoTheme.Light) {
      if (background) target.style.setProperty('--neo-background-color', background);
      target.style.removeProperty('--neo-dark-background-color');

      if (text) target.style.setProperty('--neo-text-color', text);
      target.style.removeProperty('--neo-dark-text-color');
    } else {
      if (background) target.style.setProperty('--neo-dark-background-color', background);
      target.style.removeProperty('--neo-background-color');

      if (text) target.style.setProperty('--neo-dark-text-color', text);
      target.style.removeProperty('--neo-text-color');
    }
  });
</script>

<NeoButtonGroup {rounded} {...rest}>
  <NeoButton aria-label="Reset theme background color to default" title="Reset theme background color to default" onclick={clearBackground}>
    {labelBackground}
  </NeoButton>
  <span class="neo-theme-picker">
    <NeoColorPickerSelector aria-label="Select theme background color" title="Select theme background color" bind:value={background} {rounded} />
  </span>
  <NeoButton aria-label="Reset theme text color to default" title="Reset theme text color to default" onclick={clearText}>
    {labelText}
  </NeoButton>
  <span class="neo-theme-picker">
    <NeoColorPickerSelector aria-label="Select theme text color" title="Select theme text color" bind:value={text} {rounded} />
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
