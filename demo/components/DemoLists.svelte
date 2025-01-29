<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import type { NeoListItem, NeoListProps } from '~/list/neo-list.model.js';

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
    shadow: false,
    scrollToLoader: false,
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
      },
      { label: 'Line item error', value: 2, color: Colors.Error },
      { label: 'Line item warning', value: 3, color: Colors.Warning },
      { label: 'Line item success', value: 4, color: Colors.Success },
      { label: 'Line item primary', value: 5, color: Colors.Primary },
      { label: 'Line item secondary', value: 6, color: Colors.Secondary },
    ].map(item => ({ ...item, id: item?.id ?? getUUID() })),
  );

  let isEmpty = $state(false);
  const items = $derived(isEmpty ? [] : list.filter(item => item.id !== custom.id));

  const withCustom = $derived(isEmpty ? [] : list);

  const onAdd = () => list.push({ label: `Line item ${list.length + 1}`, value: list.length + 1, id: getUUID() });

  // remove a random element form the list
  const onRemove = () => list.splice(Math.floor(Math.random() * list.length), 1);
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={isEmpty}>Empty</NeoButton>
    <NeoButton toggle bind:checked={options.shadow}>Shadow</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.scrollToLoader}>Scroll to loader</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton onclick={onAdd}>Add</NeoButton>
    <NeoButton onclick={onRemove}>Remove</NeoButton>
  </NeoButtonGroup>
</div>

{#snippet render(item, __, { skeleton })}
  <NeoSkeletonText class="custom-item-skeleton" loading={skeleton} lines={4} align="center">
    <div class="custom-item-card">
      <div>{item.value}</div>
      <div>- John Doe</div>
      <div>- john.doe@email.com</div>
      <div>- 123-456-7890</div>
    </div>
  </NeoSkeletonText>
{/snippet}

{#snippet item({ label, value }, index, { skeleton })}
  <NeoSkeletonText class="custom-item-skeleton" loading={skeleton} lines={3} align="center">
    <div class="custom-item-card">
      <div>{label}</div>
      <div>index: {index}</div>
      <div>value: {value}</div>
    </div>
  </NeoSkeletonText>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Card List</span>
    <NeoCard rounded elevation="0" hover="-2" height="100%" width="min(80vw, 18rem)">
      <NeoList {items} {...options} />
    </NeoCard>
  </div>

  <div class="column content">
    <span class="label">Multi-line loader</span>
    <NeoList {items} {...options} loading={options.loading ? 10 : false} />
  </div>

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
    <NeoList {items} {item} {...options} />
  </div>

  {#snippet values({ selected })}
    <div class="list-values">
      {#if Array.isArray(selected)}
        Values: {selected?.map(i => i.value).join(', ') ?? 'no values'}
      {:else}
        Value: {selected?.value ?? 'no value'}
      {/if}
    </div>
  {/snippet}

  <!--  select items -->
  <div class="column content">
    <span class="label">Select item</span>
    <NeoList select {items} {...options} onselect={e => console.info('onSelect - single', e)} after={values} />
  </div>

  <!--  multi select items -->

  <div class="column content">
    <span class="label">Select multiple</span>
    <NeoList select multiple {items} {...options} onselect={e => console.info('onSelect - multiple', e)} after={values} />
  </div>

  <!--  section (i.e. sublists) -->

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
    @include flex.column($gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      width: min(80vw, 18rem);
      min-width: fit-content;
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
