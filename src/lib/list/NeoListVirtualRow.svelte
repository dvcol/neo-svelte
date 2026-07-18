<script lang="ts">
  import type { NeoListVirtualRowProps } from '~/list/neo-list-virtual-row.model.js';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';

  const {
    // Snippets
    itemRender,

    // Context
    item,
    id,
    index,
    virtualIndex,
    setSize,
    checked,
    context,

    // States
    select,
    highlight,
    reverse,
    disabled,
    readonly,
    dividerTop,
    dividerBottom,

    // Styles
    rounded,

    // Transitions
    transitionIn,
    transitionOut,

    // Events
    ontoggle,

    // Attachments
    register,

    // Other props
    buttonProps,
    itemProps,
    dividerProps,
  }: NeoListVirtualRowProps = $props();

  const onClick = $derived.by(() => {
    if (!select) return undefined;
    return () => ontoggle?.({ index, item, sectionIndex: item.sectionIndex, section: item.section }, checked);
  });
</script>

<svelte:element
  this={item.tag ?? 'li'}
  role={select ? 'option' : 'listitem'}
  data-id={item.id}
  data-index={index}
  aria-selected={checked}
  aria-posinset={virtualIndex + 1}
  aria-setsize={setSize}
  class:neo-list-item={true}
  class:neo-checked={checked}
  class:neo-list-item-select={select}
  style:--neo-list-item-color={getColorVariable(item.color)}
  {...item.containerProps}
  in:transitionIn={id}
  out:transitionOut={id}
  {@attach register}
>
  {#if dividerTop}
    <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
  {/if}
  {#if itemRender && !item.render}
    {@render itemRender({ item, index, checked, context })}
  {:else}
    <NeoListBaseItem
      {item}
      {index}
      {context}
      {checked}
      {select}
      {highlight}
      {buttonProps}
      {reverse}
      {rounded}
      flip={false}
      {disabled}
      {readonly}
      {...itemProps}
      onclick={onClick}
    />
  {/if}
  {#if dividerBottom}
    <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/layers' as layers;

  @include layers.neo-components {
    .neo-list-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
      transition: opacity 0.2s linear;
      transition-delay: 0s;

      :global(> .neo-list-item-button) {
        width: 100%;
      }

      :global(> .neo-list-item-divider) {
        color: var(--neo-list-divider-color, var(--neo-text-color));
        margin-block: 0.5rem;
      }

      &:hover,
      &:focus,
      &:focus-within {
        :global(> .neo-list-section-title),
        :global(> .neo-list-item-button .neo-list-item-content) {
          color: var(--neo-text-color-highlight);
        }

        :global(> .neo-list-item-button .neo-list-item-description),
        :global(> .neo-list-item-button .neo-list-item-tags) {
          color: var(--neo-text-color-secondary-highlight);
        }
      }
    }
  }
</style>
