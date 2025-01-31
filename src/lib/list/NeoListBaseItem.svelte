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

{#snippet listItem({ label, value, description }: NeoListItem)}
  <NeoSkeletonText
    loading={skeleton}
    lines={description ? 2 : 1}
    align="center"
    {...skeletonProps}
    class={['neo-list-item-skeleton', skeletonProps?.class]}
  >
    <div class:neo-list-item-content={true} class:neo-disabled={disabled} {...rest}>
      <span id={labelId} class="neo-list-item-label">{label ?? value}</span>
      {#if description}
        <span class="neo-list-item-description">{description}</span>
      {/if}
    </div>
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
    {disabled}
    href={item?.href}
    onclick={e => {
      if (disabled) return;
      item?.onclick?.(e);
      if (readonly || !select) return;
      touched = true;
      onclick?.(e);
    }}
    {...item?.buttonProps}
    class={['neo-list-item-button', item?.buttonProps?.class]}
  >
    {@render listItem(item)}

    {#if select}
      <div class="neo-list-item-checkmark" class:neo-skeleton={skeleton}>
        <IconCheckbox {checked} enter={touched} />
      </div>
    {/if}
  </NeoButton>
{:else}
  {@render listItem(item)}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list-item {
    &-label,
    &-description {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-word;
    }

    &-label {
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    &-description {
      margin-bottom: 0.3125rem;
      color: var(--neo-text-color-secondary);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-xs, 1rem);
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }

    &-content {
      padding: 0.125rem 0.5rem;
      transition: color 0.15s ease;

      &:hover:not(.neo-disabled) {
        color: var(--neo-text-color-highlight);
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
      }
    }

    &-checkmark {
      display: inline-flex;
      flex: 0 0 1.25rem;
      align-items: center;
      justify-content: center;
      height: 1.25rem;
      text-align: center;
      border-radius: 50%;
      transition: background-color 0.3s ease-out;
      margin-inline-end: 0.4375rem;
      margin-block-end: 0.125rem;

      :global(svg) {
        opacity: 1;
        transition: opacity 0.15s ease-out 0.15s;
      }

      &.neo-skeleton {
        @include mixin.skeleton($content: false);

        :global(svg) {
          opacity: 0;
          transition-delay: 0s;
        }
      }
    }
  }
</style>
