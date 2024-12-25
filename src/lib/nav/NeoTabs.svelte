<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { height, width } from '@dvcol/svelte-utils/transition';

  import { untrack } from 'svelte';

  import type { NeoTabContextPositions, NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';

  import type { NeoTabsProps, OnChange } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import { setTabContext } from '~/nav/neo-tabs-context.svelte.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    panes,

    // States
    ref = $bindable(),
    active = $bindable(),
    disabled,

    // Styles
    before,
    toggle,
    close,
    add,
    line,
    slide = true,
    slideElevation = -2,

    // Events
    onchange,
    onclose,
    onadd,

    // Other props
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoTabsProps = $props();
  /* eslint-enable prefer-const */

  // reflect context active to component
  const onChange: OnChange = (_tabId, _new, _old) => {
    active = _tabId;
    onchange?.(_tabId, _new, _old);
  };

  const context = setTabContext({ onChange, onClose: onclose });
  const transition = $derived(rest.vertical ? height : width);

  let translate = $state(transform(context.position));
  // Function to compute the transform
  function transform({ oldTab, newTab }: NeoTabContextPositions) {
    if (!newTab) return;
    if (!oldTab) return;

    // Calculate the difference in positions
    const offsetX = oldTab.left - newTab.left;
    const offsetY = oldTab.top - newTab.top;

    // Apply the transform to position absDiv over targetDiv
    return `--neo-tabs-transform: translate(${offsetX}px, ${offsetY}px); --neo-tab-old-width: ${oldTab.width}px; --neo-tab-old-height: ${oldTab.height}px;`;
  }

  $effect.pre(() => {
    if (!slide) return;
    translate = transform(context.position);
  });

  const style = $derived(toStyle(containerProps?.style, translate));

  // reflect component active to context
  $effect(() => {
    if (active === context.active) return;
    untrack(() => context.onChange(active));
  });

  $effect.pre(() => {
    context.onOption({
      // States
      disabled,

      // Styles
      slide,
      toggle,
      add,
      close,

      // Groups
      borderless: rest.borderless,
      elevation: rest.elevation,
      pressed: rest.pressed,
      convex: rest.convex,
      glass: rest.glass,
      start: rest.start,
      vertical: rest.vertical,
    });
  });

  const slideShadow = $derived(computeShadowElevation(slideElevation, { glass: rest.glass }));

  const inFn = $derived(toTransition(containerProps?.in ?? containerProps?.transition));
  const inProps = $derived(toTransitionProps(containerProps?.in ?? containerProps?.transition));
  const outFn = $derived(toTransition(containerProps?.out ?? containerProps?.transition));
  const outProps = $derived(toTransitionProps(containerProps?.out ?? containerProps?.transition));

  const useFn = $derived(toAction(containerProps?.use));
  const useProps = $derived(toActionProps(containerProps?.use));
</script>

{#snippet icon()}
  <IconAdd class="neo-tabs-add" />
{/snippet}

{#snippet tabs(ctx: NeoTabsContext = context.state)}
  <svelte:element
    this={containerTag}
    bind:this={ref}
    class:neo-tabs={true}
    class:neo-inset={(rest?.elevation ?? 0) < 0}
    class:neo-add={add}
    class:neo-line={line}
    class:neo-slide={slide}
    class:neo-translate={translate}
    class:neo-vertical={rest.vertical}
    class:neo-rounded={rest.rounded}
    style:--neo-tabs-slide-box-shadow={slideShadow}
    {...containerProps}
    use:useFn={useProps}
    out:outFn={outProps}
    in:inFn={inProps}
    {style}
  >
    <NeoButtonGroup role="tablist" {...rest}>
      {@render children?.(ctx)}
      {#if add}
        <div transition:transition={{ duration: 200, css: `overflow: hidden; white-space: nowrap` }}>
          <NeoButton onclick={onadd} {icon} />
        </div>
      {/if}
    </NeoButtonGroup>
  </svelte:element>
{/snippet}

{#if before}
  {@render panes?.(context.state)}
{/if}

{@render tabs()}

{#if !before}
  {@render panes?.(context.state)}
{/if}

<style lang="scss">
  .neo-tabs {
    display: inline-flex;
    flex: 0 1 auto;
    flex-flow: row wrap;

    :global(.neo-tabs-add) {
      min-width: 1rem;
    }

    &.neo-vertical {
      :global(.neo-tab) {
        position: relative;
        width: 100%;
        min-width: max-content;
      }

      :global(.neo-tab .neo-button) {
        justify-content: flex-start;
      }

      :global(.neo-tab-close .neo-icon-close) {
        position: absolute;
        top: calc(50% - 0.5rem);
      }

      :global(.neo-tab-close:not(.neo-reverse) .neo-icon-close) {
        right: 0.75rem;
      }

      :global(.neo-tab-close.neo-reverse .neo-icon-close) {
        left: 0.75rem;
      }

      &.neo-add :global(.neo-button-group) {
        padding-bottom: 0.5rem;
      }

      &.neo-line {
        :global(.neo-tab::before) {
          --neo-tab-width: 2px;
          --neo-tab-old-width: 2px;
          --neo-tab-old-max-height: calc(var(--neo-tab-old-height, 100%) - 1rem);
          --neo-tab-max-height: calc(var(--neo-tab-height, 100%) - 1rem);

          top: 0;
          box-sizing: border-box;
          width: 2px;
          height: 0;
          max-height: var(--neo-tab-max-height);
          margin-left: 0.3rem;
          transition:
            box-shadow 0.3s ease,
            height 0.3s var(--neo-transition-bezier);
          margin-block: 0.5rem;
        }

        :global(.neo-tab.neo-active::before) {
          height: var(--neo-tab-height, 100%);
        }
      }
    }

    &.neo-add:not(.neo-vertical) :global(.neo-button-group) {
      padding-right: 0.5rem;
    }

    &.neo-slide {
      --neo-tab-width: 100%;
      --neo-tab-height: 100%;

      :global(.neo-tab .neo-button) {
        box-shadow: var(--neo-box-shadow-flat) !important;
      }

      :global(.neo-tab .neo-button:hover) {
        color: var(--neo-tabs-text-color-hover, var(--neo-text-color-hover));
        transition:
          opacity 0.3s ease,
          color 0.1s ease,
          background-color 0.3s ease,
          border-color 0.3s ease,
          backdrop-filter 0.3s ease,
          border-radius 0.3s ease,
          box-shadow 0.15s ease-out;
      }

      :global(.neo-tab) {
        position: relative;
      }

      :global(.neo-tab::before) {
        position: absolute;
        inset: 0;
        z-index: var(--neo-z-index-in-front, 1);
        box-sizing: border-box;
        border: var(--neo-border-width, 1px) var(--neo-tab-border-color, transparent) solid;
        border-radius: var(--neo-tab-border-radius, var(--neo-border-radius));
        box-shadow: var(--neo-box-shadow-flat);
        backface-visibility: hidden;
        transition: box-shadow 0.3s ease;
        content: '';
        pointer-events: none;
      }

      &.neo-line :global(.neo-tab.neo-active::before) {
        top: unset;
        bottom: 0;
        background-color: var(--neo-color-primary, var(--neo-text-color));
        box-shadow: var(--neo-box-shadow-flat);
      }

      &.neo-line:not(.neo-vertical) {
        :global(.neo-tab::before) {
          --neo-tab-height: 2px;
          --neo-tab-old-height: 2px;
          --neo-tab-old-max-width: calc(var(--neo-tab-old-width, 100%) - 1.5rem);
          --neo-tab-max-width: calc(var(--neo-tab-width, 100%) - 1.5rem);

          width: 0;
          max-width: var(--neo-tab-max-width);
          height: 2px;
          margin-bottom: 0.125rem;
          transition:
            box-shadow 0.3s ease,
            width 0.3s var(--neo-transition-bezier);
          margin-inline: 0.75rem;
        }

        :global(.neo-tab.neo-active::before) {
          width: var(--neo-tab-width, 100%);
        }
      }

      :global(.neo-tab.neo-active::before) {
        box-shadow: var(--neo-tabs-slide-box-shadow, var(--neo-box-shadow-inset-2));
      }

      &.neo-translate :global(.neo-tab.neo-active::before) {
        animation: slide 0.6s var(--neo-transition-bezier) forwards;
      }

      @keyframes slide {
        0% {
          width: var(--neo-tab-old-width, var(--neo-tab-width, 100%));
          max-width: var(--neo-tab-old-max-width);
          height: var(--neo-tab-old-height, var(--neo-tab-height, 100%));
          max-height: var(--neo-tab-old-max-height);
          box-shadow: var(--neo-tabs-slide-box-shadow, var(--neo-box-shadow-inset-2));
          transform: var(--neo-tabs-transform);
        }

        100% {
          width: var(--neo-tab-width, 100%);
          max-width: var(--neo-tab-max-width);
          height: var(--neo-tab-height, 100%);
          max-height: var(--neo-tab-max-height);
          box-shadow: var(--neo-tabs-slide-box-shadow, var(--neo-box-shadow-inset-2));
          transform: translate(0, 0);
        }
      }

      @keyframes fade {
        0% {
          box-shadow: var(--neo-box-shadow-flat);
        }

        100% {
          box-shadow: var(--neo-box-shadow-inset-3);
        }
      }

      &.neo-rounded :global(.neo-button-group .neo-tab::before) {
        border-radius: var(--neo-tab-border-radius, var(--neo-border-radius-lg));
      }
    }
  }
</style>
