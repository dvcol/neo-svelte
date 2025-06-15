<script lang="ts">
  import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
  import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';

  import { isSafari } from '@dvcol/common-utils/common/browser';
  import { tick } from 'svelte';

  import NeoMenuListItem from '~/floating/menu/NeoMenuListItem.svelte';

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
    divider,
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

{#snippet list(array: NeoMenuItem[], sectionIndex = undefined)}
  {#each array as item, index (item.id ?? index)}
    <NeoMenuListItem
      {keepOpenOnSelect}
      {rounded}
      {reverse}
      menuTag={tag}
      {...itemProps}
      {item}
      {parent}
      {array}
      {index}
      {sectionIndex}
      {level}
      {divider}
      flip={flip && !isSafari()}
      {tooltipProps}
      {baseProps}
      menuProps={{ tag, shadow, scrollbar, rounded, reverse, flip, divider, dividerProps, tooltipProps, baseProps, ...rest, ...item.menuProps }}
      onMenu={(i, e) => {
        item.menuProps?.onMenu?.(i, e);
        onMenu?.(i, e);
      }}
      onSelect={(i, e) => {
        item.menuProps?.onSelect?.(i, e);
        onSelect?.(i, e);
      }}
    />
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
    padding: var(--neo-menu-padding, var(--neo-gap-4xs, 0.25rem)) 0;
    overflow: auto;

    :global(.neo-menu-item-divider[data-elevation='0']) {
      margin: var(--neo-menu-margin, var(--neo-gap-3xs, 0.3125rem)) 0;
    }

    :global(.neo-menu-item-divider:not([data-elevation='0'])) {
      --neo-divider-margin: var(--neo-menu-margin, var(--neo-gap-3xs, 0.3125rem));
    }

    &.neo-scroll,
    &.neo-rounded {
      padding-block: var(--neo-menu-scroll-padding, 0.5rem);
      gap: var(--neo-menu-scroll-gap, 0.125rem);

      &:not(.neo-scroll) :global(> .neo-menu-item) {
        padding: 0 var(--neo-menu-padding, var(--neo-gap-xxs, 0.5rem));
      }

      :global(.neo-menu-item-section-label) {
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
      // TODO: remove when Safari supports `flex-direction: column-reverse;` with correct padding
      @supports not ((hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none)) {
        flex-direction: column-reverse;
        justify-content: end;
      }
    }
  }
</style>
