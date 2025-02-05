<script lang="ts">
  import { watch } from '@dvcol/svelte-utils';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDoubleChevron from '~/icons/IconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { displayValue, type NeoSelectProps } from '~/inputs/neo-select.model.js';
  import NeoPopSelect from '~/tooltips/NeoPopSelect.svelte';
  import { coerce, computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    icon: customIcon,

    // State
    options = [],
    display = displayValue,

    // Input Props
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    multiple,
    floating,
    rounded,

    // Pop Select Props
    listRef = $bindable(),
    highlight = $bindable(),
    filter = $bindable(item => !item?.hidden),
    sort = $bindable(() => 0),
    selected = $bindable(),
    search,

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),

    // Other props
    containerRef = $bindable(),
    wrapperRef = $bindable(),
    labelRef = $bindable(),
    listProps,
    buttonProps,
    ...rest
  }: NeoSelectProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    title: 'Toggle select dropdown',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    glass: rest.glass,
    start: rest.start,
    rounded,
    text,
    style,
    onclick: () => {
      open = !open;
    },
    ...buttonProps,
    class: ['neo-select-toggle', buttonProps?.class],
  });

  const space = $derived(open ? 9 : 6);

  watch(
    () => {
      value = display(selected);
      touched = true;
    },
    () => selected,
    {
      skip: 1,
      next: () => ref?.validate?.(),
    },
  );

  // TODO - rework focus highlights
  // implement readonly
  // make clearable work
  // list padding ?
  // validation
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      {#if customIcon}
        {@render customIcon()}
      {:else}
        <IconDoubleChevron {space} />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:wrapperRef
  bind:labelRef
  bind:dirty
  bind:valid
  bind:touched
  bind:hovered
  bind:focused
  bind:focusin
  {value}
  {rounded}
  {floating}
  {after}
  {children}
  {...rest}
  readonly
/>

<NeoPopSelect
  target={containerRef}
  bind:listRef
  bind:highlight
  bind:filter
  bind:sort
  bind:selected
  bind:tooltipRef
  bind:triggerRef
  bind:open
  items={options}
  multiple={!!multiple}
  {rounded}
  {search}
  {...listProps}
  tooltipProps={{ width: 'min', openOnHover: false, ...listProps?.tooltipProps }}
/>
