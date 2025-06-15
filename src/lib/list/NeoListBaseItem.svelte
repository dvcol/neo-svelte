<script lang="ts">
  import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import { getFocusableElement, getLastFocusableElement } from '@dvcol/common-utils/common/element';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { NeoIconArrowDirection } from '~/icons/index.js';
  import NeoIconArrow from '~/icons/NeoIconArrow.svelte';
  import NeoIconCheckbox from '~/icons/NeoIconCheckbox.svelte';
  import { isButtonTag } from '~/list/neo-list.model.js';
  import NeoMedia from '~/media/NeoMedia.svelte';
  import NeoPill from '~/pill/NeoPill.svelte';
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
    tag = 'div',
    buttonRef = $bindable(),
    select,
    checked,
    touched = $bindable(false),
    disabled: _disabled,
    readonly: _readonly,
    highlight,
    selector = '.neo-list-item.neo-list-item-select',
    flip,
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
    mediaProps,
    markProps,
    ...rest
  }: NeoListBaseItemProps = $props();

  $effect(() => {
    if (touched || !checked) return;
    touched = true;
  });

  const getFocusable = (action: 'next' | 'previous', ...args: Parameters<typeof getFocusableElement>) => {
    if (action === 'previous') return getLastFocusableElement(...args);
    return getFocusableElement(...args);
  };

  const getNextTarget = (element: EventTarget | HTMLElement | null, action: 'next' | 'previous') => {
    const sibling: keyof HTMLElement = `${action}ElementSibling`;
    if (!(element instanceof HTMLElement)) return;
    let li = element?.closest<HTMLElement>(selector);
    let next = li?.[sibling];
    let target = getFocusable(action, next);
    if (target) return target.focus();
    while (next?.[sibling]) {
      if (target) return target.focus();
      next = next?.[sibling];
      target = getFocusable(action, next);
    }
    if (!li?.parentElement || li?.dataset?.section === undefined) return;
    li = li.parentElement.closest<HTMLElement>(selector);
    return getFocusable(action, li?.[sibling])?.focus();
  };

  const lines = $derived.by(() => {
    const _lines = {
      label: typeof ellipsis === 'number' ? ellipsis : ellipsis?.label,
      description: typeof ellipsis === 'number' ? ellipsis : ellipsis?.description,
    };
    return {
      ..._lines,
      total: ((_lines?.label ?? 0) + (_lines?.description ?? 0)),
    };
  });

  const button = $derived(item?.href || item?.onclick || onclick || select);
  const labelId = $derived(button ? `neo-list-item-label-${getUUID()}` : undefined);
  const disabled = $derived(_disabled || item?.disabled);
  const readonly = $derived(_readonly || item?.readonly);
</script>

