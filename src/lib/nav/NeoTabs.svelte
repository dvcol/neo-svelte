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
  import { coerce, computeShadowElevation, getDefaultElevation, getDefaultSlideElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    panes,

    // States
    ref = $bindable(),
    active = $bindable(),
    value = $bindable(),
    disabled,

    // Styles
    before,
    toggle,
    close,
    add,
    line,
    pill,
    slide = true,
    pressed,
    dim = true,

    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    slideElevation: _slideElevation,

    // Events
    onchange,
    onclose,
    onadd,

    // Other props
    containerProps,
    ...rest
  }: NeoTabsProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const elevation = $derived(coerce(_elevation));
  const slideElevation = $derived(coerce(_slideElevation ?? getDefaultSlideElevation(elevation)));

  // reflect context active to component
  const onChange: OnChange = (_tabId, _new, _old) => {
    active = _tabId;
    value = _new;
    onchange?.(_tabId, _new, _old);
  };

  const context = setTabContext({ onChange, onClose: onclose });
  const transition = $derived(rest.vertical ? height : width);

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

  const translate = $derived(slide ? transform(context.position) : undefined);
  const style = $derived(toStyle(containerRest?.style, translate));

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
      elevation,
      pressed,
      convex: rest.convex,
      glass: rest.glass,
      start: rest.start,
      vertical: rest.vertical,
    });
  });

  const slideShadow = $derived(computeShadowElevation(slideElevation, { glass: rest.glass }));

  const inFn = $derived(toTransition(containerRest?.in ?? containerRest?.transition));
  const inProps = $derived(toTransitionProps(containerRest?.in ?? containerRest?.transition));
  const outFn = $derived(toTransition(containerRest?.out ?? containerRest?.transition));
  const outProps = $derived(toTransitionProps(containerRest?.out ?? containerRest?.transition));

  const useFn = $derived(toAction(containerRest?.use));
  const useProps = $derived(toActionProps(containerRest?.use));
</script>

