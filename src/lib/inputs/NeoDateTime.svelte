<script lang="ts">
  import type { NeoDateTimeProps } from '~/inputs/neo-date-time.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { type NeoButtonProps } from '~/buttons/neo-button.model.js';

  import IconCalendar from '~/icons/IconCalendar.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { coerce, computeButtonTemplate, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    icon: customIcon,

    // State
    type = 'date',
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    placeholder = 'Select a date',

    // Other props
    containerRef = $bindable(),
    validationRef = $bindable(),
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

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonTemplate(elevation, rest?.pressed, rest?.glass));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    start: rest.start,
    ...template,
    ...buttonProps,
    onclick,
  });
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if customIcon}
        {@render customIcon()}
      {:else}
        <IconCalendar size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<div class="neo-date-time" class:neo-picker={ref?.showPicker}>
  <NeoInput
    bind:ref
    bind:containerRef
    bind:validationRef
    bind:labelRef
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:focusin
    {type}
    {placeholder}
    after={ref?.showPicker ? after : undefined}
    {...rest}
    class={['neo-input-date-time', rest.class]}
  />
</div>

<style lang="scss">
  .neo-date-time {
    &.neo-picker {
      :global(.neo-input.neo-input-date-time::-webkit-calendar-picker-indicator) {
        display: none; /* Hide the default date icon in WebKit browsers */
        appearance: none; /* Hide the default date icon in Firefox */
      }
    }

    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-text:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-fields-wrapper:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-hour-field:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-minute-field:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-day-field:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-week-field:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-month-field:focus),
    :global(.neo-input.neo-input-date-time::-webkit-datetime-edit-year-field:focus) {
      color: var(--neo-date-time-text-color, var(--neo-text-color));
      background-color: var(--neo-date-time-text-highlight-color, var(--neo-text-highlight-color));
      outline: none;
    }
  }
</style>
