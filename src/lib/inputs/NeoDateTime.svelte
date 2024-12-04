<script lang="ts">
  import NeoButton from '../buttons/NeoButton.svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoDateTimeProps } from '~/inputs/neo-date-time.model.js';

  import IconCalendar from '~/icons/IconCalendar.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(undefined),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    type = 'date',

    // Other props
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoDateTimeProps = $props();
  /* eslint-enable prefer-const */

  const onclick: NeoButtonProps['onclick'] = e => {
    ref?.showPicker();
    buttonProps?.onclick?.(e);
  };

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    onclick,
  });
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      <IconCalendar width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

<div class="neo-date-time">
  <NeoInput bind:ref bind:labelRef bind:value bind:valid bind:dirty bind:touched {type} {after} {...rest} />
</div>

<style lang="scss">
  .neo-date-time {
    :global(.neo-input::-webkit-calendar-picker-indicator) {
      display: none; /* Hide the default date icon in WebKit browsers */
      appearance: none; /* Hide the default date icon in Firefox */
    }
  }
</style>
