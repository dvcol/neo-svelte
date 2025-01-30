<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.props.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  import IconCheckbox from '~/icons/IconCheckbox.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Context
    item,
    index,
    context,

    // List State
    select,
    checked,
    touched = $bindable(false),
    disabled,
    readonly,
    skeleton,

    // Actions
    onclick,

    // Other props
    skeletonProps,
    ...rest
  }: NeoListBaseItemProps = $props();
  /* eslint-enable prefer-const */

  $effect(() => {
    if (touched || !checked) return;
    touched = true;
  });

  const labelId = $derived(select ? `neo-list-item-label-${getUUID()}` : undefined);
</script>

{#snippet listItem({ label, value }: NeoListItem)}
  <NeoSkeletonText loading={skeleton} lines={1} align="center" {...skeletonProps} class={['neo-list-item-skeleton', skeletonProps?.class]}>
    <div id={labelId} class:neo-list-item-content={true} class:neo-disabled={disabled} {...rest}>{label ?? value}</div>
  </NeoSkeletonText>
{/snippet}

{#if item?.render}
  {@render item?.render({ item, index, context })}
{:else if item?.href || item?.onclick || select}
  <NeoButton
    aria-selected={checked}
    aria-labelledby={labelId}
    ghost
    shallow
    {readonly}
    href={item?.href}
    onclick={e => {
      if (readonly || disabled) return;
      touched = true;
      onclick?.(e);
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
      }
    }

    &-checkmark {
      padding: 0.125rem 0.5rem 0.125rem 0;
    }
  }
</style>
