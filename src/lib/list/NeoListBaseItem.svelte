<script lang="ts">
  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconArrow from '~/icons/IconArrow.svelte';
  import IconCheckbox from '~/icons/IconCheckbox.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import NeoMark from '~/text/NeoMark.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    before,
    after,

    // Context
    item,
    index,
    context,

    // List State
    select,
    checked,
    touched = $bindable(false),
    disabled: _disabled,
    readonly: _readonly,
    skeleton = false,
    highlight,
    selector = '.neo-list-item.neo-list-item-select',
    arrow,
    toggle,
    rounded,

    // Buttons Props
    hovered = $bindable(false),
    focused = $bindable(false),

    // Actions
    onclick,

    // Other props
    buttonProps,
    ...rest
  }: NeoListBaseItemProps = $props();
  /* eslint-enable prefer-const */

  $effect(() => {
    if (touched || !checked) return;
    touched = true;
  });

  const getNextTarget = (element: EventTarget | HTMLElement | null, action: 'next' | 'previous') => {
    const sibling: keyof HTMLElement = `${action}ElementSibling`;
    if (!(element instanceof HTMLElement)) return;
    let li = element?.closest<HTMLElement>(selector);
    let next = li?.[sibling];
    let target = getFocusableElement(next);
    if (target) return target.focus();
    while (next?.[sibling]) {
      if (target) return target.focus();
      next = next?.[sibling];
      target = getFocusableElement(next);
    }
    if (!li?.parentElement || li?.dataset?.section === undefined) return;
    li = li.parentElement.closest<HTMLElement>(selector);
    return getFocusableElement(li?.[sibling])?.focus();
  };

  const button = $derived(item?.href || item?.onclick || onclick || select);
  const labelId = $derived(button ? `neo-list-item-label-${getUUID()}` : undefined);
  const disabled = $derived(_disabled || item?.disabled);
  const readonly = $derived(_readonly || item?.readonly);
</script>

{#snippet listItem({ label, value, description }: NeoListItem)}
  <div class:neo-list-item-content={true} class:neo-button={button} class:neo-disabled={disabled} class:neo-description={description}>
    {#if item.before ?? before}
      <div class="neo-list-item-before" class:neo-skeleton={skeleton}>
        {@render (item.before ?? before)?.({ item, index, checked, context })}
      </div>
    {/if}

    <NeoSkeletonText
      loading={skeleton}
      lines="auto"
      fallback={description ? 2 : 1}
      align="center"
      {...rest}
      class={['neo-list-item-skeleton', rest?.class]}
    >
      <div class="neo-list-item-text">
        <span id={labelId} class="neo-list-item-label">
          <NeoMark value={label ?? value?.toString()} filter={highlight} />
        </span>
        {#if description}
          <span class="neo-list-item-description">
            <NeoMark value={description} filter={highlight} />
          </span>
        {/if}
      </div>
    </NeoSkeletonText>

    {#if item.after ?? after}
      <div class="neo-list-item-after" class:neo-skeleton={skeleton}>
        {@render (item.after ?? after)?.({ item, index, checked, context })}
      </div>
    {/if}
  </div>
{/snippet}

{#if item?.render}
  {@render item?.render({ item, index, checked, context })}
{:else if button}
  <NeoButton
    bind:hovered
    bind:focused
    data-select={checked}
    aria-labelledby={labelId}
    container
    elevation="0"
    hover="-1"
    active="-2"
    checked={toggle || buttonProps?.toggle ? checked : undefined}
    scale={0.99}
    {readonly}
    {disabled}
    {rounded}
    href={item?.href}
    onclick={e => {
      if (disabled) return;
      item?.onclick?.(e);
      if (readonly) return;
      touched = true;
      onclick?.(e);
    }}
    onkeydown={e => {
      if (disabled) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        getNextTarget(e.target, e.key === 'ArrowDown' ? 'next' : 'previous');
        e.preventDefault();
      }
      buttonProps?.onkeydown?.(e);
    }}
    {...buttonProps}
    {...item?.buttonProps}
    class={['neo-list-item-button', buttonProps?.class, item?.buttonProps?.class]}
  >
    {@render listItem(item)}

    {#if select}
      <div class="neo-list-item-checkmark" class:neo-skeleton={skeleton}>
        <IconCheckbox {checked} enter={touched} />
      </div>
    {:else if arrow}
      <div class="neo-list-item-arrow" class:neo-skeleton={skeleton}>
        <IconArrow expanded={checked && !disabled && !readonly} chevron />
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
      @include mixin.ellipsis;
    }

    &-label {
      line-height: var(--neo-line-height-sm, 1.25rem);
    }

    &-description {
      --neo-ellipsis-lines: 2;

      color: var(--neo-text-color-secondary);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-sm, 1.25rem);
      transition: color 0.15s ease;
    }

    &-content {
      display: inline-flex;
      flex: 1 1 auto;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      padding: 0.125rem 0.5rem;
      transition: color 0.15s ease;

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
      }

      &.neo-button {
        padding: 0.375rem 0.625rem;
      }

      &:hover:not(.neo-disabled, .neo-button) {
        color: var(--neo-text-color-highlight);
      }

      :global(.neo-list-item-skeleton .neo-skeleton-text-line) {
        --neo-skeleton-text-line-height: var(--neo-line-height-sm, 1.25rem);
      }

      &.neo-description {
        gap: var(--neo-gap-xs, 0.625rem);

        :global(.neo-list-item-skeleton .neo-skeleton-text-line:nth-child(2n)) {
          --neo-skeleton-text-font-size: var(--neo-font-size-sm, 0.875rem);
          --neo-skeleton-text-line-height: var(--neo-line-height-sm, 1.25rem);
        }
      }
    }

    &-checkmark,
    &-arrow {
      aspect-ratio: 1 / 1;
    }

    &-arrow {
      --neo-arrow-offset-start: 50%;
      --neo-arrow-offset-end: 40%;
      --neo-arrow-delay: 0s;
    }

    &-checkmark {
      margin-inline-end: 0.4375rem;
    }

    &-before,
    &-after,
    &-arrow,
    &-checkmark {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      min-width: 1.25rem;
      min-height: 1.25rem;
      text-align: center;
      border-radius: 50%;
      transition: background-color 0.3s ease-out;

      :global(> *) {
        opacity: 1;
        transition: opacity 0.15s ease-out 0.15s;
      }

      &.neo-skeleton {
        @include mixin.skeleton($content: false);

        :global(> *) {
          opacity: 0;
          transition-delay: 0s;
        }
      }
    }
  }
</style>
