<script lang="ts">
  import type { FormEventHandler, KeyboardEventHandler } from 'svelte/elements';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoTooltipElevation } from '~/floating/tooltips/neo-tooltip.model.js';
  import type { NeoSelectProps } from '~/inputs/neo-select.model.js';
  import type { NeoListItemOrSection } from '~/list/neo-list.model.js';

  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { clamp } from '@dvcol/common-utils/common/math';
  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoPopSelect from '~/floating/tooltips/NeoPopSelect.svelte';
  import NeoIconDoubleChevron from '~/icons/NeoIconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { displayValue, transformValue } from '~/inputs/neo-select.model.js';
  import { findByValuesInList } from '~/list/neo-list.model.js';
  import NeoImage from '~/media/NeoImage.svelte';
  import { coerce, computeButtonTemplate, getDefaultElevation, getDefaultHoverElevation, MaxShadowElevation } from '~/utils/shadow.utils.js';

  let {
    // Snippets
    children,
    content: customDisplay,
    icon: customIcon,

    // State
    options = [],
    display = displayValue,
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
    clearable,
    color,
    tinted,
    autocomplete,

    // Pop Select Props
    listRef = $bindable(),
    highlight = $bindable(),
    filter = $bindable(item => !item?.hidden),
    sort = $bindable(() => 0),
    selected = $bindable(),
    search,
    nullable,

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    position = $bindable(),
    openDelay,
    hoverDelay = 300,
    openOnHover = false,
    openOnFocus = false,

    // Events
    onChange,
    onSelect,
    onClose,
    onOpen,

    // Other props
    containerRef = $bindable(),
    validationRef = $bindable(),
    labelRef = $bindable(),
    listProps,
    buttonProps,
    affixProps,
    ...rest
  }: NeoSelectProps = $props();

  const items = $derived<NeoListItemOrSection[]>(options?.map(i => (typeof i === 'object' ? i : { value: i })));

  const toggle: FormEventHandler<HTMLElement> = (e) => {
    if (rest?.disabled || readonly) return;
    open = !open;
    e.stopPropagation();
    e.preventDefault();
  };

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonTemplate(elevation, rest?.pressed, rest?.glass));

  const hover = $derived(coerce(rest?.hover ?? getDefaultHoverElevation(rest?.pressed)));
  const tooltipElevation = $derived(
    clamp(rest?.pressed ? Math.abs(elevation + hover) : elevation + hover, 1, MaxShadowElevation) as NeoTooltipElevation,
  );

  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    'title': 'Toggle select dropdown',
    'skeleton': rest.skeleton,
    'disabled': rest.disabled,
    'start': rest.start,
    rounded,
    'onclick': toggle,
    ...template,
    ...buttonProps,
    'class': ['neo-select-toggle', buttonProps?.class],
  });

  const space = $derived(open ? 8 : 6);
  const transformed = $derived((transform ? transform(selected) : selected) ?? rest?.defaultValue);
  watch(
    () => {
      value = transformed;
      touched = true;
    },
    () => selected,
    {
      skip: 1,
      next: () => ref?.validate?.(),
    },
  );

  /**
   * Reflects change in input value to selected value
   */
  const reflectValue = () => {
    selected = findByValuesInList(value, items);
    if (selected === undefined) value = undefined;
  };

  watch(() => {
    if (!value || transformed === value) return;
    if (Array.isArray(value) && Array.isArray(transformed) && value.every(v => transformed.includes(v))) return;
    reflectValue();
  }, () => value);

  const hasValue = $derived(!!(Array.isArray(selected) ? selected.length : selected));
  const close = $derived(clearable && (focusin || focused || hovered || open) && hasValue);
  const onClear: FormEventHandler<HTMLElement> = (e) => {
    selected = multiple ? [] : undefined;
    e.stopPropagation();
    e.preventDefault();
  };

  const selectItem = async () => {
    await tick();
    getFocusableElement(listRef)?.focus();
  };

  const onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
    if (rest?.disabled || readonly) return;
    if (e.key === 'Enter' || e.key === ' ') {
      return toggle(e);
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!open) open = true;
      e.preventDefault();
      e.stopPropagation();
      selectItem();
    }
  };
</script>

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon(ctx)}
      {#if typeof customIcon === 'function'}
        {@render customIcon(ctx)}
      {:else if typeof customIcon === 'string'}
        <NeoImage src={customIcon} ratio="1/1" {...afterProps?.imageProps} />
      {:else}
        <NeoIconDoubleChevron {space} />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:validationRef
  bind:labelRef
  bind:dirty
  bind:valid
  bind:touched
  bind:hovered={() => {
      return hovered || open;
    },
    (_state) => {
      hovered = _state;
    }}
  bind:focused
  bind:focusin
  bind:value
  display={(customDisplay ?? display) ? (customDisplay ?? display?.(selected)) : undefined}
  {rounded}
  {floating}
  {clearable}
  {elevation}
  {hover}
  {color}
  {tinted}
  {after}
  {children}
  {multiple}
  {nullable}
  {autocomplete}
  {...rest}
  readonly
  inert
  tabindex={-1}
  affixProps={{
    close,
    readonly,
    ...affixProps,
    closeProps: { onclick: onClear, ...affixProps?.closeProps },
  }}
  containerProps={{
    tag: 'button',
    role: null,
    onclick: toggle,
    onkeydown,
    ...rest.containerProps,
  }}
/>

{#if autocomplete}
  <input aria-hidden="true" type="text" class="neo-select-autocomplete-hidden" {autocomplete} bind:value onchange={reflectValue} />
{/if}

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
  bind:position
  {readonly}
  {items}
  multiple={!!multiple}
  {nullable}
  {rounded}
  {search}
  {color}
  {tinted}
  {openDelay}
  {hoverDelay}
  {openOnFocus}
  {openOnHover}
  filled={!rest?.glass}
  elevation={tooltipElevation}
  {onClose}
  {onOpen}
  {onSelect}
  {onChange}
  {...listProps}
/>

<style lang="scss">
  .neo-select-autocomplete-hidden {
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    background: none;
    border: none;
    inset: 0;
  }
</style>
