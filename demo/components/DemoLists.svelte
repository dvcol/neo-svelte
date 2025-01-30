<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import type { NeoListItem, NeoListProps, NeoListSection } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoList from '~/list/NeoList.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { Colors } from '~/utils/colors.utils';
  import { enterTransitionProps } from '~/utils/transition.utils';

  const options = $state<NeoListProps>({
    loading: false,
    skeleton: false,
    shadow: true,
    scrollToLoader: false,
    disabled: false,
    readonly: false,
  });

  const custom: NeoListItem = { label: 'Custom Render Item', value: -1, render, id: getUUID() };

  const list: NeoListItem[] = $state(
    [
      { label: 'Line item label', value: 0 },
      { label: 'Line item with longer label', value: 1 },
      custom,
      {
        label: 'Line item with external link',
        value: 'https://www.google.com',
        href: 'https://www.google.com',
        buttonProps: { target: '_blank' },
        title: 'This is a link to google',
        color: Colors.Primary,
        divider: true,
      },
      {
        label: 'Line item with onclick',
        value: 'This is a clickable item',
        onclick: () => console.info('clicked'),
        title: 'This is a clickable element',
      },
      {
        label: 'Line item disabled',
        value: 'This is a disabled item',
        onclick: () => console.info('disabled clicked'),
        disabled: true,
        divider: true,
      },
      { label: 'Line item error', value: 2, color: Colors.Error },
      { label: 'Line item warning', value: 3, color: Colors.Warning },
      { label: 'Line item success', value: 4, color: Colors.Success },
      { label: 'Line item primary', value: 5, color: Colors.Primary },
      { label: 'Line item secondary', value: 6, color: Colors.Secondary },
    ].map(item => ({ ...item, id: item?.id ?? getUUID() })),
  );

  const sectionA: NeoListSection = $state({
    id: getUUID(),
    title: 'Section A',
    divider: true,
    items: [
      { label: 'Section A item 1', value: 'section A - 1', color: Colors.Primary },
      { label: 'Section A item 2', value: 'section A - 2', color: Colors.Primary },
      { label: 'Section A item 4', value: 'section A - 3', color: Colors.Primary },
    ].map(item => ({ ...item, id: item?.id ?? getUUID() })),
  });

  const sectionB: NeoListSection = {
    id: getUUID(),
    title: 'Section B',
    divider: true,
    items: [
      { label: 'Section B item 1', value: 'section B - 1', color: Colors.Secondary },
      { label: 'Section B item 2', value: 'section B - 2', color: Colors.Secondary },
      { label: 'Section B item 4', value: 'section B - 3', color: Colors.Secondary },
    ].map(item => ({ ...item, id: item?.id ?? getUUID() })),
  };

  const customSection: NeoListSection = {
    id: getUUID(),
    title: 'Item render section',
    divider: true,
    render: renderSection,
    items: [
      { label: 'Custom Section item 1', value: 'custom section - 1', color: Colors.Primary },
      { label: 'Custom Section item 2', value: 'custom section - 2', color: Colors.Primary },
      { label: 'Custom Section item 4', value: 'custom section - 3', color: Colors.Primary },
    ].map(item => ({ ...item, id: item?.id ?? getUUID() })),
  };

  const selected = [{ item: list[4] }, { item: list[6] }];

  let isEmpty = $state(false);
  const items = $derived(isEmpty ? [] : list.filter(item => item.id !== custom.id));

  const withCustom = $derived(isEmpty ? [] : list);

  const sectionList = $state([...list.slice(0, 4), sectionA, sectionB]);
  const withSection = $derived(isEmpty ? [] : sectionList);

  const customSectionList = $state([...list.slice(0, 4), sectionA, customSection, sectionB]);
  const withCustomSection = $derived(isEmpty ? [] : customSectionList);

  const onAdd = () => {
    list.push({ label: `Line item ${list.length + 1}`, value: list.length + 1, id: getUUID() });
    sectionList.push({ label: `Section item ${sectionList.length + 1}`, value: sectionList.length + 1, id: getUUID() });
    customSectionList.push({ label: `Custom Section item ${customSectionList.length + 1}`, value: customSectionList.length + 1, id: getUUID() });
  };

  // remove a random element form the list
  const onRemove = () => {
    if (list.length) list.splice(Math.floor(Math.random() * list.length), 1);
    if (sectionList.length) sectionList.splice(Math.floor(Math.random() * sectionList.length), 1);
    if (customSectionList.length) customSectionList.splice(Math.floor(Math.random() * customSectionList.length), 1);
  };
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={isEmpty}>Empty</NeoButton>
    <NeoButton toggle bind:checked={options.shadow}>Shadow</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.scrollToLoader}>Scroll to loader</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton onclick={onAdd}>Add</NeoButton>
    <NeoButton onclick={onRemove}>Remove</NeoButton>
  </NeoButtonGroup>
</div>

