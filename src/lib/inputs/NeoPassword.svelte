<script lang="ts" generics="T extends boolean = false">
  import type { NeoButtonProps } from '~/buttons/index.js';
  import type { NeoPasswordProps } from '~/inputs/neo-password.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconWatch from '~/icons/IconWatch.svelte';
  import IconWatchOff from '~/icons/IconWatchOff.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Styles
    pin,

    // State
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    type = 'password',
    placeholder = pin ? undefined : 'Enter your password',

    // Other props
    containerRef = $bindable(),
    wrapperRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoPasswordProps<T> = $props();
  /* eslint-enable prefer-const */

  let show = $state(false);

  const _type = $derived(show ? 'text' : type);

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed || pin);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle password visibility',
    title: 'Toggle password visibility',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    toggle: true,
    class: ['neo-password-toggle', buttonProps?.class],
  });
</script>

{#snippet after()}
  <NeoButton bind:checked={show} {...afterProps}>
    {#snippet icon()}
      {#if show}
        <IconWatchOff size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {:else}
        <IconWatch size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#if pin}
  <NeoPin
    bind:ref
    bind:containerRef
    bind:wrapperRef
    bind:labelRef
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    type={_type}
    {placeholder}
    {after}
    {...rest}
  />
{:else}
  <NeoInput
    bind:ref
    bind:containerRef
    bind:wrapperRef
    bind:labelRef
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    type={_type}
    {placeholder}
    {after}
    {...rest}
  />
{/if}
