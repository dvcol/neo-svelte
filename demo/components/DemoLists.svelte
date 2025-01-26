<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoListItem, NeoListProps } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoList from '~/list/NeoList.svelte';
  import { Colors } from '~/utils/colors.utils';
  import { enterTransitionProps } from '~/utils/transition.utils';

  const options = $state<NeoListProps>({
    loading: false,
    skeleton: false,
    shadow: true,
  });

  const list: NeoListItem[] = $state([
    { value: 'Line item label 1', id: crypto.randomUUID() },
    { value: 'Line item with longer label 2', id: crypto.randomUUID() },
    { value: 'Line item error', color: Colors.Error, id: crypto.randomUUID() },
    { value: 'Line item warning', color: Colors.Warning, id: crypto.randomUUID() },
    { value: 'Line item success', color: Colors.Success, id: crypto.randomUUID() },
    { value: 'Line item primary', color: Colors.Primary, id: crypto.randomUUID() },
    { value: 'Line item secondary', color: Colors.Secondary, id: crypto.randomUUID() },
  ]);

  let isEmpty = $state(false);
  const items = $derived(isEmpty ? [] : list);

  const onAdd = () => {
    list.push({ value: `Line item ${list.length + 1}`, id: crypto.randomUUID() });
  };

  const onRemove = () => {
    // remove a random element form the list
    list.splice(Math.floor(Math.random() * list.length), 1);
  };
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={isEmpty}>Empty</NeoButton>
    <NeoButton toggle bind:checked={options.shadow}>Shadow</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton onclick={onAdd}>Add</NeoButton>
    <NeoButton onclick={onRemove}>Remove</NeoButton>
  </NeoButtonGroup>
</div>

<div class="row">
  <div class="column content">
    <span class="label">Card List</span>
    <NeoCard rounded elevation="0" hover="-2" flex="1 0 100%" width="min(80vw, 18rem)">
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

  <div class="column content">
    <span class="label">Custom Empty</span>
    <NeoList {items} {...options}>
      {#snippet empty()}
        <div class="custom-list-loader" in:fade={enterTransitionProps}>
          <span> Custom empty snippet</span>
        </div>
      {/snippet}
    </NeoList>
  </div>

  <!--  custom item-->

  <!--  custom empty-->

  <!--  buttons item -->

  <!--  tooltip item (menu drawer) -->

  <!--  select items -->

  <!--  multi select items -->

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
    padding: 0.5rem;
  }

  .column {
    @include flex.column($gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      width: min(80vw, 18rem);
      min-width: fit-content;
      height: min(80vh, 20rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    min-width: 80vw;
    margin: 2rem 0;
  }
</style>
