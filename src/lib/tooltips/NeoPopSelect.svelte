<script lang="ts">
  import type { UseFloatingReturn } from '@skeletonlabs/floating-ui-svelte';
  import type { NeoListContext, NeoListItemOrSection } from '~/list/neo-list.model.js';
  import type { NeoPopSelectProps } from '~/tooltips/neo-pop-select.model.js';

  import NeoList from '~/list/NeoList.svelte';
  import NeoListSearch from '~/list/NeoListSearch.svelte';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

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

    // Other Props
    tooltipProps,
    searchProps,
    ...rest
  }: NeoPopSelectProps = $props();
  /* eslint-enable prefer-const */

  const items = $derived<NeoListItemOrSection[]>(array?.map(i => (typeof i === 'object' ? i : { value: i })));
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

{#snippet tooltip()}
  <NeoList
    bind:ref={listRef}
    bind:selected
    bind:highlight
    bind:filter
    bind:sort
    select
    reverse={tooltipProps?.placement?.startsWith('top')}
    before={search ? beforeList : before}
    {items}
    {...rest}
    buttonProps={{ rounded, ...rest.buttonProps }}
    class={['neo-pop-select-list', rest.class]}
  />
{/snippet}

<NeoTooltip
  bind:ref={tooltipRef}
  bind:triggerRef
  bind:open={() => open || focused, // eslint-disable-line no-sequences
  value => {
    open = value;
  }}
  {tooltip}
  padding="0"
  {target}
  {rounded}
  {width}
  {height}
  {...tooltipProps}
>
  {#snippet children(floating: UseFloatingReturn)}
    {@render trigger?.(floating)}
  {/snippet}
</NeoTooltip>
