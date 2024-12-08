<script lang="ts">
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoDateTimeProps } from '~/inputs/neo-date-time.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  import IconCalendar from '~/icons/IconCalendar.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    type = 'date',
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    placeholder = 'Select a date',

    // Other props
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoDateTimeProps = $props();
  /* eslint-enable prefer-const */

  const onclick: NeoButtonProps['onclick'] = e => {
    ref?.focus?.();
    ref?.click?.();
    ref?.showPicker?.();
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
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      <IconCalendar width="1.25rem" height="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
    {/snippet}
  </NeoButton>
{/snippet}

<div class="neo-date-time" class:neo-picker={ref?.showPicker}>
  <NeoInput
    bind:ref
    bind:labelRef
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    {type}
    {placeholder}
    after={ref?.showPicker ? after : undefined}
    {...rest}
  />
</div>

<style lang="scss">
  .neo-date-time {
    &.neo-picker {
      :global(.neo-input::-webkit-calendar-picker-indicator) {
        display: none; /* Hide the default date icon in WebKit browsers */
        appearance: none; /* Hide the default date icon in Firefox */
      }
    }

    :global(.neo-input::-webkit-datetime-edit-text:focus),
    :global(.neo-input::-webkit-datetime-edit-fields-wrapper:focus),
    :global(.neo-input::-webkit-datetime-edit-hour-field:focus),
    :global(.neo-input::-webkit-datetime-edit-minute-field:focus),
    :global(.neo-input::-webkit-datetime-edit-day-field:focus),
    :global(.neo-input::-webkit-datetime-edit-week-field:focus),
    :global(.neo-input::-webkit-datetime-edit-month-field:focus),
    :global(.neo-input::-webkit-datetime-edit-year-field:focus) {
      color: var(--neo-date-time-text-color, var(--neo-text-color));
      background-color: var(--neo-date-time-text-highlight-color, var(--neo-text-highlight-color));
      outline: none;
    }
  }
</style>
