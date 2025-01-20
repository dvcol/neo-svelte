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
  <NeoButton onclick={clearBackground}>{labelBackground}</NeoButton>
  <span class="neo-theme-picker">
    <NeoColorPickerSelector bind:value={background} {rounded} />
  </span>
  <NeoButton onclick={clearText}>{labelText}</NeoButton>
  <span class="neo-theme-picker">
    <NeoColorPickerSelector bind:value={text} {rounded} />
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
