<script lang="ts">
  import NeoButton from '../buttons/NeoButton.svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';

  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    files = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    placeholder = 'Choose a file',

    // Other props
    labelRef = $bindable(),
    buttonProps,
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoFilePickerProps = $props();
  /* eslint-enable prefer-const */

  const onclick: NeoButtonProps['onclick'] = e => {
    ref?.focus?.();
    ref?.click?.();
    buttonProps?.onclick?.(e);
  };

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    onclick,
  });

  // TODO expanded
  // TODO animated idle drag over/select
  // TODO animated loading progress
  // TODO animated success/failure
  // TODO show accepted file types
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      <IconFileUpload width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

<svelte:element this={containerTag} class:neo-file-picker={true} {...containerProps}>
  <NeoInput
    bind:ref
    bind:labelRef
    bind:files
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    type="file"
    {placeholder}
    {after}
    {...rest}
  />
</svelte:element>

<style lang="scss">
  .neo-file-picker {
    :global(.neo-input::file-selector-button) {
      display: none;
    }
  }
</style>
