<script lang="ts">
  import { height, width } from '@dvcol/svelte-utils/transition';

  import { tick, untrack } from 'svelte';

  import type { NeoTabProps } from '~/nav/neo-tab.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';
  import { getTabContext } from '~/nav/neo-tabs-context.svelte.js';
  import { toAction, toActionProps } from '~/utils/action.utils.js';
  import { defaultTransitionDuration, enterFreezeTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    tabId = crypto.randomUUID(),
    value,

    // styles
    close,

    // Events
    onclick,
    onclose,

    // Other props
    tabProps,
    ...rest
  }: NeoTabProps = $props();
  /* eslint-enable prefer-const */

  const context = getTabContext();
  const pane = $derived(context?.getPane(tabId)?.toString());
  const active = $derived(context?.active === tabId);
  const disabled = $derived(rest.disabled || (rest.disabled !== false && context?.state?.disabled));
  const closeable = $derived(close || (close !== false && context?.state?.close));
  const transition = $derived(context?.state?.vertical ? height : width);
  const slide = $derived(context?.state?.slide);

  const onClick: NeoTabProps['onclick'] = e => {
    context?.onChange(tabId);
    onclick?.(e);
  };

  let skip = $state(true);
  // Skip enter transition on first render if closeable
  const waitForTick = async () => {
    await tick();
    skip = false;
  };

  $effect(() => {
    if (skip) waitForTick();
    untrack(() => {
      if (!ref) return;
      context?.register(tabId, { ref, value });
    });
    return () => context?.remove(tabId);
  });

  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onclose?.(tabId);
    context?.onClose(tabId);
  };

  const useFn = $derived(toAction(tabProps?.use));
  const useProps = $derived(toActionProps(tabProps?.use));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  data-tab-id={tabId}
  data-active={active}
  class:neo-tab={true}
  class:neo-active={active}
  class:neo-slide={slide}
  transition:transition={enterFreezeTransition}
  {...tabProps}
  use:useFn={useProps}
>
  <NeoButton
    id="neo-tab-{String(tabId)}"
    role="tab"
    aria-controls={pane}
    aria-selected={active}
    toggle
    readonly
    checked={active}
    onclick={onClick}
    empty={!children}
    {...rest}
    {disabled}
  >
    {@render children?.({ active, tabId, value })}
    {#if closeable}
      <button
        class="neo-tab-close"
        aria-label="Close tab"
        class:neo-reverse={rest.reverse}
        class:neo-disabled={disabled}
        transition:width={{ duration: skip ? 0 : defaultTransitionDuration }}
        onclick={onClose}
      >
        <IconClose class="neo-icon-close" />
      </button>
    {/if}
  </NeoButton>
</svelte:element>

<style lang="scss">
  .neo-tab {
    display: flex;

    :global(.neo-button:active),
    :global(.neo-button.pressed),
    :global(.neo-button:focus-visible),
    :global(.neo-button:hover) {
      :global(.neo-icon-close) {
        opacity: 1;
        pointer-events: auto;
      }
    }

    :global(.neo-button .neo-icon-close:focus-visible) {
      transition: none;
    }
  }

  .neo-tab-close {
    display: inline-flex;
    width: calc(1rem + var(--neo-tab-icon-gap, 0.3rem) + var(--neo-tab-icon-gap-offset, -0.1875rem));
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;

    &.neo-disabled {
      cursor: not-allowed;
      pointer-events: none;
    }

    :global(.neo-icon-close) {
      margin-right: var(--neo-tab-icon-gap-offset, -0.1875rem);
      margin-left: var(--neo-tab-icon-gap, 0.3rem);
      padding: 0.1rem;
      border-radius: 50%;
      opacity: 0;
      transition:
        opacity 0.2s ease-in,
        color 0.3s ease,
        background-color 0.3s ease;
      pointer-events: none;
    }

    &:focus-visible :global(.neo-icon-close) {
      color: var(--neo-close-color-focused, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
      opacity: 1;
      transition: none;
    }

    &:hover :global(.neo-icon-close) {
      color: var(--neo-close-color, rgb(255 0 0));
      background-color: var(--neo-close-bg-color-hover, rgb(255 0 0 / 10%));
      opacity: 1;
    }

    &.neo-reverse :global(.neo-icon-close) {
      margin-right: var(--neo-tab-icon-gap, 0.3rem);
      margin-left: var(--neo-tab-icon-gap-offset, -0.1875rem);
    }
  }
</style>
