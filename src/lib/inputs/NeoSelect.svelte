<script lang="ts">
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoSelectProps } from '~/inputs/neo-select.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDoubleChevron from '~/icons/IconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    type = 'select',

    // Other props
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoSelectProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    title: 'Toggle select dropdown',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    class: ['neo-select-toggle', buttonProps?.class],
  });
</script>

{#snippet after()}
  <NeoButton
    onclick={() => {
      ref?.focus?.();
      ref?.click?.();
      ref?.showPicker?.();
    }}
    {...afterProps}
  >
    {#snippet icon()}
      <IconDoubleChevron />
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput bind:ref bind:labelRef bind:touched bind:dirty bind:valid bind:value {type} {after} {...rest} />
