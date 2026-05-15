<script lang="ts">
  import type {
    NeoListContext,
    NeoListItem,
    NeoListItemContext,
    NeoListProps,
    NeoListRender,
    NeoListRenderContext,
    NeoListSection,
    NeoListSelectedItem,
  } from '~/list/neo-list.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import NeoIconCircleLoading from '~/icons/NeoIconCircleLoading.svelte';
  import NeoList from '~/list/NeoList.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListSearch from '~/list/NeoListSearch.svelte';
  import NeoSimpleList from '~/list/NeoSimpleList.svelte';
  import NeoVirtualList from '~/list/NeoVirtualList.svelte';
  import { Colors } from '~/utils/colors.utils';
  import { quickDurationProps } from '~/utils/transition.utils';

  const options = $state<NeoListProps>({
    loading: false,
    shadow: true,
    scrollToLoader: false,
    rounded: false,
    nullable: true,
    disabled: false,
    readonly: false,
    reverse: false,
    flip: false,
    dim: false,
    itemProps: {
      ellipsis: 1,
    },
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
        divider: { top: true },
        readonly: true,
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
        divider: { bottom: true },
      },
      { label: 'Line item error', value: 2, color: Colors.Error },
      { label: 'Line item warning', value: 3, color: Colors.Warning },
      { label: 'Line item success', value: 4, color: Colors.Success },
      { label: 'Line item primary', value: 5, color: Colors.Primary },
      { label: 'Line item secondary', value: 6, color: Colors.Secondary },
    ].map((item: NeoListItem) => ({ ...item, id: item?.id ?? getUUID() })),
  );

  const sectionA: NeoListSection = {
    id: getUUID(),
    label: 'Section A',
    divider: true,
    items: [
      { label: 'Section A item 1', value: 'section A - 1', color: Colors.Primary },
      { label: 'Section A item 2', value: 'section A - 2', color: Colors.Primary },
      { label: 'Section A item 4', value: 'section A - 3', color: Colors.Primary },
    ].map(item => ({ ...item, id: getUUID() })),
  };

  const sectionB: NeoListSection = {
    id: getUUID(),
    label: 'Section B',
    divider: true,
    items: [
      { label: 'Section B item 1', value: 'section B - 1', color: Colors.Secondary },
      { label: 'Section B item 2', value: 'section B - 2', color: Colors.Secondary },
      { label: 'Section B item 4', value: 'section B - 3', color: Colors.Secondary },
    ].map(item => ({ ...item, id: getUUID() })),
  };

  const customSection: NeoListSection = {
    id: getUUID(),
    label: 'Item render section',
    divider: true,
    render: renderSection,
    items: [
      { label: 'Custom Section item 1', value: 'custom section - 1', color: Colors.Primary },
      { label: 'Custom Section item 2', value: 'custom section - 2', color: Colors.Primary },
      { label: 'Custom Section item 4', value: 'custom section - 3', color: Colors.Primary },
    ].map(item => ({ ...item, id: getUUID() })),
  };

  const selected = [{ item: list[4] }, { item: list[6] }] as NeoListSelectedItem[];

  let isEmpty = $state(false);
  const items = $derived<NeoListProps['items']>(isEmpty ? [] : list.filter(item => item.id !== custom.id));

  const withCustom = $derived<NeoListProps['items']>(isEmpty ? [] : list);

  const sectionList = $state([...list.slice(0, 4), sectionA, sectionB]);
  const withSection = $derived<NeoListProps['items']>(isEmpty ? [] : sectionList);

  const customSectionList = $state([...list.slice(0, 4), sectionA, customSection, sectionB]);
  const withCustomSection = $derived<NeoListProps['items']>(isEmpty ? [] : customSectionList);

  const complexList = $state<NonNullable<NeoListProps['items']>>(
    [
      { label: 'John Doe', value: 'John', description: 'john.doe@gmail.com' },
      { label: 'Peter Jackson', value: 'Peter', description: 'peter.jackson@icloud.me' },
      { label: 'John Smith', value: 'Smith', description: 'john.smith@hotmal.com' },
      { label: 'Alice Johnson', value: 'Alice', description: 'alice.johnson@outlook.com' },
      { label: 'Bob Brown', value: 'Bob', description: 'bob.brown@gmail.com' },
      { label: 'Charlie Davis', value: 'Charlie', description: 'charlie.davis@icloud.com' },
      { label: 'Diana Evans', value: 'Diana', description: 'diana.evans@hotmail.com' },
      { label: 'Eve Foster', value: 'Eve', description: 'eve.foster@yahoo.com' },
      { label: 'Frank Green', value: 'Frank', description: 'frank.green@outlook.com' },
      { label: 'Grace Harris', value: 'Grace', description: 'grace.harris@gmail.com' },
      { label: 'Henry Irving', value: 'Henry', description: 'henry.irving@icloud.com' },
      { label: 'Ivy Johnson', value: 'Ivy', description: 'ivy.johnson@hotmail.com' },
      { label: 'Jack King', value: 'Jack', description: 'jack.king@yahoo.com' },
      { label: 'Karen Lee', value: 'Karen', description: 'karen.lee@outlook.com' },
      {
        label: 'Directors',
        divider: true,
        sticky: true,
        items: [
          { label: 'Denis VVilleneuve', value: 'Denis', description: '+33 1 25 48 45 45' },
          { label: 'Christopher Nolan', value: 'Christopher', description: '+44 2 07 94 60 95' },
          { label: 'Quentin Tarantino', value: 'Quentin', description: '+33 1 05 55 12 34' },
          { label: 'Martin Scorsese', value: 'Martin', description: '+33 1 25 55 56 78' },
          { label: 'Steven Spielberg', value: 'Steven', description: '+33 1 85 55 87 65' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
      {
        label: 'Actors',
        divider: true,
        sticky: true,
        items: [
          { label: 'Leonardo DiCaprio', value: 'Leonardo', description: '+1 310 555 1234' },
          { label: 'Brad Pitt', value: 'Brad', description: '+1 323 555 5678' },
          { label: 'Meryl Streep', value: 'Meryl', description: '+1 212 555 8765' },
          { label: 'Tom Hanks', value: 'Tom', description: '+1 310 555 4321' },
          { label: 'Natalie Portman', value: 'Natalie', description: '+1 818 555 6789' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
    ].map(item => ({ ...item, id: getUUID(), before: avatar })),
  );

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  function randomDescription() {
    const maxLength = Math.floor(Math.random() ** 2 * 100);
    const sliced = lorem.slice(0, maxLength);
    // If we cut in the middle of a word, trim back to the last space
    const lastSpace = sliced.lastIndexOf(' ');
    if (lastSpace < 0) return '';
    if (lastSpace !== sliced.length - 1) return sliced.slice(0, lastSpace);
    return sliced;
  }

  const generated = $state(Array.from({ length: 1000 }).fill(0).map((_, i) => ({
    label: `Virtual item ${i + 1}`,
    // Generate of random description length between 0 and 100 characters
    description: randomDescription(),
    tags: ['virtual', 'list', 'item', 'demo'],
    value: i + 1,
    id: getUUID(),
  })));

  const virtual = $derived(isEmpty ? [] : generated);

  let hovered = $state(false);
  let focused = $state(false);
  const elevation = $state(0);
  const withComplexList = $derived<NonNullable<NeoListProps['items']>>(isEmpty ? [] : complexList);

  const onAdd = () => {
    list.push({ label: `Line item ${list.length + 1}`, value: list.length + 1, id: getUUID() });
    sectionList.push({ label: `Section item ${sectionList.length + 1}`, value: sectionList.length + 1, id: getUUID() });
    customSectionList.push({ label: `Custom Section item ${customSectionList.length + 1}`, value: customSectionList.length + 1, id: getUUID() });
    complexList.push({
      label: `Complex item ${complexList.length + 1}`,
      value: complexList.length + 1,
      description: randomDescription(),
      id: getUUID(),
      before: avatar,
    });
    virtual.push({
      label: `Virtual item ${virtual.length + 1}`,
      description: randomDescription(),
      tags: ['virtual', 'list', 'item', 'demo'],
      value: virtual.length + 1,
      id: getUUID(),
    });
  };

  // remove a random element form the list
  const onRemove = () => {
    if (list.length) list.splice(Math.floor(Math.random() * list.length), 1);
    if (sectionList.length) sectionList.splice(Math.floor(Math.random() * sectionList.length), 1);
    if (customSectionList.length) customSectionList.splice(Math.floor(Math.random() * customSectionList.length), 1);
    if (complexList.length) complexList.splice(Math.floor(Math.random() * complexList.length), 1);
    if (virtual.length) virtual.splice(Math.floor(Math.random() * virtual.length), 1);
  };
</script>

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={isEmpty}>Empty</NeoButton>
    <NeoButton toggle bind:checked={options.shadow}>Shadow</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.scrollToLoader}>Scroll to loader</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.nullable}>Nullable</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton toggle bind:checked={options.reverse}>Reverse</NeoButton>
    <NeoButton toggle bind:checked={options.flip}>Flip</NeoButton>
    <NeoButton toggle bind:checked={options.dim}>Dim</NeoButton>
  </NeoButtonGroup>

  <NeoButtonGroup text rounded>
    <NeoButton onclick={onAdd}>Add</NeoButton>
    <NeoButton onclick={onRemove}>Remove</NeoButton>
  </NeoButtonGroup>
</div>

{#snippet render()}
  <div class="custom-item-card">
    <div>Custom Render Item</div>
    <div>- John Doe</div>
    <div>- john.doe@email.com</div>
    <div>- 123-456-7890</div>
  </div>
{/snippet}

{#snippet renderSection(_children: NeoListRender, _context: NeoListRenderContext)}
  <h2>Custom Section</h2>
  <h3>{_context?.section?.label}</h3>
  <ul>
    {@render _children(_context)}
  </ul>
{/snippet}

{#snippet item({ item: { label, value }, index }: NeoListItemContext)}
  <div class="custom-item-card">
    <div>{label}</div>
    <div>index: {index}</div>
    <div>value: {value}</div>
  </div>
{/snippet}

{#snippet avatar(ctx: NeoListItemContext)}
  <span class="custom-item-avatar">
    <NeoIconAccount size="1.5rem" stroke="2" filled={!!ctx?.checked} />
  </span>
{/snippet}

<section>
  <div class="row">
    <!--  Virtual list  -->
    <div class="column content">
      <span class="label">Simple list</span>
      <NeoSimpleList {...options} items={virtual} />
    </div>

    <div class="column content">
      <span class="label">Virtual list</span>
      <NeoVirtualList items={virtual} buffer="10">
        {#snippet children({ item })}
          <NeoListBaseItem {item} />
        {/snippet}
      </NeoVirtualList>
    </div>
  </div>
</section>

<section>
  <div class="row">
    <!-- custom item with select, before, after & description  & loader  -->
    <div class="column content">
      <span class="label">Sortable Card list</span>
      <NeoCard
        rounded
        scrollbar={false}
        {elevation}
        bind:hovered
        bind:focused
        hover="-2"
        height="20rem"
        width="min(80vw, 20rem)"
        spacing="0.5rem"
        --neo-card-border-radius="2.75rem"
      >
        <NeoList
          aria-label="Sortable list"
          select
          multiple
          {...options}
          items={withComplexList}
          loaderProps={{
            description: true,
            before: true,
            beforeProps: { width: '1.875rem', height: '1.875rem' },
          }}
        >
          {#snippet before(context)}
            <NeoListSearch rounded elevation={hovered || focused ? 2 : elevation} {context} />
          {/snippet}
        </NeoList>
      </NeoCard>
    </div>

    <!--  card -->
    <div class="column content">
      <span class="label">Card List</span>
      <NeoCard rounded elevation="0" scrollbar={false} hover="-2" height="20rem" width="min(80vw, 18rem)" spacing="0.75rem">
        <NeoList aria-label="Card list" select {items} {...options} />
      </NeoCard>
    </div>

    <!--  multi line loader -->
    <div class="column content">
      <span class="label">Multi-line loader</span>
      <NeoList aria-label="Multi loader list" {items} {...options} loaderProps={{ lines: 2, items: 5 }} />
    </div>

    <!--  custom loader -->
    <div class="column content">
      <span class="label">Custom loader</span>
      <NeoList aria-label="Custom loader list" {items} {...options}>
        {#snippet loader()}
          <div class="custom-list-loader">
            <NeoIconCircleLoading size="2rem" />
          </div>
        {/snippet}
      </NeoList>
    </div>

    <!--  custom empty -->
    <div class="column content">
      <span class="label">Custom Empty</span>
      <NeoList aria-label="Custom empty list" {items} {...options}>
        {#snippet empty()}
          <li class="custom-list-loader" in:fade={quickDurationProps}>
            <span> Custom empty snippet</span>
          </li>
        {/snippet}
      </NeoList>
    </div>

    <!--  custom render -->
    <div class="column content">
      <span class="label">Custom Render</span>
      <NeoList aria-label="Custom item render list" items={withCustom} {...options} />
    </div>

    <!--  custom item -->
    <div class="column content">
      <span class="label">Custom snippet</span>
      <NeoList aria-label="Custom item snippet list" items={withCustom} {item} {...options} />
    </div>

    {#snippet values(ctx: NeoListContext)}
      <div class="list-values">
        {#if Array.isArray(ctx.selected)}
          values: {ctx.selected?.map(i => [i.sectionIndex, i?.index].filter(j => j !== undefined).join('-')).join(', ') || 'none selected'}
        {:else}
          values: {ctx.selected?.index || 'none selected'}
        {/if}
      </div>
    {/snippet}

    <!--  select items -->
    <div class="column content">
      <span class="label">Select item</span>
      <NeoList
        aria-label="Select list"
        select
        selected={selected[0]}
        {items}
        {...options}
        onSelect={e => console.info('onSelect - single', e)}
        after={values}
      />
    </div>

    <!--  multi select items -->

    <div class="column content">
      <span class="label">Select multiple</span>
      <NeoList
        aria-label="Multi-select list"
        select
        multiple
        selected={[...selected]}
        {items}
        {...options}
        onSelect={e => console.info('onSelect - multiple', e)}
        after={values}
      />
    </div>

    <!--  section (i.e. sub-lists) -->

    <div class="column content">
      <span class="label">Select section</span>
      <NeoList
        aria-label="Section list"
        select
        multiple
        items={withSection}
        {...options}
        onSelect={e => console.info('onSelect - sections', e)}
        after={values}
      />
    </div>

    <!--  custom section -->
    <div class="column content">
      <span class="label">Custom section</span>
      <NeoList items={withCustomSection} {...options} {item}>
        {#snippet section(_children, _context)}
          <h2>{_context?.section?.label}</h2>
          <ul>
            {@render _children(_context)}
          </ul>
        {/snippet}
      </NeoList>
    </div>

    <!--  tooltip item (nested menu drawer, portal ?) -->
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

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
    border: var(--neo-border-width) solid var(--neo-border-color);
    border-radius: 0.5rem;
    padding-inline: 0.5rem;
    margin-block: 0.25rem;
  }

  .custom-item-avatar {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem;
    border: 2px currentcolor solid;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
  }

  .list-values {
    display: -webkit-box;
    padding-block: 0.25rem;
    overflow: hidden;
    color: var(--neo-text-color-secondary);
    font-size: var(--neo-font-size-sm);
    line-height: var(--neo-line-height-sm);
    text-overflow: ellipsis;
    word-break: auto-phrase;
    overflow-wrap: anywhere;
    padding-inline: 1.125rem;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .column {
    @include flex.column($gap: var(--neo-gap-lg), $flex: 0 1 20%);

    &.content {
      align-items: center;
      width: min(80vw, 18rem);
      height: min(80vh, 24rem);

      :global(.neo-list) {
        max-width: 18.875rem;
        max-height: calc(min(80vh, 24rem) - var(--neo-gap-lg) - 2rem);
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    min-width: 80vw;
    margin: 2rem 0;
  }

  @media (width < 1550px) {
    .column {
      flex: 0 1 30%;
    }
  }

  @media (width < 600px) {
    .column {
      flex: 0 1 80%;
    }
  }
</style>
