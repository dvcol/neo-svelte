<script lang="ts">
  import NeoSkeletonText from '../skeletons/NeoSkeletonText.svelte';

  import type { NeoListBaseItemModel } from '~/list/neo-list-base-item.model.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  import IconCheckbox from '~/icons/IconCheckbox.svelte';

  const {
    // Context
    item,
    index,
    context,

    // List State
    select,
    checked,
    touched,
    disabled,
    skeleton,

    // Actions
    toggleItem,
  }: NeoListBaseItemModel = $props();
</script>

{#snippet listItem({ label, value }: NeoListItem)}
  <NeoSkeletonText class="neo-list-item-skeleton" loading={skeleton} lines={1} align="center">
    <div class="neo-list-item-content" class:neo-disabled={disabled}>{label ?? value}</div>
  </NeoSkeletonText>
{/snippet}

{#if item?.render}
  {@render item?.render(item, index, context)}
{:else if item?.href || item?.onclick || select}
  <NeoButton
    ghost
    shallow
    href={item?.href}
    onclick={e => {
      toggleItem(index);
      item?.onclick?.(e);
    }}
    {disabled}
    {...item?.buttonProps}
    class={['neo-list-item-button', item?.buttonProps?.class]}
  >
    {@render listItem(item)}

    {#if select}
      <span class="neo-list-item-checkmark">
        <IconCheckbox {checked} enter={touched} />
      </span>
    {/if}
  </NeoButton>
{:else}
  {@render listItem(item)}
{/if}

<style lang="scss">
  .neo-list-item {
    &-content {
      padding: 0.125rem 0.5rem;
      transition: color 0.3s ease;

      &:hover:not(.neo-disabled) {
        color: var(--neo-text-color-highlight);
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        cursor: not-allowed;
      }
    }

    &-checkmark {
      padding: 0.125rem 0.5rem 0.125rem 0;
    }
  }
</style>
