<script lang="ts">
  import { watch } from '@dvcol/svelte-utils';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDoubleChevron from '~/icons/IconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { type NeoSelectProps, transformValue } from '~/inputs/neo-select.model.js';
  import NeoPopSelect from '~/tooltips/NeoPopSelect.svelte';
  import { coerce, computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    icon: customIcon,

    // State
    options: items = [],
    transform = transformValue,

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
    readonly,

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
    width,
    height,

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

  const space = $derived(open ? 8 : 6);

  watch(
    () => {
      value = transform(selected);
      touched = true;
    },
    () => selected,
    {
      skip: 1,
      next: () => ref?.validate?.(),
    },
  );

  // TODO - disaply input ???
  // TODO - rework focus highlights
  // TODO - custom render trigger popselect ?
  // TODO - pill
  // make clearable work
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
  {readonly}
  {items}
  multiple={!!multiple}
  {rounded}
  {search}
  {width}
  {height}
  {...listProps}
  tooltipProps={{ openOnHover: false, ...listProps?.tooltipProps }}
/>
