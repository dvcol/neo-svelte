<script lang="ts">
  import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
  import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { tick } from 'svelte';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoMenuListItem from '~/floating/menu/NeoMenuListItem.svelte';
  import { showDivider } from '~/list/neo-list.model.js';

  let {
    ref = $bindable(),

    // Item Props
    tag = 'ul',
    item: parent,
    items = [],
    level = 1,

    keepOpenOnSelect,

    // Styles
    shadow,
    scrollbar,
    rounded,
    reverse,
    flip,

    // Events
    onMenu,
    onSelect,

    // Other Props
    tooltipProps,
    baseProps,
    itemProps,
    dividerProps,
    ...rest
  }: NeoMenuListProps = $props();

  const scrollReverse = async () => {
    await tick();
    if (!ref) return;
    ref.scrollTo({ top: ref.scrollHeight, behavior: 'instant' });
  };

  $effect(() => {
    if (!flip || !ref) return;
    scrollReverse();
  });
</script>

{#snippet line(item: NeoMenuItem, index = 0, length = 0)}
  <NeoMenuListItem
    {keepOpenOnSelect}
    {rounded}
    {reverse}
    {...itemProps}
    {parent}
    {item}
    {index}
    {length}
    {level}
    {tooltipProps}
    {baseProps}
    menuProps={{ tag, shadow, scrollbar, rounded, reverse, flip, dividerProps, tooltipProps, baseProps, ...rest, ...item.menuProps }}
    onMenu={(i, e) => {
      item.menuProps?.onMenu?.(i, e);
      onMenu?.(i, e);
    }}
    onSelect={(i, e) => {
      item.menuProps?.onSelect?.(i, e);
      onSelect?.(i, e);
    }}
  />
{/snippet}

{#snippet list(array: NeoMenuItem[])}
  {#each array as item, index (item.id ?? index)}
    {#if index && showDivider(item.divider, 'top')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
    {#if item.section}
      {@const labelId = item.label ? `neo-menu-section-label-${getUUID()}` : undefined}
      {#if labelId}
        <span id={labelId} class="neo-menu-list-section-label" class:neo-sticky={item.sticky} class:neo-reverse={reverse || item.reverse}>
          {item.label}
        </span>
      {/if}
      <svelte:element this={tag} role="menu">
        {#if item.items}
          {@render list(item.items)}
        {/if}
      </svelte:element>
    {:else}
      {@render line(item, index, array.length)}
    {/if}
    {#if index < array.length - 1 && showDivider(item.divider, 'bottom') && !showDivider(array[index + 1]?.divider, 'bottom')}
      <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
    {/if}
  {/each}
{/snippet}

<svelte:element
  this={tag}
  role="menu"
  bind:this={ref}
  class:neo-menu-list={true}
  class:neo-scroll={scrollbar}
  class:neo-shadow={shadow}
  class:neo-rounded={rounded}
  class:neo-flip={flip}
  {...rest}
>
  {@render list(items)}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-menu-list {
    display: flex;
    flex-direction: column;
    padding: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem)) 0;
    overflow: auto;

    :global(.neo-menu-item-divider) {
      margin: var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem)) 0;
    }

    &-section {
      &-label {
        display: inline-flex;
        padding: 0.25rem 0.6125rem;
        transition: color 0.3s ease;
        margin-block-end: 0.125rem;

        &.neo-sticky {
          position: sticky;
          top: -0.5rem;
          z-index: var(--neo-z-index-in-front, 1);
          background: var(
            --neo-list-section-bg-color,
            linear-gradient(to top, transparent 5%, oklch(from var(--neo-background-color) l c h / 50%) 20%, var(--neo-background-color))
          );
        }

        &.neo-reverse {
          justify-content: flex-end;
          text-align: end;
        }
      }
    }

    &.neo-scroll,
    &.neo-rounded {
      padding-block: var(--neo-menu-scroll-padding, 0.625rem);

      &:not(.neo-scroll) :global(> .neo-menu-item) {
        padding: 0 var(--neo-menu-padding, var(--neo-gap-xxs, 0.5rem));
      }

      .neo-menu-list-section-label {
        top: -0.75rem;
      }
    }

    &.neo-scroll {
      &.neo-shadow {
        @include mixin.fade-scroll(1rem);
      }

      @include mixin.scrollbar($button-height: var(--neo-menu-scrollbar-padding, 0.5rem));
    }

    &.neo-flip {
      flex-direction: column-reverse;
      justify-content: end;
    }
  }
</style>
