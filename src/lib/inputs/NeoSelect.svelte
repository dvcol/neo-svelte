<script lang="ts">
  import { watch } from '@dvcol/svelte-utils';

  import { tick } from 'svelte';

  import type { FormEventHandler, KeyboardEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import type { NeoTooltipElevation } from '~/tooltips/neo-tooltip.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconDoubleChevron from '~/icons/IconDoubleChevron.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { type NeoSelectProps, transformValue } from '~/inputs/neo-select.model.js';
  import NeoPopSelect from '~/tooltips/NeoPopSelect.svelte';
  import { getNextFocusableElement } from '~/utils/html-element.utils.js';
  import { coerce, computeButtonShadows, computeButtonStyle, getDefaultElevation, getDefaultHoverElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    content: customDisplay,
    icon: customIcon,

    // State
    options: items = [],
    display,
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
    affixProps,
    ...rest
  }: NeoSelectProps = $props();
  /* eslint-enable prefer-const */

  const toggle: FormEventHandler<HTMLElement> = e => {
    if (rest?.disabled || readonly) return;
    open = !open;
    e.stopPropagation();
    e.preventDefault();
  };

  const elevation = $derived(coerce(rest?.elevation ?? getDefaultElevation(rest?.pressed)));
  const template = $derived(computeButtonStyle(elevation, rest?.pressed));
  const style = $derived(computeButtonShadows(elevation, template));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle select dropdown',
    title: 'Toggle select dropdown',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    glass: rest.glass,
    start: rest.start,
    rounded,
    style,
    onclick: toggle,
    ...template,
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

  const hover = $derived(coerce(rest?.hover ?? getDefaultHoverElevation(rest?.pressed)));
  const tooltipElevation = $derived((rest?.pressed ? Math.abs(elevation + hover) : elevation + hover) as NeoTooltipElevation);

  const hasValue = $derived(!!(Array.isArray(selected) ? selected.length : selected));
  const close = $derived(clearable && (focusin || focused || hovered || open) && hasValue);
  const onClear: FormEventHandler<HTMLElement> = e => {
    selected = multiple ? [] : undefined;
    e.stopPropagation();
    e.preventDefault();
  };

  const selectItem = async () => {
    await tick();
    getNextFocusableElement(listRef)?.focus();
  };

  const onkeydown: KeyboardEventHandler<HTMLElement> = e => {
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
  bind:hovered={() => {
    return hovered || open;
  }, // eslint-disable-line no-sequences
  _state => {
    hovered = _state;
  }}
  bind:focused
  bind:focusin
  bind:value
  display={(display ?? customDisplay) ? (customDisplay ?? display?.(selected)) : undefined}
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
  {...rest}
  readonly
  hidden
  tabindex={-1}
  aria-hidden
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
  {color}
  {tinted}
  filled={!rest?.glass}
  elevation={tooltipElevation}
  {...listProps}
  tooltipProps={{ openOnHover: false, openOnFocus: false, ...listProps?.tooltipProps }}
/>