{#snippet render({ context: { skeleton } })}
  <NeoSkeletonText class="custom-item-skeleton" loading={skeleton} lines={4} align="center">
    <div class="custom-item-card">
      <div>Custom Render Item</div>
      <div>- John Doe</div>
      <div>- john.doe@email.com</div>
      <div>- 123-456-7890</div>
    </div>
  </NeoSkeletonText>
{/snippet}

{#snippet renderSection(_children, _context)}
  <h2>Custom Section</h2>
  <h4>{_context?.section?.title}</h4>
  <ul>
    {@render _children(_context)}
  </ul>
{/snippet}

{#snippet item({ item: { label, value }, index, context: { skeleton } })}
  <NeoSkeletonText class="custom-item-skeleton" loading={skeleton} lines={3} align="center">
    <div class="custom-item-card">
      <div>{label}</div>
      <div>index: {index}</div>
      <div>value: {value}</div>
    </div>
  </NeoSkeletonText>
{/snippet}

<div class="row">
  <!--  card-->
  <div class="column content">
    <span class="label">Card List</span>
    <NeoCard rounded elevation="0" scrollbar={false} hover="-2" height="20rem" width="min(80vw, 18rem)" spacing="0.75rem">
      <NeoList select {items} {...options} />
    </NeoCard>
  </div>

  <!--  multi line loader-->
  <div class="column content">
    <span class="label">Multi-line loader</span>
    <NeoList {items} {...options} loading={options.loading ? 10 : false} />
  </div>

  <!--  custom loader-->
  <div class="column content">
    <span class="label">Custom loader</span>
    <NeoList {items} {...options}>
      {#snippet loader()}
        <div class="custom-list-loader">
          <IconCircleLoading size="2rem" />
        </div>
      {/snippet}
    </NeoList>
  </div>

  <!--  custom empty-->
  <div class="column content">
    <span class="label">Custom Empty</span>
    <NeoList {items} {...options}>
      {#snippet empty()}
        <li class="custom-list-loader" in:fade={enterTransitionProps}>
          <span> Custom empty snippet</span>
        </li>
      {/snippet}
    </NeoList>
  </div>

  <!--  custom render -->
  <div class="column content">
    <span class="label">Custom Render</span>
    <NeoList items={withCustom} {...options} />
  </div>

  <!--  custom item-->
  <div class="column content">
    <span class="label">Custom item</span>
    <NeoList items={withCustom} {item} {...options} />
  </div>

  {#snippet values(ctx)}
    <div class="list-values">
      {#if Array.isArray(ctx.selected)}
        Values: {ctx.selected?.map(i => i.item?.value).join(', ') || 'no values'}
      {:else}
        Value: {ctx.selected?.item?.value || 'no value'}
      {/if}
    </div>
  {/snippet}

  <!--  select items -->
  <div class="column content">
    <span class="label">Select item</span>
    <NeoList select selected={selected[0]} {items} {...options} onselect={e => console.info('onSelect - single', e)} after={values} />
  </div>

  <!--  multi select items -->

  <div class="column content">
    <span class="label">Select multiple</span>
    <NeoList select multiple selected={[...selected]} {items} {...options} onselect={e => console.info('onSelect - multiple', e)} after={values} />
  </div>

  <!--  section (i.e. sub-lists) -->

  <div class="column content">
    <span class="label">Select section</span>
    <NeoList select multiple items={withSection} {...options} onselect={e => console.info('onSelect - sections', e)} after={values} />
  </div>

  <!--  custom section -->
  <div class="column content">
    <span class="label">Custom section</span>
    <NeoList items={withCustomSection} {...options} {item}>
      {#snippet section(_children, _context)}
        <h2>{_context?.section?.title}</h2>
        <ul>
          {@render _children(_context)}
        </ul>
      {/snippet}
    </NeoList>
  </div>

  <!-- custom item with select, before, after & description  & loader  -->

  <!--  tooltip item (nested menu drawer, portal ?) -->

  <!--  search items -->

  <!--  custom filter snippet -->
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    text-align: center;
    word-break: break-all;
  }

  .custom-list-loader {
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 0.5rem;
  }

  .custom-item-card {
    display: flex;
    flex-direction: column;
    margin-block: 0.25rem;
  }

  .list-values {
    margin-top: 0.25rem;
    color: var(--neo-text-color-secondary);
    font-size: var(--neo-font-size-sm);
    padding-inline: 1.125rem;
  }

  .custom-item-card,
  :global(.custom-item-skeleton) {
    border: var(--neo-border-width) solid var(--neo-border-color);
    border-radius: 0.5rem;
    padding-inline: 0.5rem;
    margin-block: 0.25rem;
  }

  .column {
    @include flex.column($gap: var(--neo-gap-lg), $flex: 0 1 20%);

    &.content {
      width: min(80vw, 18rem);
      height: min(80vh, 24rem);

      :global(.neo-list) {
        max-height: calc(min(80vh, 24rem) - var(--neo-gap-lg) - 2rem);
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    min-width: 80vw;
    margin: 2rem 0;
  }
</style>
