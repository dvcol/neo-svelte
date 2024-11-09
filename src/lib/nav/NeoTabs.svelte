<script lang="ts">
  import { height, width } from '@dvcol/svelte-utils/transition';

  import type { OnChange, TabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import { setTabContext } from '~/nav/neo-tabs-context.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    active = $bindable(),
    disabled,

    // Styles
    slide, // todo
    close,
    add,

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
  const onChange: OnChange = (_tabId, _value) => {
    active = _tabId;
    onchange?.(_tabId, _value);
  };

  const context = setTabContext(active, { onChange, onClose: onclose });
  const transition = $derived(rest.vertical ? height : width);

  // reflect component active to context
  $effect(() => {
    if (active === context.active) return;
    context.onChange(active);
  });

  $effect(() => {
    context.onOption({ slide, closeable: close, disabled, vertical: rest.vertical });
  });
</script>

{#snippet icon()}
  <IconAdd />
{/snippet}

<div class="neo-tabs" class:add class:slide class:flat={rest.flat} class:text={rest.text} class:vertical={rest.vertical} {...tabsProps}>
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
    }

    &.add:not(.vertical) :global(.neo-button-group) {
      padding-right: 0.5rem;
    }

    &.slide {
      position: relative;

      :global(.neo-tab .neo-button) {
        box-shadow: var(--box-shadow-flat);
      }

      &.text {
        ::after {
          position: absolute;
          bottom: 2px;
          left: var(--neo-tab-active-left, 0);
          width: var(--neo-tab-active-width, 1.5rem);
          height: 2px;
          background-color: var(--color-primary);
          transition:
            left 1s var(--transition-bezier),
            bottom 1s var(--transition-bezier),
            width 1s var(--transition-bezier);
          content: '';
        }
      }
    }
  }
</style>
