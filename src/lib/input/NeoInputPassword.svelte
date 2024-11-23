<script lang="ts">
  import type { NeoInputProps } from '~/input/neo-input.model.js';

  import IconWatch from '~/icons/IconWatch.svelte';
  import IconWatchOff from '~/icons/IconWatchOff.svelte';
  import NeoInput from '~/input/NeoInput.svelte';

  const { type = 'password', ...rest }: NeoInputProps = $props();

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
    <IconWatch />
  {:else}
    <IconWatchOff />
  {/if}
{/snippet}

<NeoInput type={_type} {suffix} suffixProps={_suffixProps} {...rest} />
