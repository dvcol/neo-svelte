<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';

  import type { FormEventHandler, KeyboardEventHandler } from 'svelte/elements';

  import type { NeoListItemOrSection } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAlignBottom from '~/icons/IconAlignBottom.svelte';
  import IconAlignMiddle from '~/icons/IconAlignMiddle.svelte';
  import IconAlignTop from '~/icons/IconAlignTop.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { itemLabelSort, itemSearchFilter, type NeoListSearchProps } from '~/list/neo-list-search.model.js';
  import { getNextFocusableElement } from '~/utils/html-element.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    tag = 'div',
    ref = $bindable(),
    delay = 250,
    reverse = $bindable(),
    filter = itemSearchFilter,
    sort = itemLabelSort,

    // List Context
    context,

    // Input props
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),

    loading,
    elevation = 0,
    hover = 0,
    placeholder = 'Search...',

    // Other props
    inputProps,
    ...rest
  }: NeoListSearchProps = $props();
  /* eslint-enable prefer-const */

  const setFilter = debounce((_value: string) => {
    if (!context) return console.warn('NeoListSearch: No `highlight` context is missing or invalid.', context);
    context.highlight = _value;
  }, delay);

  const oninput: FormEventHandler<HTMLInputElement> = e => {
    setFilter(e?.currentTarget?.value);
    inputProps?.oninput?.(e);
  };

  const onkeydown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key !== 'ArrowDown' || !(e.target instanceof HTMLElement)) return;
    const target = e.target.parentElement?.parentElement?.querySelector('.neo-list-item.neo-list-item-select');
    if (target) e.preventDefault();
    getNextFocusableElement(target)?.focus();
    inputProps?.onkeydown?.(e);
  };

  const sortFunction = (a: NeoListItemOrSection, b: NeoListItemOrSection) => sort(a, b, reverse);
  const onclick: FormEventHandler<HTMLButtonElement> = () => {
    if (!context) return;
    if (reverse === false) {
      context.sort = undefined;
      reverse = undefined;
      return;
    }
    if (context.sort !== sortFunction) context.sort = sortFunction;
    reverse = !reverse;
  };
  const title = $derived.by(() => {
    if (reverse === undefined) return 'Initial sorting order';
    return reverse ? 'Alphabetical order (descending)' : 'Alphabetical order (ascending)';
  });

  const filterFunction = (item: NeoListItemOrSection) => filter(item, context?.highlight);
  $effect(() => {
    if (!context || context?.filter === filterFunction) return;
    context.filter = filterFunction;
  });

  //  customise loading/clear icons in input & text area
</script>

{#snippet before()}
  <IconSearch size="1.25rem" />
{/snippet}

{#snippet after()}
  <NeoButton text rounded shallow {title} aria-label="Change sorting order" {onclick}>
    {#snippet icon()}
      {#if reverse === undefined}
        <IconAlignMiddle size="1.25rem" stroke="1.5" />
      {:else if reverse}
        <IconAlignBottom />
      {:else}
        <IconAlignTop />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<svelte:element this={tag} class:neo-list-search={true} {...rest}>
  <NeoInput
    bind:ref
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:focusin
    type="search"
    rounded
    clearable
    {placeholder}
    {oninput}
    {elevation}
    {hover}
    {loading}
    {before}
    {after}
    {onkeydown}
    {...inputProps}
    containerProps={{
      ...inputProps?.containerProps,
      class: ['neo-list-search-input', inputProps?.containerProps?.class],
    }}
  />
</svelte:element>

<style lang="scss">
  .neo-list-search {
    display: inline-flex;
    flex-direction: column;

    :global(.neo-list-search-input) {
      margin-bottom: 0;
    }
  }
</style>
