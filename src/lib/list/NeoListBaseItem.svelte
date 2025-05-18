<script lang="ts">
  import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { NeoIconArrowDirection } from '~/icons/index.js';
  import NeoIconArrow from '~/icons/NeoIconArrow.svelte';
  import NeoIconCheckbox from '~/icons/NeoIconCheckbox.svelte';
  import { NeoBaseListItemMediaType } from '~/list/neo-list.model.js';
  import NeoImage from '~/media/NeoImage.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import NeoMark from '~/text/NeoMark.svelte';

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
    skeleton,
    highlight,
    selector = '.neo-list-item.neo-list-item-select',
    arrow,
    toggle,
    rounded,
    reverse,
    ellipsis,

    // Buttons Props
    hovered = $bindable(false),
    focused = $bindable(false),
    glass,
    tinted,
    filled,

    // Actions
    onclick,

    // Other props
    buttonProps,
    imageProps,
    ...rest
  }: NeoListBaseItemProps = $props();

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

  const lines = $derived({
    label: typeof ellipsis === 'number' ? ellipsis : ellipsis?.label,
    description: typeof ellipsis === 'number' ? ellipsis : ellipsis?.description,
  });

  const button = $derived(item?.href || item?.onclick || onclick || select);
  const labelId = $derived(button ? `neo-list-item-label-${getUUID()}` : undefined);
  const disabled = $derived(_disabled || item?.disabled);
  const readonly = $derived(_readonly || item?.readonly);
</script>

{#snippet beforeItem()}
  {#if item.before ?? before}
    <div class="neo-list-item-before" class:neo-skeleton={skeleton}>
      {@render (item.before ?? before)?.({ item, index, checked, context })}
    </div>
  {/if}
{/snippet}

{#snippet afterItem()}
  {#if item.after ?? after}
    <div class="neo-list-item-after" class:neo-skeleton={skeleton}>
      {@render (item.after ?? after)?.({ item, index, checked, context })}
    </div>
  {/if}
{/snippet}

{#snippet listItem({ label, value, description }: NeoListItem)}
  <div
    class:neo-list-item-content={true}
    class:neo-button={button}
    class:neo-rounded={rounded}
    class:neo-disabled={disabled}
    class:neo-description={description}
    class:neo-reverse={reverse || item.reverse}
    style:--neo-list-item-label-lines={lines?.label}
    style:--neo-list-item-description-lines={lines?.description}
  >

    {#if !reverse}
      {@render beforeItem()}
    {:else}
      {@render afterItem()}
    {/if}

    {#if item.media}
      {@const { type, ...media } = item.media}
      <div class="neo-list-item-media">
        {#if type === NeoBaseListItemMediaType.Imgage}
          <NeoImage {...imageProps} {...media} />
        {/if}
      </div>
    {/if}

    <NeoSkeletonText
      loading={!!skeleton}
      disabled={skeleton === undefined}
      lines="auto"
      fallback={description ? 2 : 1}
      align="center"
      {reverse}
      {...rest}
      class={['neo-list-item-skeleton', rest?.class]}
    >
      <div class="neo-list-item-text">
        <span id={labelId} class="neo-list-item-label" class:neo-header={(lines?.description ?? 0) > 3}>
          <NeoMark value={label ?? value?.toString()} filter={highlight} />
        </span>
        {#if description}
          <span class="neo-list-item-description">
            <NeoMark value={description} filter={highlight} />
          </span>
        {/if}
      </div>
    </NeoSkeletonText>

    {#if !reverse}
      {@render afterItem()}
    {:else}
      {@render beforeItem()}
    {/if}
  </div>
{/snippet}

{#snippet affix()}
  {#if select}
    <div class="neo-list-item-checkmark" class:neo-skeleton={skeleton} class:neo-reverse={reverse}>
      <NeoIconCheckbox {checked} enter={touched} />
    </div>
  {:else if arrow}
    <div class="neo-list-item-arrow" class:neo-skeleton={skeleton}>
      <NeoIconArrow expanded={checked && !disabled && !readonly} chevron direction={reverse ? NeoIconArrowDirection.Left : NeoIconArrowDirection.Right} />
    </div>
  {/if}
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
    {glass}
    {tinted}
    {filled}
    href={item?.href}
    onclick={(e) => {
      if (disabled) return;
      item?.onclick?.(e);
      if (readonly) return;
      touched = true;
      onclick?.(e);
    }}
    onkeydown={(e) => {
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
    {#if reverse}
      {@render affix()}
    {/if}

    {@render listItem(item)}

    {#if !reverse}
      {@render affix()}
    {/if}
  </NeoButton>
{:else}
  {@render listItem(item)}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list-item {
    &-label {
      @include mixin.ellipsis($line: var(--neo-list-item-label-lines, 1));

      line-height: var(--neo-line-height-sm, 1.25rem);

      &.neo-header {
        font-weight: var(--neo-font-weight-md, 500);
      }
    }

    &-description {
      @include mixin.ellipsis($line: var(--neo-list-item-description-lines, 2));

      color: var(--neo-text-color-secondary);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-sm, 1.25rem);
      transition: color 0.15s ease;
    }

    &-text {
      display: flex;
      flex-direction: column;

      &:has(> .neo-list-item-label.neo-header) {
        gap: var(--neo-gap-tiny);
      }
    }

    &-media {
      flex: var(--neo-list-item-media-flex, 0 1 40%);
      margin: var(--neo-list-item-media-margin, var(--neo-gap-tiny));
    }

    &-content {
      display: inline-flex;
      flex: 1 1 auto;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      padding: 0.125rem 0.5rem;
      transition: color 0.15s ease, gap 0.3s ease;

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
      }

      &.neo-button {
        padding: var(--neo-list-item-button-padding, 0.4375rem 0.625rem);

        &.neo-rounded {
          padding: var(--neo-list-item-button-padding, 0.5rem 0.75rem);
        }
      }

      &.neo-reverse {
        justify-content: flex-end;
        text-align: end;
      }

      &:hover:not(.neo-disabled, .neo-button) {
        color: var(--neo-text-color-highlight);
      }

      :global(.neo-list-item-skeleton .neo-skeleton-text-line) {
        --neo-skeleton-text-line-height: var(--neo-line-height-sm, 1.25rem);
      }

      &.neo-description {
        gap: var(--neo-gap-xs, 0.625rem);

        :global(.neo-list-item-skeleton .neo-skeleton-text-line:nth-child(n + 2)) {
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

    &-checkmark {
      &:not(.neo-reverse) {
        margin-inline-end: 0.4375rem;
      }

      &.neo-reverse {
        margin-inline-start: 0.4375rem;
      }
    }
  }
</style>
