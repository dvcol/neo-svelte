<script lang="ts">
  import { watch } from '@dvcol/svelte-utils/watch';

  import type { UseFloatingReturn } from '@skeletonlabs/floating-ui-svelte';
  import type { NeoTooltipContext, NeoTooltipToggle } from 'src/lib/index.js';
  import type { NeoPopSelectProps } from '~/floating/tooltips/neo-pop-select.model.js';
  import type { NeoListContext, NeoListItemOrSection } from '~/list/neo-list.model.js';

  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import NeoList from '~/list/NeoList.svelte';
  import NeoListSearch from '~/list/NeoListSearch.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children: trigger,
    before,

    // States
    search = false,
    items: array = [],

    // Styles
    rounded = false,
    width = 'min',
    height = 'min',

    // List Props
    listRef = $bindable(),
    highlight = $bindable(),
    filter = $bindable(item => !item?.hidden),
    sort = $bindable(() => 0),
    selected = $bindable(),
    focused = $bindable(false),

    // Tooltip Props
    tooltipRef = $bindable(),
    triggerRef = $bindable(),
    open = $bindable(false),
    target,
    color,
    filled,
    tinted,
    elevation,
    openDelay,
    hoverDelay,
    openOnFocus,
    openOnHover,

    // Sizing
    flex,
    justify,
    align,
    padding = '0',

    // Actions
    in: inAction,
    out: outAction,
    transition,
    use,

    // Events
    onSelect,
    onClose,
    onOpen,

    // Other Props
    tooltipProps,
    searchProps,
    ...rest
  }: NeoPopSelectProps = $props();
  /* eslint-enable prefer-const */

  const items = $derived<NeoListItemOrSection[]>(array?.map(i => (typeof i === 'object' ? i : { value: i })));

  watch(
    () => {
      tooltipRef?.update?.();
    },
    () => [items, selected],
  );
</script>

{#snippet beforeList(context: NeoListContext)}
  {#if search}
    <NeoListSearch
      bind:focused
      elevation="0"
      hover="-1"
      value={highlight}
      {context}
      {...searchProps}
      inputProps={{ rounded, ...searchProps?.inputProps }}
    />
  {/if}
  {@render before?.(context)}
{/snippet}

{#snippet tooltip(floating: UseFloatingReturn)}
  <NeoList
    bind:ref={listRef}
    bind:selected
    bind:highlight
    bind:filter
    bind:sort
    select
    reverse={floating?.placement?.startsWith('top')}
    before={search ? beforeList : before}
    {items}
    {onSelect}
    {...rest}
    buttonProps={{ rounded, ...rest.buttonProps }}
    class={['neo-pop-select-list', rest.class]}
  />
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open={
    () => open || focused, // eslint-disable-line no-sequences
    value => {
      open = value;
    }
  }
  {tooltip}
  unmountOnClose={false}
  {target}
  {rounded}
  {flex}
  {align}
  {justify}
  {width}
  {height}
  {padding}
  {color}
  {filled}
  {tinted}
  {elevation}
  {openDelay}
  {hoverDelay}
  {openOnFocus}
  {openOnHover}
  {onClose}
  {onOpen}
  {use}
  {transition}
  in={inAction}
  out={outAction}
  {...tooltipProps}
>
  {#snippet children(floating: NeoTooltipContext, toggle: NeoTooltipToggle)}
    {@render trigger?.(floating, toggle)}
  {/snippet}
</NeoTooltip>
