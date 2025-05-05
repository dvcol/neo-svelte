<script lang="ts" generics="T extends boolean = false">
  import type { NeoButtonProps } from '~/buttons/index.js';
  import type { NeoPasswordProps } from '~/inputs/neo-password.model.js';
  import type { ShadowElevation } from '~/utils/shadow.utils.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconWatch from '~/icons/NeoIconWatch.svelte';
  import NeoIconWatchOff from '~/icons/NeoIconWatchOff.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
  import { coerce, computeButtonTemplate, getDefaultElevation } from '~/utils/shadow.utils.js';

  let {
    // Snippets
    icon: customIcon,

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
    focusin = $bindable(false),
    type = 'password',
    placeholder = pin ? undefined : 'Enter your password',

    // Other props
    containerRef = $bindable(),
    validationRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoPasswordProps<T> = $props();

  let show = $state(false);

  const _type = $derived(show ? 'text' : type);

  const elevation = $derived(coerce<ShadowElevation>(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonTemplate(elevation, rest?.pressed, pin || rest?.glass));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle password visibility',
    'title': 'Toggle password visibility',
    'skeleton': rest.skeleton,
    'disabled': rest.disabled,
    'rounded': rest.rounded,
    'start': rest.start,
    ...template,
    ...buttonProps,
    'toggle': true,
    'class': ['neo-password-toggle', buttonProps?.class],
  });
</script>

{#snippet after()}
  <NeoButton bind:checked={show} {...afterProps}>
    {#snippet icon()}
      {#if customIcon}
        {@render customIcon({ show })}
      {:else if show}
        <NeoIconWatchOff size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {:else}
        <NeoIconWatch size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#if pin}
  <NeoPin
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
    type={_type}
    {placeholder}
    {after}
    {...rest}
  />
{:else}
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
    type={_type}
    {placeholder}
    {after}
    {...rest}
  />
{/if}
