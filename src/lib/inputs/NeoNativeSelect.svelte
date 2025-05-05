<script lang="ts">
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoNativeSelectProps } from '~/inputs/neo-select.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconDoubleChevron from '~/icons/NeoIconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { coerce, computeButtonTemplate, getDefaultElevation } from '~/utils/shadow.utils.js';

  let {
    // Snippets
    children,
    icon: customIcon,

    // State
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    type = 'select',
    options = [],
    multiple,
    floating,

    // Other props
    containerRef = $bindable(),
    validationRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    ...rest
  }: NeoNativeSelectProps = $props();

  const items = $derived(options?.map(i => (typeof i === 'object' ? i : { value: i })));

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonTemplate(elevation, rest?.pressed, rest?.glass));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    'title': 'Toggle select dropdown',
    'skeleton': rest.skeleton,
    'disabled': rest.disabled,
    'rounded': rest.rounded,
    'start': rest.start,
    'onclick': () => {
      ref?.focus?.();
      ref?.click?.();
      ref?.showPicker?.();
    },
    ...template,
    ...buttonProps,
    'class': ['neo-select-toggle', buttonProps?.class],
  });

  let space = $state(6);
  const onpointerdown = () => {
    space = 8;
  };

  let timeout: ReturnType<typeof setTimeout>;
  const onpointerup = async () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      space = 6;
    }, 250);
  };
</script>

{#snippet after()}
  <NeoButton {onpointerdown} {onpointerup} {...afterProps}>
    {#snippet icon(ctx)}
      {#if customIcon}
        {@render customIcon(ctx)}
      {:else}
        <NeoIconDoubleChevron {space} />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet content()}
  {#each items as { id, label, ...option }, i (id ?? i)}
    <option {id} {...option} value={option.value}>{label ?? option.value}</option>
  {/each}
  {@render children?.()}
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:validationRef
  bind:labelRef
  bind:value
  bind:dirty
  bind:valid
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  {type}
  {multiple}
  floating={multiple ? false : floating}
  after={multiple ? undefined : after}
  children={items?.length ? content : children}
  {onpointerdown}
  {onpointerup}
  {...rest}
/>