{#snippet beforeItem()}
  {#if item.before ?? before}
    <div class="neo-list-item-before">
      {@render (item.before ?? before)?.({ item, index, checked, context })}
    </div>
  {/if}
{/snippet}

{#snippet afterItem()}
  {#if item.after ?? after}
    <div class="neo-list-item-after">
      {@render (item.after ?? after)?.({ item, index, checked, context })}
    </div>
  {/if}
{/snippet}

{#snippet listItem({ label, value, description, tags }: NeoListItem)}
  <svelte:element
    this={tag}
    class:neo-list-item-content={true}
    class:neo-button={button}
    class:neo-rounded={rounded}
    class:neo-disabled={disabled}
    class:neo-description={description}
    class:neo-reverse={reverse || item.reverse}
    style:--neo-list-item-label-lines={lines?.label}
    style:--neo-list-item-description-lines={lines?.description}
    {...rest}
  >

    {#if !reverse}
      {@render beforeItem()}
    {:else}
      {@render afterItem()}
    {/if}

    {#if item.media}
      {@const { image, ...media } = item.media}
      <NeoMedia class="neo-list-item-media" elevation={(hovered || focused) ? 2 : 1} {rounded} {...mediaProps} {...media} image={{ ...mediaProps?.image, ...image }} />
    {/if}

    <div class="neo-list-item-text">
      <span id={labelId} class="neo-list-item-label" class:neo-header={(tags?.length && description) || ((lines?.description ?? 0) > 3)}>
        <NeoMark {...markProps} value={label ?? value?.toString()} filter={highlight} />
      </span>
      {#if tags?.length}
        <div class="neo-list-item-tags">
          {#each tags as tag}
            {#if typeof tag === 'string'}
              <span class="neo-list-item-tag">{tag}</span>
            {:else if isButtonTag(tag)}
              <NeoButton
                elevation={0}
                text
                {rounded}
                {disabled}
                propagation={false}
                {...tag}
                class={['neo-list-item-tag', tag?.class]}
                onkeydown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    if (e.key === 'ArrowDown') getNextTarget(e.target, 'next');
                    else buttonRef?.focus();
                    e.preventDefault();
                  }
                  tag?.onkeydown?.(e);
                }}
              />
            {:else}
              <NeoPill
                elevation={0}
                text
                {rounded}
                {disabled}
                {...tag}
                class={['neo-list-item-tag', tag?.class]}
              />
            {/if}
          {/each}
        </div>
      {/if}
      {#if description}
        <span class="neo-list-item-description">
          <NeoMark {...markProps} value={description} filter={highlight} />
        </span>
      {/if}
    </div>

    {#if !reverse}
      {@render afterItem()}
    {:else}
      {@render beforeItem()}
    {/if}
  </svelte:element>
{/snippet}

{#snippet affix()}
  {#if select}
    <div class="neo-list-item-checkmark" class:neo-reverse={reverse}>
      <NeoIconCheckbox {checked} enter={touched} />
    </div>
  {:else if arrow}
    <div class="neo-list-item-arrow">
      <NeoIconArrow expanded={checked && !disabled && !readonly} chevron direction={reverse ? NeoIconArrowDirection.Left : NeoIconArrowDirection.Right} />
    </div>
  {/if}
{/snippet}

{#if item?.render}
  {@render item?.render({ item, index, checked, context })}
{:else if button}
  <NeoButton
    bind:ref={buttonRef}
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
        let action: 'next' | 'previous' = e.key === 'ArrowDown' ? 'next' : 'previous';
        if (flip) action = action === 'next' ? 'previous' : 'next';
        getNextTarget(e.target, action);
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
      flex: 1 1 auto;
      flex-direction: column;

      &:has(> .neo-list-item-label.neo-header) {
        gap: var(--neo-list-item-text-gap, var(--neo-gap-5xs, 0.125rem));
      }
    }

    &-tags {
      --neo-btn-padding: var(--neo-gap-5xs, 0.125rem) var(--neo-gap-3xs, 0.3125rem);
      --neo-btn-margin: 0;
      --neo-pill-padding: var(--neo-gap-5xs, 0.125rem) var(--neo-gap-3xs, 0.3125rem);
      --neo-pill-margin: 0;

      display: inline-flex;
      flex-wrap: wrap;
      gap: 0 var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      color: var(--neo-text-color-secondary);
      font-weight: var(--neo-font-weight-sm, 300);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-sm, 1.25rem);
      transition: color 0.15s ease;

      :global(.neo-list-item-tag.neo-pill.neo-borderless.neo-flat) {
        --neo-pill-margin: 0 calc(0% - var(--neo-gap-3xs, 0.312 ));
      }

      :global(.neo-list-item-tag.neo-button.neo-borderless.neo-flat) {
        --neo-btn-margin: 0 calc(0% - var(--neo-gap-3xs, 0.3125rem ));
      }

      :global(.neo-list-item-tag.neo-pill.neo-borderless.neo-flat:first-child) {
        margin-inline-start: calc(-0.0625rem - var(--neo-gap-3xs, 0.3125rem ));

      }

      :global(.neo-list-item-tag.neo-button.neo-borderless.neo-flat:first-child) {
        margin-inline-start: calc(-0.0625rem - var(--neo-gap-3xs, 0.3125rem ));
      }
    }

    &-content {
      display: inline-flex;
      flex: 1 1 auto;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      padding: var(--neo-gap-5xs, 0.125rem) var(--neo-gap-xxs, 0.5rem);
      transition: color 0.15s ease, gap 0.3s ease;

      :global(> .neo-list-item-media) {
        --neo-media-margin: var(--neo-list-item-media-margin, var(--neo-gap-4xs));
        --neo-media-padding:var(--neo-list-item-media-padding, var(--neo-gap-4xs));
        --neo-media-flex: var(--neo-list-item-media-flex, 0 0 30%);
      }

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

        .neo-list-item-tags {
          justify-content: flex-end;
          text-align: end;
        }
      }

      &:hover:not(.neo-disabled, .neo-button) {
        color: var(--neo-text-color-highlight);
      }

      &.neo-description {
        gap: var(--neo-gap-xs, 0.625rem);
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
