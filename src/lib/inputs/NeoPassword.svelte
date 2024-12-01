<script lang="ts">
  import type { NeoInputProps } from '~/inputs/neo-input.model.js';

  import IconWatch from '~/icons/IconWatch.svelte';
  import IconWatchOff from '~/icons/IconWatchOff.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';

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
    ...rest
  }: NeoInputProps = $props();
  /* eslint-enable prefer-const */

  let show = $state(false);
  const toggle = () => {
    show = !show;
  };

  const _type = $derived(show ? 'text' : type);
  const afterProps = $derived({
    onclick: toggle,
    'aria-label': 'Toggle password visibility',
    ...rest.afterProps,
  });
</script>

{#snippet after()}
  {#if show}
    <IconWatch width="1.75rem" height="1.75rem" />
  {:else}
    <IconWatchOff width="1.75rem" height="1.75rem" />
  {/if}
{/snippet}

<NeoInput
  bind:ref
  bind:labelRef
  bind:beforeRef
  bind:value
  bind:valid
  bind:dirty
  bind:touched
  type={_type}
  {placeholder}
  {after}
  {afterProps}
  {...rest}
/>
