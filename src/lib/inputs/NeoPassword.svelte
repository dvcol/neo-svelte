<script lang="ts">
  import type { NeoPasswordProps } from '~/inputs/neo-password.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconWatch from '~/icons/IconWatch.svelte';
  import IconWatchOff from '~/icons/IconWatchOff.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { DefaultShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    type = 'password',
    placeholder = 'Enter your password',

    // Other props
    labelRef = $bindable(),
    beforeRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoPasswordProps = $props();
  /* eslint-enable prefer-const */

  let show = $state(false);

  const _type = $derived(show ? 'text' : type);

  const elevation = $derived(rest?.elevation ?? DefaultShadowElevation);
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived.by(() => {
    if (text) return;
    return `
      --neo-btn-box-shadow: var(--neo-box-shadow-raised-${Math.min(Math.abs(elevation), 3)});
      --neo-btn-box-shadow-hover: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      `;
  });
  const afterProps = $derived({
    'aria-label': 'Toggle password visibility',
    title: 'Toggle password visibility',
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    toggle: true,
  });
</script>

{#snippet after()}
  <NeoButton bind:checked={show} {...afterProps}>
    {#snippet icon()}
      {#if show}
        <IconWatchOff width="1.25rem" height="1.25rem" />
      {:else}
        <IconWatch width="1.25rem" height="1.25rem" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput bind:ref bind:labelRef bind:beforeRef bind:value bind:valid bind:dirty bind:touched type={_type} {placeholder} {after} {...rest} />
