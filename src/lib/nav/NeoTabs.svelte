<script lang="ts">
  import { height, width } from '@dvcol/svelte-utils/transition';

  import { untrack } from 'svelte';

  import type { OnChange, TabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import { type NeoTabContextPositions, setTabContext } from '~/nav/neo-tabs-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    active = $bindable(),
    disabled,

    // Styles
    slide,
    close,
    add,
    line,

    // Events
    onchange,
    onclose,
    onadd,

    // Other props
    tabsProps,
    ...rest
  }: TabsProps = $props();
  /* eslint-enable prefer-const */

  // reflect context active to component
  const onChange: OnChange = (_tabId, _value, _ref) => {
    active = _tabId;
    onchange?.(_tabId, _value, _ref);
  };

  const context = setTabContext({ onChange, onClose: onclose });
  const transition = $derived(rest.vertical ? height : width);

  let position = $state(transform(context.position));
  // Function to compute the transform
  function transform({ oldTab, newTab }: NeoTabContextPositions) {
    if (!newTab) return;
    if (!oldTab) return;

    // Calculate the difference in positions
    const offsetX = oldTab.left - newTab.left;
    const offsetY = oldTab.top - newTab.top;

    // Apply the transform to position absDiv over targetDiv
    return `--transform: translate(${offsetX}px, ${offsetY}px); --neo-tab-old-width: ${oldTab.width}px; --neo-tab-old-height: ${oldTab.height}px;`;
  }

  $effect.pre(() => {
    if (!slide) return;
    position = transform(context.position);
  });

  const style = $derived([tabsProps?.style, position].filter(Boolean).join('; '));

  $inspect(position).with((...args) => console.info('position', ...args));

  // reflect component active to context
  $effect(() => {
    console.info('active', active, context.active);
    if (active === context.active) return;
    untrack(() => context.onChange(active));
  });

  $effect(() => {
    context.onOption({ slide, line, closeable: close, disabled, vertical: rest.vertical });
  });
</script>

{#snippet icon()}
  <IconAdd />
{/snippet}

<div
  class="neo-tabs"
  class:add
  class:line
  class:slide
  class:animate={!!position}
  class:flat={rest.flat}
  class:text={rest.text}
  class:vertical={rest.vertical}
  class:rounded={rest.rounded}
  {...tabsProps}
  {style}
>
  <NeoButtonGroup {...rest}>
    {@render children?.({ active, disabled, slide, close, add, vertical: rest.vertical })}
    {#if add}
      <div transition:transition={{ duration: 200, css: `overflow: hidden; white-space: nowrap` }}>
        <NeoButton onclick={onadd} {icon} />
      </div>
    {/if}
  </NeoButtonGroup>
</div>

<style lang="scss">
  .neo-tabs {
    &.vertical {
      :global(.neo-tab) {
        position: relative;
        width: 100%;
      }

      :global(.neo-tab .neo-button) {
        justify-content: flex-start;
      }

      :global(.neo-tab-close .icon-close) {
        position: absolute;
        top: calc(50% - 0.5rem);
      }

      :global(.neo-tab-close:not(.reverse) .icon-close) {
        right: 0.75rem;
      }

      :global(.neo-tab-close.reverse .icon-close) {
        left: 0.75rem;
      }

      &.add :global(.neo-button-group) {
        padding-bottom: 0.5rem;
      }

      &.line :global(.neo-tab.active::before) {
        --neo-tab-full-width: 2px;
        --neo-tab-old-width: 2px;
      }
    }

    &.add:not(.vertical) :global(.neo-button-group) {
      padding-right: 0.5rem;
    }

    &.slide {
      --neo-tab-full-width: 100%;
      --neo-tab-full-height: 100%;

      :global(.neo-tab .neo-button) {
        box-shadow: var(--box-shadow-flat);
        transition: none;
      }

      :global(.neo-tab) {
        position: relative;
        box-shadow: var(--box-shadow-flat);
      }

      :global(.neo-tab::before) {
        position: absolute;
        top: calc(0 - var(--border-width, 1px));
        left: calc(0 - var(--border-width, 1px));
        z-index: var(--z-index-in-front, 1);
        width: var(--neo-tab-full-width, 100%);
        height: var(--neo-tab-full-height, 100%);
        border: var(--border-width, 1px) var(--neo-tab-border-color, transparent) solid;
        border-radius: var(--neo-tab-border-radius, var(--border-radius));
        box-shadow: var(--box-shadow-flat);
        backface-visibility: hidden;
        transition: box-shadow 0.3s ease;
        content: '';
        pointer-events: none;
      }

      &.line :global(.neo-tab.active::before) {
        bottom: 0;
        height: 2px;
        background-color: var(--color-primary, var(--text-color));
        box-shadow: var(--box-shadow-flat);
        transition:
          box-shadow 0.3s ease,
          width 0.3s var(--transition-bezier);
      }

      &.line:not(.vertical) :global(.neo-tab.active::before) {
        --neo-tab-full-height: 2px;
        --neo-tab-old-height: 2px;
      }

      :global(.neo-tab.active::before) {
        box-shadow: var(--box-shadow-inset-2);
      }

      &.animate :global(.neo-tab.active::before) {
        animation: slide 0.5s var(--transition-bezier) forwards;
      }

      @keyframes slide {
        0% {
          width: var(--neo-tab-old-width, var(--neo-tab-full-width, 100%));
          height: var(--neo-tab-old-height, var(--neo-tab-full-height, 100%));
          box-shadow: var(--box-shadow-inset-2);
          transform: var(--transform);
        }

        100% {
          width: var(--neo-tab-full-width, 100%);
          height: var(--neo-tab-full-height, 100%);
          box-shadow: var(--box-shadow-inset-2);
          transform: translate(0, 0);
        }
      }

      @keyframes fade {
        0% {
          box-shadow: var(--box-shadow-flat);
        }

        100% {
          box-shadow: var(--box-shadow-inset-2);
        }
      }

      &.rounded :global(.neo-button-group .neo-tab::before) {
        border-radius: var(--neo-tab-border-radius, var(--border-radius-lg));
      }
    }
  }
</style>