{#snippet icon()}
  <IconAdd class="neo-tabs-add" />
{/snippet}

{#snippet tabs(ctx: NeoTabsContext = context.state)}
  <svelte:element
    this={containerTag}
    bind:this={ref}
    class:neo-tabs={true}
    class:neo-inset={(elevation ?? 0) < 0}
    class:neo-add={add}
    class:neo-line={line}
    class:neo-pill={pill}
    class:neo-slide={slide}
    class:neo-translate={translate}
    class:neo-vertical={rest.vertical}
    class:neo-rounded={rest.rounded}
    class:neo-dim={dim}
    style:--neo-tabs-slide-box-shadow={slideShadow}
    {...containerRest}
    use:useFn={useProps}
    out:outFn={outProps}
    in:inFn={inProps}
    {style}
  >
    <NeoButtonGroup role="tablist" {pressed} {elevation} {...rest} class={['neo-tabs-group', rest.class]}>
      {@render children?.(ctx)}
      {#if add}
        <div transition:transition={{ duration: 200, css: `overflow: hidden; white-space: nowrap` }}>
          <NeoButton aria-label="Add new tab" onclick={onadd} {icon} />
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

    :global(> .neo-tabs-group .neo-tabs-add) {
      min-width: 1rem;
    }

    &.neo-dim {
      :global(> .neo-tabs-group:has(> .neo-tab:hover) > .neo-tab:not(:hover, .neo-active, :has(*:focus-visible))),
      :global(> .neo-tabs-group:has(> .neo-tab *:focus-visible) > .neo-tab:not(:hover, .neo-active, :has(*:focus-visible))) {
        opacity: 0.6;
      }
    }

    &.neo-vertical {
      :global(> .neo-tabs-group .neo-tab) {
        position: relative;
        width: 100%;
        min-width: max-content;
      }

      :global(> .neo-tabs-group .neo-tab .neo-tab-button) {
        justify-content: flex-start;
      }

      &.neo-add :global(> .neo-tabs-group) {
        padding-bottom: 0.5rem;
      }

      &.neo-line {
        :global(> .neo-tabs-group .neo-tab::before) {
          --neo-tab-width: 2px;
          --neo-tab-old-width: 2px;
          --neo-tab-old-max-height: calc(var(--neo-tab-old-height, 100%) - 1rem);
          --neo-tab-max-height: calc(var(--neo-tab-height, 100%) - 1rem);

          top: 0;
          bottom: unset;
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

        :global(> .neo-tabs-group .neo-tab.neo-active::before) {
          height: var(--neo-tab-height, 100%);
        }
      }
    }

    &.neo-add:not(.neo-vertical) :global(> .neo-tabs-group) {
      padding-right: 0.5rem;
    }

    &.neo-slide {
      --neo-tab-width: 100%;
      --neo-tab-height: 100%;

      :global(> .neo-tabs-group .neo-tab .neo-tab-button) {
        box-shadow: var(--neo-box-shadow-flat) !important;
      }

      :global(> .neo-tabs-group .neo-tab .neo-tab-button > .neo-content) {
        scale: 1 !important;
      }

      :global(> .neo-tabs-group .neo-tab) {
        position: relative;
      }

      :global(> .neo-tabs-group .neo-tab::before) {
        position: absolute;
        z-index: var(--neo-z-index-in-front, 1);
        box-sizing: border-box;
        background-color: var(--neo-tab-bg-color, transparent);
        border: var(--neo-border-width, 1px) var(--neo-tab-border-color, transparent) solid;
        border-radius: var(--neo-tab-border-radius, var(--neo-border-radius));
        box-shadow: var(--neo-box-shadow-flat);
        backface-visibility: hidden;
        transition: box-shadow 0.3s ease;
        content: '';
        pointer-events: none;
        inset: 0;
      }

      &.neo-line :global(> .neo-tabs-group .neo-tab.neo-active::before) {
        top: unset;
        bottom: 0;
        background-color: var(--neo-color-primary, var(--neo-text-color));
        box-shadow: var(--neo-box-shadow-flat);
      }

      &.neo-line:not(.neo-vertical) {
        :global(> .neo-tabs-group .neo-tab::before) {
          --neo-tab-height: 2px;
          --neo-tab-old-height: 2px;
          --neo-tab-old-max-width: calc(var(--neo-tab-old-width, 100%) - 1.5rem);
          --neo-tab-max-width: calc(var(--neo-tab-width, 100%) - 1.5rem);

          top: unset;
          bottom: 0;
          width: 0;
          max-width: var(--neo-tab-max-width);
          height: 2px;
          margin-bottom: 0.125rem;
          transition:
            box-shadow 0.3s ease,
            height 0.3s var(--neo-transition-bezier);
          margin-inline: 0.75rem;
        }

        :global(> .neo-tabs-group .neo-tab.neo-active::before) {
          width: var(--neo-tab-width, 100%);
        }
      }

      &.neo-pill:not(.neo-line) {
        :global(> .neo-tabs-group .neo-tab::before) {
          --neo-tabs-slide-box-shadow: var(--neo-box-shadow-flat);

          z-index: var(--neo-z-index-behind, -1) !important;
          transition:
            box-shadow 0.3s ease,
            background-color 0.3s linear;
        }

        :global(> .neo-tabs-group .neo-tab.neo-active::before) {
          background-color: var(--neo-tab-bg-color, var(--neo-background-color-secondary));
        }

        &:hover :global(> .neo-tabs-group .neo-tab.neo-active::before) {
          background-color: var(--neo-tab-bg-color-hover, var(--neo-background-color-secondary-hover));
        }
      }

      :global(> .neo-tabs-group .neo-tab.neo-active::before) {
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

      &.neo-rounded :global(> .neo-tabs-group .neo-tab::before) {
        border-radius: var(--neo-tab-border-radius, var(--neo-border-radius-lg));
      }
    }
  }
</style>
