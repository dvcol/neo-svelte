<script lang="ts">
  import type { NeoInputProps } from '~/input/neo-input.model.js';

  import IconWatch from '~/icons/IconWatch.svelte';
  import IconWatchOff from '~/icons/IconWatchOff.svelte';
  import NeoInput from '~/input/NeoInput.svelte';

  const { type = 'password', placeholder = 'Enter your password', ...rest }: NeoInputProps = $props();

  let show = $state(false);
  const toggle = () => {
    show = !show;
  };

  const _type = $derived(show ? 'text' : type);
  const _suffixProps = $derived({
    onclick: toggle,
    'aria-label': 'Toggle password visibility',
    ...rest.suffixProps,
  });
</script>

{#snippet suffix()}
  {#if show}
    <IconWatch width="1.75rem" height="1.75rem" />
  {:else}
    <IconWatchOff width="1.75rem" height="1.75rem" />
  {/if}
{/snippet}

<NeoInput type={_type} {placeholder} {suffix} suffixProps={_suffixProps} {...rest} />
